import { ref } from 'vue'
import { initFirebase } from '../../../shared/firebase'
import { FIRESTORE_COLLECTIONS } from '../../../shared/constants'
import type {
  FirestorePresentation,
  FirestoreParticipant,
  FirestoreBallot,
  FirestorePollResponse,
  CrewMember,
  PollChoice,
  SessionPhase,
} from '../../../shared/types'
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  onSnapshot,
  type Unsubscribe,
  type Firestore,
} from 'firebase/firestore'

// Module-level state (singleton)
const isConnected = ref(false)
let presentationId: string | null = null
let db: Firestore | null = null

// Active listeners
const permanentUnsubscribers: Unsubscribe[] = []
let ballotsUnsubscribe: Unsubscribe | null = null
let pollResponsesUnsubscribe: Unsubscribe | null = null

// ---- Connection ----

function connect(): boolean {
  db = initFirebase()
  if (db) {
    isConnected.value = true
    console.log('[Firestore] Connected')
    return true
  }
  isConnected.value = false
  console.warn('[Firestore] Not connected — offline mode')
  return false
}

function disconnect() {
  permanentUnsubscribers.forEach(unsub => unsub())
  permanentUnsubscribers.length = 0
  stopListeningToBallots()
  stopListeningToPollResponses()
  isConnected.value = false
  db = null
  presentationId = null
}

// ---- Session ----

async function createPresentation(keynoteId: string, sessionId: string): Promise<string | null> {
  if (!db) return null

  presentationId = sessionId

  try {
    const presRef = doc(db, FIRESTORE_COLLECTIONS.PRESENTATIONS, presentationId)
    const presData: FirestorePresentation = {
      keynoteId,
      createdAt: Date.now(),
      active: true,
      phase: 'lobby',
    }
    await setDoc(presRef, presData)

    const configRef = doc(db, FIRESTORE_COLLECTIONS.CONFIG, 'current')
    await setDoc(configRef, { activePresentationId: presentationId })

    console.log('[Firestore] Presentation created:', presentationId)
    return presentationId
  } catch (err) {
    console.error('[Firestore] Failed to create presentation:', err)
    return null
  }
}

function setPresentationId(id: string) {
  presentationId = id
}

function getPresentationId(): string | null {
  return presentationId
}

// ---- Publish session state ----

async function publishSessionState(phase: SessionPhase, data?: Record<string, unknown>) {
  if (!db || !presentationId) return

  const presRef = doc(db, FIRESTORE_COLLECTIONS.PRESENTATIONS, presentationId)

  // Build update: set phase + relevant data, null out irrelevant fields
  const update: Record<string, unknown> = { phase }

  if (phase === 'voting') {
    update.vote = data?.vote ?? null
    update.voteResult = null
    update.poll = null
    update.pollResult = null
  } else if (phase === 'vote-results') {
    update.vote = null
    update.voteResult = data?.voteResult ?? null
    update.poll = null
    update.pollResult = null
  } else if (phase === 'polling') {
    update.vote = null
    update.voteResult = null
    update.poll = data?.poll ?? null
    update.pollResult = null
  } else if (phase === 'poll-results') {
    update.vote = null
    update.voteResult = null
    update.poll = null
    update.pollResult = data?.pollResult ?? null
  } else {
    // idle or lobby
    update.vote = null
    update.voteResult = null
    update.poll = null
    update.pollResult = null
  }

  try {
    await updateDoc(presRef, update)
  } catch (err) {
    console.error('[Firestore] Failed to publish session state:', err)
  }
}

// ---- Participants ----

function listenToParticipants(callback: (member: CrewMember) => void) {
  if (!db || !presentationId) return

  const participantsRef = collection(
    db,
    FIRESTORE_COLLECTIONS.PRESENTATIONS,
    presentationId,
    FIRESTORE_COLLECTIONS.PARTICIPANTS
  )

  const unsub = onSnapshot(participantsRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const data = change.doc.data() as FirestoreParticipant
        callback({
          participantId: change.doc.id,
          name: data.name,
          avatar: data.avatar,
          joinedAt: data.createdAt,
        })
      }
    })
  }, (err) => {
    console.error('[Firestore] Participants listener error:', err)
  })

  permanentUnsubscribers.push(unsub)
}

