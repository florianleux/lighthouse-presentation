<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAbly } from './composables/useAbly'
import { STORAGE_KEYS } from '../../../shared/constants'
import type { SessionStateMessage, SessionPhase, PollChoice } from '../../../shared/types'
import AvatarCreator from './components/AvatarCreator.vue'
import AvatarPreview from './components/AvatarPreview.vue'

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
  try { localStorage.setItem(STORAGE_KEYS.CREW_MEMBER, JSON.stringify(crew)) } catch {}
}

function loadVotes(): PersistedVotes | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOTE_STATE)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveVotesData(votes: PersistedVotes) {
  try { localStorage.setItem(STORAGE_KEYS.VOTE_STATE, JSON.stringify(votes)) } catch {}
}

// ===========================================
// Ably
// ===========================================

const { isConnected, connect, onSessionState, publishAction, getParticipantId, reconnect } = useAbly()

// ===========================================
// State
// ===========================================

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

// Re-announce flag (once per keynoteId)
let hasReannounced = false

// Timers
let waitingTimeout: ReturnType<typeof setTimeout> | null = null
let unsubscribe: (() => void) | null = null

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

// ===========================================
// Session state handler
// ===========================================

function handleSessionState(msg: SessionStateMessage) {
  sessionState.value = msg

  // Clear waiting timeout
  if (waitingTimeout) {
    clearTimeout(waitingTimeout)
    waitingTimeout = null
  }

  // Keynote change: reset voted rounds
  if (msg.keynoteId !== keynoteId.value) {
    keynoteId.value = msg.keynoteId
    hasReannounced = false
    votedRounds.value = []
    polledIds.value = []
    saveVotesData({ keynoteId: msg.keynoteId, votedRounds: [], polledIds: [] })
  }

  // First session state: transition from connecting/waiting
  if (status.value === 'connecting' || status.value === 'waiting') {
    const savedCrew = loadCrew()
    if (savedCrew) {
      joinedName.value = savedCrew.name
      selectedAvatar.value = savedCrew.avatar
      status.value = 'joined'
    } else {
      status.value = 'idle'
    }
  }

  // Re-announce to presentation (once per keynoteId)
  if (status.value === 'joined' && !hasReannounced && keynoteId.value) {
    hasReannounced = true
    const savedCrew = loadCrew()
    const pid = getParticipantId()
    if (savedCrew && pid) {
      publishAction({
        type: 'join-crew',
        participantId: pid,
        name: savedCrew.name,
        avatar: savedCrew.avatar,
        keynoteId: keynoteId.value,
        timestamp: Date.now(),
      }).catch((err) => console.error('[App] Failed to re-announce:', err))
    }
  }
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

// ===========================================
// Join crew
// ===========================================

async function handleJoin(avatar: string) {
  if (status.value !== 'idle' || !keynoteId.value) return
  status.value = 'joining'
  selectedAvatar.value = avatar

  const pid = getParticipantId()
  if (!pid || !keynoteId.value) {
    status.value = 'error'
    return
  }

  try {
    await publishAction({
      type: 'join-crew',
      participantId: pid,
      name: name.value.trim(),
      avatar,
      keynoteId: keynoteId.value,
      timestamp: Date.now(),
    })
    joinedName.value = name.value.trim()
    status.value = 'joined'
    hasReannounced = true
    saveCrew({ participantId: pid, name: name.value.trim(), avatar })
  } catch (err) {
    console.error('Failed to join crew:', err)
    status.value = 'error'
  }
}

// ===========================================
// Vote
// ===========================================

async function handleVote(choice: 'A' | 'B') {
  const vote = sessionState.value?.vote
  if (!vote || hasVotedThisRound.value || isSubmitting.value || !keynoteId.value) return

  const pid = getParticipantId()
  if (!pid) return

  isSubmitting.value = true
  try {
    await publishAction({
      type: 'vote-cast',
      participantId: pid,
      voteIndex: vote.index,
      choice,
      keynoteId: keynoteId.value,
      timestamp: Date.now(),
    })
    votedRounds.value = [...votedRounds.value, vote.index]
    saveVotesData({ keynoteId: keynoteId.value, votedRounds: votedRounds.value, polledIds: polledIds.value })
  } catch (err) {
    console.error('Failed to vote:', err)
  } finally {
    isSubmitting.value = false
  }
}

// ===========================================
// Poll
// ===========================================

async function handlePoll(choice: PollChoice) {
  const poll = sessionState.value?.poll
  if (!poll || hasPolledThisRound.value || isSubmitting.value || !keynoteId.value) return

  const pid = getParticipantId()
  if (!pid) return

  isSubmitting.value = true
  try {
    await publishAction({
      type: 'poll-cast',
      participantId: pid,
      pollId: poll.id,
      choice,
      keynoteId: keynoteId.value,
      timestamp: Date.now(),
    })
    polledIds.value = [...polledIds.value, poll.id]
    saveVotesData({ keynoteId: keynoteId.value, votedRounds: votedRounds.value, polledIds: polledIds.value })
  } catch (err) {
    console.error('Failed to submit poll:', err)
  } finally {
    isSubmitting.value = false
  }
}

// ===========================================
// Visibility change (force reconnect on unlock)
// ===========================================

function handleVisibilityChange() {
  if (!document.hidden) {
    reconnect()
  }
}

// ===========================================
// Lifecycle
// ===========================================

onMounted(async () => {
  const apiKey = import.meta.env.VITE_ABLY_API_KEY as string
  if (!apiKey) {
    status.value = 'error'
    console.error('VITE_ABLY_API_KEY not set')
    return
  }

  const savedCrew = loadCrew()
  const savedVotes = loadVotes()

  try {
    await connect(apiKey, savedCrew?.participantId)

    // Subscribe to session state
    unsubscribe = onSessionState(handleSessionState)

    // Restore display data immediately (before session-state arrives)
    if (savedCrew) {
      joinedName.value = savedCrew.name
      selectedAvatar.value = savedCrew.avatar
    }

    // Restore voted rounds (keynoteId validation happens in handleSessionState)
    if (savedVotes) {
      keynoteId.value = savedVotes.keynoteId
      votedRounds.value = savedVotes.votedRounds
      polledIds.value = savedVotes.polledIds
    }

    // Show "waiting" if no session-state arrives within 5s
    waitingTimeout = setTimeout(() => {
      if (status.value === 'connecting') {
        status.value = 'waiting'
      }
    }, 5000)
  } catch (err) {
    console.error('Failed to connect:', err)
    status.value = 'error'
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  unsubscribe?.()
  if (waitingTimeout) clearTimeout(waitingTimeout)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>Lighthouse Pirates</h1>

      <!-- Connecting -->
      <div v-if="status === 'connecting'" class="status">
        <div class="spinner"></div>
        <p>Connecting...</p>
      </div>

      <!-- Waiting for presentation -->
      <div v-else-if="status === 'waiting'" class="status">
        <div class="spinner"></div>
        <p>Waiting for the captain...</p>
        <p class="hint">The presentation hasn't started yet</p>
      </div>

      <!-- Error -->
      <div v-else-if="status === 'error'" class="status error">
        <p>Connection error</p>
        <p class="hint">Check your internet connection</p>
      </div>

      <!-- Form - Name Step -->
      <div
        v-else-if="(status === 'idle' || status === 'joining') && currentStep === 'name'"
        class="form"
      >
        <label for="name">Your pirate name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="Captain Hook"
          maxlength="20"
          :disabled="status === 'joining'"
          @keyup.enter="handleNext"
        />
        <p v-if="validationMessage" class="validation">{{ validationMessage }}</p>
        <button @click="handleNext" :disabled="!canGoNext" class="next-btn">
          Next
        </button>
      </div>

      <!-- Form - Avatar Step -->
      <div
        v-else-if="(status === 'idle' || status === 'joining') && currentStep === 'avatar'"
        class="avatar-step"
      >
        <button class="back-btn" @click="handleBack" :disabled="status === 'joining'">
          ← Back
        </button>
        <p class="name-preview">{{ name }}</p>
        <AvatarCreator @join="handleJoin" />
        <div v-if="status === 'joining'" class="joining-overlay">
          <div class="spinner"></div>
          <p>Boarding...</p>
        </div>
      </div>

      <!-- Joined: Vote buttons -->
      <div
        v-else-if="status === 'joined' && phase === 'voting' && !hasVotedThisRound"
        class="voting"
      >
        <h2>Vote now!</h2>
        <p class="vote-hint">Choose your option</p>
        <div class="vote-buttons">
          <button
            class="vote-btn vote-a"
            @click="handleVote('A')"
            :disabled="isSubmitting"
          >
            A
          </button>
          <button
            class="vote-btn vote-b"
            @click="handleVote('B')"
            :disabled="isSubmitting"
          >
            B
          </button>
        </div>
        <p v-if="isSubmitting" class="submitting-hint">Sending...</p>
      </div>

      <!-- Joined: Vote submitted -->
      <div
        v-else-if="status === 'joined' && phase === 'voting' && hasVotedThisRound"
        class="success"
      >
        <div class="checkmark">✓</div>
        <h2>Vote recorded!</h2>
        <p class="hint">Results on the big screen...</p>
      </div>

      <!-- Joined: Vote results -->
      <div
        v-else-if="status === 'joined' && phase === 'vote-results'"
        class="vote-ended"
      >
        <h2>Vote closed!</h2>
        <p class="hint">Check the results on screen!</p>
      </div>

      <!-- Joined: Poll buttons -->
      <div
        v-else-if="status === 'joined' && phase === 'polling' && !hasPolledThisRound"
        class="polling"
      >
        <h2>Quick question!</h2>
        <p class="poll-hint">What's your Lighthouse knowledge level?</p>
        <div class="poll-buttons">
          <button
            class="poll-btn poll-cabin"
            @click="handlePoll('cabin_boy')"
            :disabled="isSubmitting"
          >
            <span class="poll-emoji">🪣</span>
            <span class="poll-label">Cabin Boy</span>
          </button>
          <button
            class="poll-btn poll-quarter"
            @click="handlePoll('quartermaster')"
            :disabled="isSubmitting"
          >
            <span class="poll-emoji">⚓</span>
            <span class="poll-label">Quartermaster</span>
          </button>
          <button
            class="poll-btn poll-captain"
            @click="handlePoll('captain')"
            :disabled="isSubmitting"
          >
            <span class="poll-emoji">🏴‍☠️</span>
            <span class="poll-label">Captain</span>
          </button>
        </div>
        <p v-if="isSubmitting" class="submitting-hint">Sending...</p>
      </div>

      <!-- Joined: Poll submitted -->
      <div
        v-else-if="status === 'joined' && phase === 'polling' && hasPolledThisRound"
        class="success"
      >
        <div class="checkmark">✓</div>
        <h2>Thanks!</h2>
        <p class="hint">Your response has been recorded</p>
      </div>

      <!-- Joined: Poll results -->
      <div
        v-else-if="status === 'joined' && phase === 'poll-results'"
        class="poll-ended"
      >
        <div class="checkmark">✓</div>
        <h2>Poll closed!</h2>
        <p class="hint">Check the results on screen!</p>
      </div>

      <!-- Joined: Default (waiting between votes) -->
      <div
        v-else-if="status === 'joined'"
        class="joined-waiting"
      >
        <div class="avatar-wrapper-large">
          <AvatarPreview
            v-if="selectedAvatar"
            :avatar="selectedAvatar"
            :size="400"
            class="responsive-avatar"
          />
        </div>
        <div class="name-pill">{{ joinedName }}</div>
        <p class="hint">The captain will let you know about the next vote!</p>
      </div>
    </div>

    <!-- Connection indicator -->
    <div class="debug">
      <span :class="isConnected ? 'connected' : 'disconnected'">
        {{ isConnected ? 'Connected' : 'Disconnected' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 24px;
  color: #ffd700;
}

.status {
  padding: 20px 0;
}

.status.error {
  color: #ff6b6b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.joined-waiting {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.name-pill {
  padding: 8px 20px;
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid #ffd700;
  border-radius: 20px;
  color: #ffd700;
  font-size: 18px;
  font-weight: 600;
  margin-top: -30px;
}

.avatar-wrapper-large {
  width: 100%;
  max-width: 500px;
  margin-bottom: 16px;
}

.avatar-wrapper-large :deep(.avatar-container) {
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 1;
}

.avatar-wrapper-large :deep(.avatar-layer) {
  width: 100%;
  height: 100%;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.next-btn {
  margin-top: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #1e3a5f;
  background: #ffd700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.next-btn:hover:not(:disabled) {
  transform: scale(1.02);
}

.next-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.avatar-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
}

.back-btn {
  align-self: flex-start;
  padding: 8px 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.back-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.name-preview {
  font-size: 18px;
  color: #ffd700;
  font-weight: 600;
  margin: 0;
}

.joining-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  z-index: 10;
}

label {
  font-size: 14px;
  text-align: left;
  opacity: 0.8;
}

input {
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #ffd700;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.validation {
  font-size: 12px;
  color: #ff6b6b;
  text-align: left;
}

.success {
  padding: 20px 0;
}

.checkmark {
  width: 60px;
  height: 60px;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 16px;
}

.success h2 {
  color: #ffd700;
  margin-bottom: 8px;
}

.hint {
  font-size: 14px;
  opacity: 0.6;
  margin-top: 8px;
}

.debug {
  position: fixed;
  bottom: 16px;
  right: 16px;
  font-size: 12px;
  opacity: 0.5;
}

.connected {
  color: #22c55e;
}

.disconnected {
  color: #ff6b6b;
}

/* Voting styles */
.voting {
  padding: 20px 0;
}

.voting h2 {
  color: #ffd700;
  margin-bottom: 8px;
}

.vote-hint {
  opacity: 0.8;
  margin-bottom: 20px;
}

.vote-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 20px;
}

.vote-btn {
  width: 120px;
  height: 120px;
  font-size: 48px;
  font-weight: bold;
  border: 3px solid;
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.vote-a {
  border-color: #3b82f6;
  color: #3b82f6;
}

.vote-a:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
  transform: scale(1.05);
}

.vote-b {
  border-color: #f59e0b;
  color: #f59e0b;
}

.vote-b:hover:not(:disabled) {
  background: #f59e0b;
  color: white;
  transform: scale(1.05);
}

.vote-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submitting-hint {
  font-size: 14px;
  color: #ffd700;
  opacity: 0.8;
  margin-top: 8px;
}

/* Poll styles */
.polling {
  padding: 20px 0;
}

.polling h2 {
  color: #ffd700;
  margin-bottom: 8px;
}

.poll-hint {
  opacity: 0.8;
  margin-bottom: 20px;
}

.poll-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.poll-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  font-size: 18px;
  font-weight: 600;
  border: 3px solid;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.poll-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.poll-emoji {
  font-size: 32px;
}

.poll-label {
  flex: 1;
  text-align: left;
}

.poll-cabin {
  border-color: #3b82f6;
}

.poll-cabin:hover:not(:disabled) {
  background: #3b82f6;
}

.poll-quarter {
  border-color: #f59e0b;
}

.poll-quarter:hover:not(:disabled) {
  background: #f59e0b;
}

.poll-captain {
  border-color: #a855f7;
}

.poll-captain:hover:not(:disabled) {
  background: #a855f7;
}

/* Vote/Poll ended styles */
.vote-ended,
.poll-ended {
  padding: 20px 0;
}

.vote-ended h2,
.poll-ended h2 {
  color: #ffd700;
  margin-bottom: 8px;
}
</style>
