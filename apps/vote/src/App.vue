<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { STORAGE_KEYS } from '../../../shared/constants'
import type { SessionStateMessage, SessionPhase, PollChoice } from '../../../shared/types'
import { getMetricByIndex, METRICS_LIST } from '../../../shared/metrics-data'
import { useFirestore } from './composables/useFirestore'
import AvatarStep from './components/AvatarStep.vue'
import ConfirmationScreen from './components/ConfirmationScreen.vue'
import JoinedWaiting from './components/JoinedWaiting.vue'
import NameForm from './components/NameForm.vue'
import PollScreen from './components/PollScreen.vue'
import StatusScreen from './components/StatusScreen.vue'
import VoteScreen from './components/VoteScreen.vue'

const { isConnected: firestoreConnected, connect, onSessionState, registerParticipant, submitVote, submitPoll } = useFirestore()

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

const status = ref<'connecting' | 'waiting' | 'error' | 'idle' | 'joining' | 'joined'>('connecting')
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

const isSubmitting = ref(false)
const imagesReady = ref(false)

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
  if (trimmed.length < 2) return 'Minimum 2 characters'
  if (trimmed.length > 20) return 'Maximum 20 characters'
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
    status.value = imagesReady.value ? 'idle' : 'connecting'
    return
  }

  // First session state: transition from connecting/waiting (only when images are loaded)
  if (status.value === 'connecting' || status.value === 'waiting') {
    if (!imagesReady.value) return
    const savedCrew = loadCrew()
    if (savedCrew) {
      joinedName.value = savedCrew.name
      selectedAvatar.value = savedCrew.avatar
      status.value = 'joined'
    } else {
      status.value = 'idle'
    }
  }
}

// When images finish loading, complete any deferred transition
watch(imagesReady, (ready) => {
  if (ready && sessionState.value && (status.value === 'connecting' || status.value === 'waiting')) {
    handleSessionState(sessionState.value)
  }
})

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

// ===========================================
// Join crew (local only — Firestore write will be added in Phase 3)
// ===========================================

async function handleJoin(avatar: string) {
  if (status.value !== 'idle' || !keynoteId.value) return
  status.value = 'joining'
  selectedAvatar.value = avatar

  const pid = participantId.value
  if (!pid || !keynoteId.value) {
    status.value = 'error'
    return
  }

  try {
    await registerParticipant(pid, name.value.trim(), avatar)
    joinedName.value = name.value.trim()
    status.value = 'joined'
    saveCrew({ participantId: pid, name: name.value.trim(), avatar })
  } catch (err) {
    console.error('Failed to join crew:', err)
    status.value = 'error'
  }
}

// ===========================================
// Vote (local only — Firestore write will be added in Phase 3)
// ===========================================

async function handleVote(choice: 'A' | 'B') {
  const vote = sessionState.value?.vote
  if (!vote || hasVotedThisRound.value || isSubmitting.value || !keynoteId.value) return

  isSubmitting.value = true
  try {
    await submitVote(vote.index, participantId.value, choice)
    votedRounds.value = [...votedRounds.value, vote.index]
    saveVotesData({ keynoteId: keynoteId.value, votedRounds: votedRounds.value, polledIds: polledIds.value })
  } catch (err) {
    console.error('Failed to vote:', err)
  } finally {
    isSubmitting.value = false
  }
}

// ===========================================
// Poll (local only — Firestore write will be added in Phase 3)
// ===========================================

async function handlePoll(choice: PollChoice) {
  const poll = sessionState.value?.poll
  if (!poll || hasPolledThisRound.value || isSubmitting.value || !keynoteId.value) return

  isSubmitting.value = true
  try {
    await submitPoll(poll.id, participantId.value, choice)
    polledIds.value = [...polledIds.value, poll.id]
    saveVotesData({ keynoteId: keynoteId.value, votedRounds: votedRounds.value, polledIds: polledIds.value })
  } catch (err) {
    console.error('Failed to submit poll:', err)
  } finally {
    isSubmitting.value = false
  }
}

// ===========================================
// Fullscreen on first interaction (Android)
// ===========================================

