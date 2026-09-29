import { ref } from 'vue'
import { initFirebase, resetFirebase } from '../../../../shared/firebase'
import { FIRESTORE_COLLECTIONS } from '../../../../shared/constants'
import type {
  FirestorePresentation,
  FirestoreParticipant,
  FirestoreBallot,
  FirestorePollResponse,
  FirestoreFeedback,
  FirestoreConfig,
  SessionStateMessage,
  PollChoice,
} from '../../../../shared/types'
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  onSnapshot,
  type Unsubscribe,
  type Firestore,
} from 'firebase/firestore'

// Module-level state (singleton)
const isConnected = ref(false)
// true dès qu'un listener remonte une erreur de transport (réseau coupé,
// streaming bloqué par Brave/adblock). Branché sur l'écran d'erreur + retry.
const hasConnectionError = ref(false)
// true dès qu'un snapshot quelconque est reçu = transport prouvé vivant.
// Permet de distinguer « bloqué » (aucun snapshot) de « présentation pas
// encore démarrée » (snapshot reçu mais pas d'état de session).
const hasReceivedSnapshot = ref(false)
let db: Firestore | null = null
let presentationId: string | null = null
let presentationUnsubscribe: Unsubscribe | null = null
let configUnsubscribe: Unsubscribe | null = null
// Callback de session conservé pour pouvoir se ré-abonner lors d'un reconnect.
let sessionCallback: ((msg: SessionStateMessage) => void) | null = null

// ---- Connection ----

function connect(): boolean {
  // Long-polling forcé : public 100 % mobile sur réseau hostile (wifi de salle,
  // 4G saturée, Brave/bloqueurs qui cassent le streaming WebChannel). Quelques
  // centaines de ms de latence en plus, invisibles sur des votes de 20 s. La
  // présentation, sur un réseau maîtrisé, garde l'auto-détection.
  db = initFirebase(true)
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
  if (configUnsubscribe) {
    configUnsubscribe()
    configUnsubscribe = null
  }
  isConnected.value = false
  db = null
  presentationId = null
}

// Recrée l'instance Firestore et ses listeners. Utilisé par le bouton
// « réessayer » quand la connexion a échoué : re-souscrire sur l'ancienne
// instance ne suffit pas (cf. resetFirebase).
function reconnect(): boolean {
  disconnect()
  hasConnectionError.value = false
  hasReceivedSnapshot.value = false
  resetFirebase()
  const ok = connect()
  if (ok && sessionCallback) {
    onSessionState(sessionCallback)
  }
  return ok
}

// ---- Listen to session state ----

function onSessionState(callback: (msg: SessionStateMessage) => void) {
  if (!db) return

  sessionCallback = callback

  // Listen to config/current for presentation changes
  const configRef = doc(db, FIRESTORE_COLLECTIONS.CONFIG, 'current')

  configUnsubscribe = onSnapshot(configRef, (configSnap) => {
    // Un snapshot reçu = transport opérationnel.
    isConnected.value = true
    hasConnectionError.value = false
    hasReceivedSnapshot.value = true
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
    isConnected.value = false
    hasConnectionError.value = true
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
    isConnected.value = true
    hasConnectionError.value = false
    hasReceivedSnapshot.value = true
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
    if (data.voteWinners) msg.voteWinners = data.voteWinners
    if (data.resolvedDerived) msg.resolvedDerived = data.resolvedDerived

    callback(msg)
  }, (err) => {
    console.error('[Firestore] Presentation listener error:', err)
    isConnected.value = false
    hasConnectionError.value = true
  })
}

// ---- Write operations ----
// Les écritures rejettent en cas de refus serveur. Hors ligne, le SDK les met
// en file (et rejoue lui-même les erreurs transitoires) : la promesse ne se
// résout qu'à l'acquittement serveur.

// Doc sous la présentation active. Lance si aucune n'est connue : l'écriture
// échoue au lieu d'être ignorée en silence.
function presentationDoc(...segments: string[]) {
  if (!db || !presentationId) throw new Error('[Firestore] Pas de présentation active')
  return doc(db, FIRESTORE_COLLECTIONS.PRESENTATIONS, presentationId, ...segments)
}

async function registerParticipant(participantId: string, name: string, avatar: string): Promise<void> {
  const data: FirestoreParticipant = {
    name,
    avatar,
    createdAt: Date.now(),
  }
  await setDoc(presentationDoc(FIRESTORE_COLLECTIONS.PARTICIPANTS, participantId), data)
  console.log('[Firestore] Participant registered:', participantId)
}

// Recrée le doc participant s'il manque côté serveur (pirate restauré depuis
// le localStorage mais inconnu de la présentation). Reste une création : les
// règles interdisent l'update sur participants.
async function ensureParticipant(participantId: string, name: string, avatar: string): Promise<void> {
  const snap = await getDoc(presentationDoc(FIRESTORE_COLLECTIONS.PARTICIPANTS, participantId))
  if (snap.exists()) return
  console.warn('[Firestore] Participant missing on server, re-registering:', participantId)
  await registerParticipant(participantId, name, avatar)
}

async function submitVote(voteIndex: number, participantId: string, choice: 'A' | 'B'): Promise<void> {
  const voteId = `vote_${voteIndex}`
  const data: FirestoreBallot = {
    choice,
    votedAt: Date.now(),
  }
  await setDoc(presentationDoc(FIRESTORE_COLLECTIONS.VOTES, voteId, FIRESTORE_COLLECTIONS.BALLOTS, participantId), data)
  console.log('[Firestore] Vote submitted:', voteId, choice)
}

async function submitPoll(pollId: string, participantId: string, choice: PollChoice): Promise<void> {
  const data: FirestorePollResponse = {
    choice,
    respondedAt: Date.now(),
  }
  await setDoc(presentationDoc(FIRESTORE_COLLECTIONS.POLLS, pollId, FIRESTORE_COLLECTIONS.RESPONSES, participantId), data)
  console.log('[Firestore] Poll response submitted:', pollId, choice)
}

// ---- Feedback ----

async function submitFeedback(participantId: string, name: string, feedback: string): Promise<boolean> {
  if (!db || !presentationId) return false

  try {
    const feedbacksRef = collection(db, FIRESTORE_COLLECTIONS.FEEDBACKS)
    const data: FirestoreFeedback = {
      presentationId,
      participantId,
      name,
      feedback,
      createdAt: Date.now(),
    }
    await addDoc(feedbacksRef, data)
    console.log('[Firestore] Feedback submitted')
    return true
  } catch (err) {
    console.error('[Firestore] Failed to submit feedback:', err)
    return false
  }
}

// ---- Export ----

export function useFirestore() {
  return {
    isConnected,
    hasConnectionError,
    hasReceivedSnapshot,
    connect,
    reconnect,
    disconnect,
    onSessionState,
    registerParticipant,
    ensureParticipant,
    submitVote,
    submitPoll,
    submitFeedback,
  }
}