// ---- Votes ----

function voteDocId(voteIndex: number): string {
  return `vote_${voteIndex}`
}

async function openVote(voteIndex: number, duration: number) {
  if (!db || !presentationId) return

  const voteId = voteDocId(voteIndex)
  const voteRef = doc(
    db,
    FIRESTORE_COLLECTIONS.PRESENTATIONS,
    presentationId,
    FIRESTORE_COLLECTIONS.VOTES,
    voteId
  )

  try {
    await setDoc(voteRef, {
      status: 'open',
      startTime: Date.now(),
      duration,
    })
    await publishSessionState('voting', { vote: { index: voteIndex } })
  } catch (err) {
    console.error('[Firestore] Failed to open vote:', err)
  }
}

async function closeVote(
  voteIndex: number,
  result: { winner: 'A' | 'B'; counts: { A: number; B: number }; total: number }
) {
  if (!db || !presentationId) return

  const voteId = voteDocId(voteIndex)
  const voteRef = doc(
    db,
    FIRESTORE_COLLECTIONS.PRESENTATIONS,
    presentationId,
    FIRESTORE_COLLECTIONS.VOTES,
    voteId
  )

  try {
    await updateDoc(voteRef, {
      status: 'closed',
      closedAt: Date.now(),
      result,
    })
    await publishSessionState('vote-results', {
      voteResult: { index: voteIndex, winner: result.winner, countA: result.counts.A, countB: result.counts.B }
    })
  } catch (err) {
    console.error('[Firestore] Failed to close vote:', err)
  }
}

function listenToBallots(voteIndex: number, callback: (participantId: string, choice: 'A' | 'B') => void) {
  stopListeningToBallots()
  if (!db || !presentationId) return

  const voteId = voteDocId(voteIndex)
  const ballotsRef = collection(
    db,
    FIRESTORE_COLLECTIONS.PRESENTATIONS,
    presentationId,
    FIRESTORE_COLLECTIONS.VOTES,
    voteId,
    FIRESTORE_COLLECTIONS.BALLOTS
  )

  ballotsUnsubscribe = onSnapshot(ballotsRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const data = change.doc.data() as FirestoreBallot
        callback(change.doc.id, data.choice)
      }
    })
  }, (err) => {
    console.error('[Firestore] Ballots listener error:', err)
  })
}

function stopListeningToBallots() {
  if (ballotsUnsubscribe) {
    ballotsUnsubscribe()
    ballotsUnsubscribe = null
  }
}

// ---- Polls ----

async function openPoll(pollId: string, duration: number) {
  if (!db || !presentationId) return

  const pollRef = doc(
    db,
    FIRESTORE_COLLECTIONS.PRESENTATIONS,
    presentationId,
    FIRESTORE_COLLECTIONS.POLLS,
    pollId
  )

  try {
    await setDoc(pollRef, {
      status: 'open',
      startTime: Date.now(),
      duration,
    })
    await publishSessionState('polling', { poll: { id: pollId } })
  } catch (err) {
    console.error('[Firestore] Failed to open poll:', err)
  }
}

async function closePoll(pollId: string, results: Record<string, number>) {
  if (!db || !presentationId) return

  const pollRef = doc(
    db,
    FIRESTORE_COLLECTIONS.PRESENTATIONS,
    presentationId,
    FIRESTORE_COLLECTIONS.POLLS,
    pollId
  )

  try {
    await updateDoc(pollRef, {
      status: 'closed',
      closedAt: Date.now(),
    })
    await publishSessionState('poll-results', {
      pollResult: { id: pollId, results }
    })
  } catch (err) {
    console.error('[Firestore] Failed to close poll:', err)
  }
}

function listenToPollResponses(pollId: string, callback: (participantId: string, choice: PollChoice) => void) {
  stopListeningToPollResponses()
  if (!db || !presentationId) return

  const responsesRef = collection(
    db,
    FIRESTORE_COLLECTIONS.PRESENTATIONS,
    presentationId,
    FIRESTORE_COLLECTIONS.POLLS,
    pollId,
    FIRESTORE_COLLECTIONS.RESPONSES
  )

  pollResponsesUnsubscribe = onSnapshot(responsesRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const data = change.doc.data() as FirestorePollResponse
        callback(change.doc.id, data.choice)
      }
    })
  }, (err) => {
    console.error('[Firestore] Poll responses listener error:', err)
  })
}

