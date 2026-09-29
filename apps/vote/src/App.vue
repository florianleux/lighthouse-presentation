<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect } from 'vue'
import { STORAGE_KEYS } from '../../../shared/constants'
import type { SessionStateMessage, SessionPhase, PollChoice } from '../../../shared/types'
import { getMetricByIndex } from '../../../shared/metrics-data'
import { useFirestore } from './composables/useFirestore'
import { preloadAvatarPool } from './composables/useAvatar'
import { preloadImage } from './utils/preloadImage'
import AvatarStep from './components/AvatarStep.vue'
import WaitingScreen from './components/WaitingScreen.vue'
import NameForm from './components/NameForm.vue'
import PollScreen from './components/PollScreen.vue'
import StatusScreen from './components/StatusScreen.vue'
import VoteScreen from './components/VoteScreen.vue'
import EndScreen from './components/EndScreen.vue'
import FeedbackScreen from './components/FeedbackScreen.vue'
import DecorScene from './components/DecorScene.vue'
import FadeInImg from './components/FadeInImg.vue'

const { isConnected: firestoreConnected, hasConnectionError, hasReceivedSnapshot, connectionLost, connect, reconnect, onSessionState, watchConnection, registerParticipant, ensureParticipant, submitVote, submitPoll, submitFeedback } = useFirestore()

// ===========================================
// Persistence helpers
// ===========================================

interface PersistedCrew {
  participantId: string
  name: string
  avatar: string
}

interface PersistedVotes {
  keynoteId: string
  votedRounds: number[]
  polledIds: string[]
}

function loadCrew(): PersistedCrew | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CREW_MEMBER)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveCrew(crew: PersistedCrew) {
  try { localStorage.setItem(STORAGE_KEYS.CREW_MEMBER, JSON.stringify(crew)) } catch { }
}

function loadVotes(): PersistedVotes | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOTE_STATE)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveVotesData(votes: PersistedVotes) {
  try { localStorage.setItem(STORAGE_KEYS.VOTE_STATE, JSON.stringify(votes)) } catch { }
}

function getOrCreateParticipantId(): string {
  const savedCrew = loadCrew()
  if (savedCrew?.participantId) return savedCrew.participantId
  return 'pirate-' + crypto.randomUUID()
}

// ===========================================
// State
// ===========================================

const isConnected = firestoreConnected
const participantId = ref(getOrCreateParticipantId())

const status = ref<'connecting' | 'waiting' | 'error' | 'idle' | 'joined'>('connecting')
const currentStep = ref<'name' | 'avatar'>('name')
const name = ref('')
const joinedName = ref('')
const selectedAvatar = ref<string | null>(null)
const keynoteId = ref<string | null>(null)

// Last session state from presentation (source of truth for what to display)
const sessionState = ref<SessionStateMessage | null>(null)

// Vote/poll tracking (persisted)
const votedRounds = ref<number[]>([])
const polledIds = ref<string[]>([])

const endSubScreen = ref<'end' | 'feedback'>('end')

// ===========================================
// Computed
// ===========================================

const phase = computed<SessionPhase | null>(() => sessionState.value?.phase ?? null)

const hasVotedThisRound = computed(() => {
  const vote = sessionState.value?.vote
  return vote ? votedRounds.value.includes(vote.index) : false
})

const hasPolledThisRound = computed(() => {
  const poll = sessionState.value?.poll
  return poll ? polledIds.value.includes(poll.id) : false
})

const missedCurrentVote = computed(() =>
  phase.value === 'vote-results' && !hasVotedThisRound.value
)

const currentMetric = computed(() => {
  const vote = sessionState.value?.vote
  if (!vote) return null
  return getMetricByIndex(vote.index) ?? null
})

const isValid = computed(() => {
  const trimmed = name.value.trim()
  return trimmed.length >= 2 && trimmed.length <= 20
})

const validationMessage = computed(() => {
  const trimmed = name.value.trim()
  if (trimmed.length === 0) return ''
  if (trimmed.length < 2) return 'Minimum 2 caractères'
  if (trimmed.length > 20) return 'Maximum 20 caractères'
  return ''
})

const canGoNext = computed(() => isValid.value && keynoteId.value !== null)

// Vote winners from Firestore (source of truth for derived option resolution)
const voteWinners = computed(() => sessionState.value?.voteWinners ?? {})

// ===========================================
// Session state handler (called by Firestore onSnapshot listener)
// ===========================================

function handleSessionState(msg: SessionStateMessage) {
  sessionState.value = msg

  const isNewKeynote = msg.keynoteId !== keynoteId.value

  // Keynote change: reset everything — user must rejoin
  if (isNewKeynote) {
    keynoteId.value = msg.keynoteId
    votedRounds.value = []
    polledIds.value = []
    saveVotesData({ keynoteId: msg.keynoteId, votedRounds: [], polledIds: [] })
    // Clear crew — force re-creation
    try { localStorage.removeItem(STORAGE_KEYS.CREW_MEMBER) } catch { }
    joinedName.value = ''
    selectedAvatar.value = null
    name.value = ''
    currentStep.value = 'name'
    participantId.value = getOrCreateParticipantId()
    status.value = 'idle'
    return
  }

  // First session state: transition from connecting/waiting
  if (status.value === 'connecting' || status.value === 'waiting') {
    const savedCrew = loadCrew()
    if (savedCrew) {
      joinedName.value = savedCrew.name
      selectedAvatar.value = savedCrew.avatar
      status.value = 'joined'
      ensureCrewRegistered(savedCrew)
    } else {
      status.value = 'idle'
    }
  }
}