function requestFullscreen() {
  const el = document.documentElement
  if (!document.fullscreenElement && el.requestFullscreen) {
    el.requestFullscreen().catch(() => { })
  }
  document.removeEventListener('click', requestFullscreen)
}
document.addEventListener('click', requestFullscreen, { once: true })

// ===========================================
// Preload images
// ===========================================

function preloadImages(): Promise<void> {
  const metrics = METRICS_LIST.map(m => m.name.toLowerCase())
  const urls = [
    '/vote/Bg.webp', '/vote/A.webp', '/vote/B.webp', '/vote/light.webp', '/vote/blueprint.webp', '/vote/shadow.webp',
    ...metrics.flatMap(m => [`/floors/floor-${m}-a.webp`, `/floors/floor-${m}-b.webp`]),
  ]
  const promises = urls.map(src => new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  }))
  return Promise.all(promises).then(() => {})
}

// ===========================================
// Lifecycle
// ===========================================

onMounted(async () => {
  preloadImages().then(() => { imagesReady.value = true })

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
  } else {
    status.value = 'waiting'
  }
})
</script>

<template>
  <div class=" p-0">
    <!-- Immersive vote screen (replaces card when actively voting) -->
    <VoteScreen
      v-if="status === 'joined' && phase === 'voting' && !hasVotedThisRound && currentMetric"
      :metric="currentMetric"
      :vote-winners="voteWinners"
      :is-submitting="isSubmitting"
      @vote="handleVote"
    />

    <!-- NameForm: full-screen with decorative layers -->
    <div
      v-else-if="(status === 'idle' || status === 'joining') && currentStep === 'name'"
      class="relative w-screen h-dvh overflow-hidden"
    >
      <img
        src="/vote/Bg.webp"
        alt=""
        fetchpriority="high"
        class="absolute inset-0 w-full h-full object-cover z-0"
      />
      <img
        src="/vote/blueprint.webp"
        alt=""
        class="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2 max-h-[70dvh] max-w-[90vw] z-1 pointer-events-none"
      />
      <img
        src="/vote/shadow.webp"
        alt=""
        class="absolute inset-0 w-full h-full object-cover z-2 pointer-events-none opacity-48 mix-blend-multiply"
      />
      <div class="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[85vw] max-w-[400px] z-10">
        <NameForm
          v-model="name"
          :validation-message="validationMessage"
          :can-submit="canGoNext"
          :disabled="status === 'joining'"
          @submit="handleNext"
        />
      </div>
      <img
        src="/vote/light.webp"
        alt=""
        class="absolute inset-0 w-full h-full object-cover mix-blend-plus-lighter opacity-41 z-999 pointer-events-none"
      />
    </div>

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
      />

      <!-- Onboarding: Avatar -->
      <AvatarStep
        v-else-if="(status === 'idle' || status === 'joining') && currentStep === 'avatar'"
        :name="name"
        :is-joining="status === 'joining'"
        @back="handleBack"
        @join="handleJoin"
      />

      <!-- Vote submitted -->
      <ConfirmationScreen
        v-else-if="status === 'joined' && phase === 'voting' && hasVotedThisRound"
        title="Vote recorded!"
        hint="Results on the big screen..."
        show-checkmark
      />

      <!-- Vote closed -->
      <ConfirmationScreen
        v-else-if="status === 'joined' && phase === 'vote-results'"
        title="Vote closed!"
        hint="Check the results on screen!"
      />

      <!-- Poll voting -->
      <PollScreen
        v-else-if="status === 'joined' && phase === 'polling' && !hasPolledThisRound"
        :is-submitting="isSubmitting"
        @poll="handlePoll"
      />

      <!-- Poll submitted -->
      <ConfirmationScreen
        v-else-if="status === 'joined' && phase === 'polling' && hasPolledThisRound"
        title="Thanks!"
        hint="Your response has been recorded"
        show-checkmark
      />

      <!-- Poll closed -->
      <ConfirmationScreen
        v-else-if="status === 'joined' && phase === 'poll-results'"
        title="Poll closed!"
        hint="Check the results on screen!"
        show-checkmark
      />

      <!-- Default: waiting between votes -->
      <JoinedWaiting
        v-else-if="status === 'joined'"
        :avatar="selectedAvatar"
        :name="joinedName"
      />
    </div>

  </div>
</template>
