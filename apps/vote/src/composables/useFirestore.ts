import { ref } from 'vue'
import { initFirebase } from '../../../../shared/firebase'
import { FIRESTORE_COLLECTIONS } from '../../../../shared/constants'
import type {
  FirestorePresentation,
  FirestoreParticipant,
  FirestoreBallot,
  FirestorePollResponse,
  FirestoreConfig,
  SessionStateMessage,
  PollChoice,
} from '../../../../shared/types'
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  type Unsubscribe,
  type Firestore,
} from 'firebase/firestore'

// Module-level state (singleton)
const isConnected = ref(false)
let db: Firestore | null = null
let presentationId: string | null = null
let presentationUnsubscribe: Unsubscribe | null = null

// ---- Connection ----

function connect(): boolean {
  db = initFirebase()
  if (!db) {
    isConnected.value = false
    console.warn('[Firestore] Not connected — offline mode')
    return false
  }

  isConnected.value = true
  console.log('[Firestore] Connected')
  return true
}

function disconnect() {
  if (presentationUnsubscribe) {
    presentationUnsubscribe()
    presentationUnsubscribe = null
  }
  isConnected.value = false
  db = null
  presentationId = null
}

// ---- Listen to session state ----

function onSessionState(callback: (msg: SessionStateMessage) => void) {
  if (!db) return

  // Listen to config/current for presentation changes
  const configRef = doc(db, FIRESTORE_COLLECTIONS.CONFIG, 'current')

  onSnapshot(configRef, (configSnap) => {
    if (!configSnap.exists()) return
    const config = configSnap.data() as FirestoreConfig
    const newPresentationId = config.activePresentationId
    if (!newPresentationId) return

    // If presentation changed, re-subscribe
    if (newPresentationId !== presentationId) {
      presentationId = newPresentationId
      subscribeToPresentationDoc(callback)
    }
  }, (err) => {
    console.error('[Firestore] Config listener error:', err)
  })

  // Also subscribe immediately if we already have a presentation
  if (presentationId) {
    subscribeToPresentationDoc(callback)
  }
}

function subscribeToPresentationDoc(callback: (msg: SessionStateMessage) => void) {
  if (!db || !presentationId) return

  // Unsubscribe from previous
  if (presentationUnsubscribe) {
    presentationUnsubscribe()
  }

  const presRef = doc(db, FIRESTORE_COLLECTIONS.PRESENTATIONS, presentationId)
  presentationUnsubscribe = onSnapshot(presRef, (snap) => {
    if (!snap.exists()) return
    const data = snap.data() as FirestorePresentation

    // Convert to SessionStateMessage format
    const msg: SessionStateMessage = {
      type: 'session-state',
      keynoteId: data.keynoteId,
      phase: data.phase,
      timestamp: Date.now(),
    }

    if (data.vote) msg.vote = data.vote
    if (data.voteResult) msg.voteResult = data.voteResult
    if (data.poll) msg.poll = data.poll
    if (data.pollResult) msg.pollResult = data.pollResult

    callback(msg)
  }, (err) => {
    console.error('[Firestore] Presentation listener error:', err)
  })
}

// ---- Write operations ----

async function registerParticipant(participantId: string, name: string, avatar: string): Promise<boolean> {
  if (!db || !presentationId) return false

  try {
    const participantRef = doc(
      db,
      FIRESTORE_COLLECTIONS.PRESENTATIONS,
      presentationId,
      FIRESTORE_COLLECTIONS.PARTICIPANTS,
      participantId
    )
    const data: FirestoreParticipant = {
      name,
      avatar,
      createdAt: Date.now(),
    }
    await setDoc(participantRef, data)
    console.log('[Firestore] Participant registered:', participantId)
    return true
  } catch (err) {
    console.error('[Firestore] Failed to register participant:', err)
    return false
  }
}

async function submitVote(voteIndex: number, participantId: string, choice: 'A' | 'B'): Promise<boolean> {
  if (!db || !presentationId) return false

  const voteId = `vote_${voteIndex}`
  try {
    const ballotRef = doc(
      db,
      FIRESTORE_COLLECTIONS.PRESENTATIONS,
      presentationId,
      FIRESTORE_COLLECTIONS.VOTES,
      voteId,
      FIRESTORE_COLLECTIONS.BALLOTS,
      participantId
    )
    const data: FirestoreBallot = {
      choice,
      votedAt: Date.now(),
    }
    await setDoc(ballotRef, data)
    console.log('[Firestore] Vote submitted:', voteId, choice)
    return true
  } catch (err) {
    console.error('[Firestore] Failed to submit vote:', err)
    return false
  }
}

async function submitPoll(pollId: string, participantId: string, choice: PollChoice): Promise<boolean> {
  if (!db || !presentationId) return false

  try {
    const responseRef = doc(
      db,
      FIRESTORE_COLLECTIONS.PRESENTATIONS,
      presentationId,
      FIRESTORE_COLLECTIONS.POLLS,
      pollId,
      FIRESTORE_COLLECTIONS.RESPONSES,
      participantId
    )
    const data: FirestorePollResponse = {
      choice,
      respondedAt: Date.now(),
    }
    await setDoc(responseRef, data)
    console.log('[Firestore] Poll response submitted:', pollId, choice)
    return true
  } catch (err) {
    console.error('[Firestore] Failed to submit poll:', err)
    return false
  }
}

// ---- Export ----

export function useFirestore() {
  return {
    isConnected,
    connect,
    disconnect,
    onSessionState,
    registerParticipant,
    submitVote,
    submitPoll,
  }
}