// Le pirate passe plusieurs secondes à taper son nom : on en profite pour
// précharger les calques du spin d'avatar (genre + carnation par défaut).
watch(status, (s) => {
  if (s === 'idle') preloadAvatarPool()
})

// Pirate embarqué mais peut-être inconnu du serveur (écriture perdue, onglet
// suspendu, reconnexion) : on recrée son doc participant s'il manque.
function ensureCrewRegistered(crew = loadCrew()) {
  if (!crew) return
  ensureParticipant(crew.participantId, crew.name, crew.avatar)
    .catch(err => console.error('Failed to re-register crew member:', err))
}

// ===========================================
// Navigation
// ===========================================

function handleNext() {
  if (!canGoNext.value || status.value !== 'idle') return
  currentStep.value = 'avatar'
}

function handleBack() {
  currentStep.value = 'name'
}

function handleShowFeedback() {
  endSubScreen.value = 'feedback'
}

function handleFeedbackCancel() {
  endSubScreen.value = 'end'
}

async function handleFeedbackSend(feedback: string) {
  await submitFeedback(participantId.value, joinedName.value, feedback)
}

watchEffect(() => {
  if (phase.value !== 'finished') {
    endSubScreen.value = 'end'
  }
})

// ===========================================
// Join crew
// ===========================================

// Rejette si l'inscription est refusée : AvatarStep affiche l'erreur.
async function handleJoin(avatar: string) {
  if (status.value !== 'idle') return
  const pid = participantId.value
  const crewName = name.value.trim()
  await registerParticipant(pid, crewName, avatar)

  // Nouvelle keynote arrivée pendant l'écriture : l'état a été réinitialisé
  // avec un nouveau participantId, cette inscription est caduque.
  if (participantId.value !== pid) return

  // Persisté seulement après l'acquittement serveur : sinon un rechargement
  // restaurerait un pirate que la présentation ne connaît pas.
  selectedAvatar.value = avatar
  joinedName.value = crewName
  saveCrew({ participantId: pid, name: crewName, avatar })
  status.value = 'joined'
}

// ===========================================
// Vote / Poll
// ===========================================

// Rejettent si l'envoi est refusé : l'écran reste affiché pour retenter.
async function handleVote(choice: 'A' | 'B') {
  const vote = sessionState.value?.vote
  if (!vote || hasVotedThisRound.value) return
  await submitRound(
    () => submitVote(vote.index, participantId.value, choice),
    () => { votedRounds.value = [...votedRounds.value, vote.index] },
  )
}

async function handlePoll(choice: PollChoice) {
  const poll = sessionState.value?.poll
  if (!poll || hasPolledThisRound.value) return
  await submitRound(
    () => submitPoll(poll.id, participantId.value, choice),
    () => { polledIds.value = [...polledIds.value, poll.id] },
  )
}

// Le round n'est verrouillé (et persisté) qu'après l'acquittement serveur.
async function submitRound(write: () => Promise<void>, markDone: () => void) {
  const keynote = keynoteId.value
  await write()
  // Nouvelle keynote pendant l'envoi : les verrous ont été remis à zéro.
  if (!keynote || keynoteId.value !== keynote) return
  markDone()
  saveVotesData({ keynoteId: keynote, votedRounds: votedRounds.value, polledIds: polledIds.value })
}

// ===========================================
// Fullscreen on first interaction (Android)
// ===========================================

// ===========================================
// Lifecycle
// ===========================================

// ===========================================
// Connection error / retry
// ===========================================

// Filet de sécurité : si aucun état de session n'arrive (transport bloqué par
// Brave/adblock sans erreur immédiate), on bascule sur l'écran d'erreur au lieu
// de laisser le spinner tourner indéfiniment.
const CONNECT_TIMEOUT_MS = 8000
let connectTimeout: ReturnType<typeof setTimeout> | null = null

function armConnectTimeout() {
  if (connectTimeout) clearTimeout(connectTimeout)
  connectTimeout = setTimeout(() => {
    // Aucun snapshot reçu = transport bloqué (≠ présentation pas démarrée).
    if (!hasReceivedSnapshot.value && status.value === 'connecting') {
      status.value = 'error'
    }
  }, CONNECT_TIMEOUT_MS)
}

// Premier snapshot reçu mais pas encore d'état de session = connexion OK,
// présentation pas encore démarrée → « En attente du capitaine ».
watch(hasReceivedSnapshot, (received) => {
  if (received && status.value === 'connecting') {
    status.value = 'waiting'
  }
})