function stopListeningToPollResponses() {
  if (pollResponsesUnsubscribe) {
    pollResponsesUnsubscribe()
    pollResponsesUnsubscribe = null
  }
}

// ---- Fake participants (debug) ----

const PIRATE_NAMES = [
  'Blackbeard', 'Red Anne', 'Captain Hook', 'Calico Jack', 'Long John',
  'Davy Jones', 'Silver Beard', 'One-Eye Pete', 'Mad Mary', 'Iron Will',
  'Sea Dog', 'Storm Rider', 'Barnacle Bill', 'Salty Sam', 'Coral Kate',
  'Dread Pirate', 'Gold Tooth', 'Skull Face', 'Rum Runner', 'Wave Walker',
  'Anchor Al', 'Brig Boss', 'Crow Nell', 'Dark Tide', 'Ember Eve',
  'Fog Horn', 'Gale Force', 'Harbor Hank', 'Isle Ivy', 'Jolly Roger',
  'Keel Ken', 'Loot Lucy', 'Mast Mike', 'North Star', 'Oyster Oz',
  'Plank Pat', 'Quay Quinn', 'Reef Rob', 'Shark Sal', 'Timber Tom',
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomAvatar(): string {
  const gender: 'male' | 'female' = Math.random() > 0.5 ? 'male' : 'female'
  const maxAccessories = gender === 'male' ? 4 : 3
  const accessoryCount = randomInt(0, 2)
  const allAccessories = Array.from({ length: maxAccessories }, (_, i) => i + 1)
  const regular: number[] = []
  for (let i = 0; i < accessoryCount; i++) {
    const idx = randomInt(0, allAccessories.length - 1)
    regular.push(allAccessories.splice(idx, 1)[0])
  }

  const avatar = {
    gender,
    skinTone: ['dark', 'mid', 'light'][randomInt(0, 2)],
    mouth: randomInt(1, 3),
    eyes: { option: randomInt(1, 3), color: randomInt(1, 4) },
    nose: randomInt(1, 4),
    accessories: {
      regular,
      eyePatch: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'left' : 'right') : null,
    },
    hair: Math.random() > 0.3 ? { option: randomInt(1, 3), color: randomInt(1, 5) } : null,
    hat: Math.random() > 0.4 ? { option: randomInt(1, 2), color: randomInt(1, 4) } : null,
  }
  return JSON.stringify(avatar)
}

async function generateFakeParticipants(count: number) {
  if (!db || !presentationId) return

  const batch = await import('firebase/firestore').then(m => m.writeBatch)
  const b = batch(db)

  for (let i = 0; i < count; i++) {
    const id = `fake-${crypto.randomUUID()}`
    const name = PIRATE_NAMES[i % PIRATE_NAMES.length] + (i >= PIRATE_NAMES.length ? ` ${Math.floor(i / PIRATE_NAMES.length) + 1}` : '')
    const participantRef = doc(
      db,
      FIRESTORE_COLLECTIONS.PRESENTATIONS,
      presentationId,
      FIRESTORE_COLLECTIONS.PARTICIPANTS,
      id
    )
    b.set(participantRef, {
      name,
      avatar: randomAvatar(),
      createdAt: Date.now() + i,
    } satisfies FirestoreParticipant)
  }

  await b.commit()
  console.log(`[Firestore] Generated ${count} fake participants`)
}

// ---- Export ----

export function useFirestore() {
  return {
    isConnected,
    connect,
    disconnect,
    createPresentation,
    setPresentationId,
    getPresentationId,
    publishSessionState,
    listenToParticipants,
    openVote,
    closeVote,
    listenToBallots,
    stopListeningToBallots,
    openPoll,
    closePoll,
    listenToPollResponses,
    stopListeningToPollResponses,
    generateFakeParticipants,
  }
}
