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
  }
}