// Un listener a remonté une erreur de transport avant que l'utilisateur ait
// rejoint : on montre l'écran d'erreur. Une fois « joined », c'est le
// watchdog de useFirestore qui surveille la connexion (bandeau « Reconnexion »).
watch(hasConnectionError, (err) => {
  if (err && (status.value === 'connecting' || status.value === 'waiting')) {
    status.value = 'error'
  }
})

// Un état de session reçu = connexion vivante, on désarme le timeout.
watch(sessionState, (s) => {
  if (s && connectTimeout) {
    clearTimeout(connectTimeout)
    connectTimeout = null
  }
})

// Connexion rétablie après une coupure : le pirate a pu disparaître côté serveur.
watch(connectionLost, (lost) => {
  if (!lost && status.value === 'joined') ensureCrewRegistered()
})

function handleRetry() {
  status.value = 'connecting'
  armConnectTimeout()
  const ok = reconnect()
  if (!ok) status.value = 'error'
}

onMounted(async () => {
  // Calques d'ambiance : en cache avant le premier écran de décor, sans
  // concurrencer la connexion Firestore.
  preloadImage('/vote/shadow.webp')
  preloadImage('/vote/light.webp')

  const savedCrew = loadCrew()
  const savedVotes = loadVotes()

  // Restore display data
  if (savedCrew) {
    joinedName.value = savedCrew.name
    selectedAvatar.value = savedCrew.avatar
  }

  // Restore voted rounds
  if (savedVotes) {
    keynoteId.value = savedVotes.keynoteId
    votedRounds.value = savedVotes.votedRounds
    polledIds.value = savedVotes.polledIds
  }

  // Connect to Firestore
  const connected = connect()
  if (connected) {
    onSessionState(handleSessionState)
    watchConnection()
    armConnectTimeout()
  } else {
    status.value = 'error'
  }
})
</script>

<template>
  <div class=" p-0">
    <!-- Immersive vote screen (replaces card when actively voting) -->
    <VoteScreen
      v-if="status === 'joined' && phase === 'voting' && !hasVotedThisRound && currentMetric"
      :key="currentMetric.index"
      :metric="currentMetric"
      :vote-winners="voteWinners"
      :submit="handleVote"
    />

    <!-- NameForm: affiché sans attendre son décor, qui arrive en fondu -->
    <DecorScene
      v-else-if="status === 'idle' && currentStep === 'name'"
      strong-shadow
    >
      <template #backdrop>
        <FadeInImg
          src="/vote/blueprint.webp"
          class="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2 max-h-[70dvh] max-w-[90vw] z-1 pointer-events-none"
        />
      </template>
      <div class="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[85vw] max-w-[400px] z-10">
        <NameForm
          v-model="name"
          :validation-message="validationMessage"
          :can-submit="canGoNext"
          @submit="handleNext"
        />
      </div>
    </DecorScene>

    <DecorScene v-else-if="status === 'idle' && currentStep === 'avatar'">
      <AvatarStep
        class="z-3"
        :name="name"
        :join="handleJoin"
        @back="handleBack"
      />
    </DecorScene>

    <DecorScene v-else-if="status === 'joined' && phase === 'polling' && !hasPolledThisRound">
      <PollScreen
        :key="sessionState?.poll?.id"
        class="z-3"
        :submit="handlePoll"
      />
    </DecorScene>

    <DecorScene v-else-if="status === 'joined' && phase === 'finished'">
      <EndScreen
        v-if="endSubScreen === 'end'"
        class="z-3"
        :avatar="selectedAvatar"
        :name="joinedName"
        @show-feedback="handleShowFeedback"
      />
      <FeedbackScreen
        v-else
        class="z-3"
        @cancel="handleFeedbackCancel"
        @send="handleFeedbackSend"
      />
    </DecorScene>

    <DecorScene v-else-if="status === 'joined' && !(phase === 'voting' && !hasVotedThisRound) && !(phase === 'polling' && !hasPolledThisRound)">
      <WaitingScreen
        class="z-3"
        :avatar="selectedAvatar"
        :name="joinedName"
        :has-voted-once="votedRounds.length > 0"
        :missed-current-vote="missedCurrentVote"
      />
    </DecorScene>

    <!-- Standard card layout (all other states) -->
    <div
      v-else
      class="rounded-2xl p-8 w-full text-center"
    >

      <!-- Connecting / Waiting / Error -->
      <StatusScreen
        v-if="status === 'connecting'"
        variant="connecting"
      />
      <StatusScreen
        v-else-if="status === 'waiting'"
        variant="waiting"
      />
      <StatusScreen
        v-else-if="status === 'error'"
        variant="error"
        @retry="handleRetry"
      />

    </div>

    <!-- Non bloquant : le votant sait que son écran n'est peut-être plus à jour -->
    <p
      v-if="status === 'joined' && connectionLost"
      role="status"
      class="fixed top-3 left-1/2 -translate-x-1/2 z-[2000] m-0 px-4 py-2 rounded-xl bg-black/70 text-white text-base font-title"
    >Reconnexion...</p>

  </div>
</template>
