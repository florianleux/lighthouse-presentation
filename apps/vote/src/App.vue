<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAbly } from './composables/useAbly'
import { STORAGE_KEYS } from '../../../shared/constants'
import AvatarCreator from './components/AvatarCreator.vue'
import AvatarPreview from './components/AvatarPreview.vue'

interface SavedMember {
  name: string
  odientId: string
  keynoteId: string
  avatar: string | null
}

const { isConnected, error, connect, joinCrew, getOdientId, restoreSession, onSessionState, onVoteStarted, sendVote } = useAbly()

// Form state
const name = ref('')
const status = ref<'connecting' | 'waiting' | 'idle' | 'joining' | 'joined' | 'error'>('connecting')
const currentStep = ref<'name' | 'avatar'>('name')
const joinedName = ref('')
const activeKeynoteId = ref<string | null>(null)

// Avatar state (JSON string)
const selectedAvatar = ref<string | null>(null)

// Voting state
const activeVoteIndex = ref<number | null>(null)
const selectedChoice = ref<'A' | 'B' | null>(null)
const hasVoted = ref(false)
const voteMissed = ref(false)

// Timer state
const timeRemaining = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

function startCountdown(duration: number) {
  timeRemaining.value = duration

  if (timerInterval) clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
      // Auto-submit if a choice is selected, otherwise mark as missed
      if (selectedChoice.value && !hasVoted.value) {
        submitVote()
      } else if (!hasVoted.value) {
        voteMissed.value = true
      }
    }
  }, 1000)
}

function clearCountdown() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  timeRemaining.value = 0
}

// Validation
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

// Can go to next step if name is valid
const canGoNext = computed(() => isValid.value && activeKeynoteId.value !== null)

// Load saved crew member from localStorage
function loadSavedMember(): SavedMember | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CREW_MEMBER)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load saved member:', e)
  }
  return null
}

// Save crew member to localStorage
function saveMember(memberName: string, odientId: string, keynoteId: string, avatar: string | null) {
  try {
    localStorage.setItem(STORAGE_KEYS.CREW_MEMBER, JSON.stringify({
      name: memberName,
      odientId,
      keynoteId,
      avatar
    }))
  } catch (e) {
    console.error('Failed to save member:', e)
  }
}

// Clear saved member from localStorage
function clearSavedMember() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CREW_MEMBER)
  } catch (e) {
    console.error('Failed to clear saved member:', e)
  }
}

// Connect on mount
onMounted(async () => {
  const apiKey = import.meta.env.VITE_ABLY_API_KEY as string

  if (!apiKey) {
    status.value = 'error'
    console.error('VITE_ABLY_API_KEY not set')
    return
  }

  // Check for saved member
  const savedMember = loadSavedMember()

  try {
    // Connect (with saved odientId if available)
    await connect(apiKey, savedMember?.odientId)

    if (savedMember) {
      restoreSession(savedMember.odientId)
    }

    // Subscribe to session state to get keynoteId
    onSessionState((msg) => {
      const newKeynoteId = msg.keynoteId
      const previousKeynoteId = activeKeynoteId.value
      console.log('[App] Received session state, keynoteId:', newKeynoteId, 'status:', status.value)
      activeKeynoteId.value = newKeynoteId

      // Only handle initial sync when in 'connecting' state
      if (status.value === 'connecting') {
        if (savedMember) {
          if (newKeynoteId && savedMember.keynoteId === newKeynoteId) {
            // Same keynote - restore session
            status.value = 'joined'
            console.log('[App] Same keynote, restoring session')
          } else if (newKeynoteId) {
            // Different keynote active - clear and show form
            console.log('[App] Different keynote, clearing session')
            clearSavedMember()
            joinedName.value = ''
            selectedAvatar.value = null
            currentStep.value = 'name'
            status.value = 'idle'
          } else {
            // No keynote active - clear and wait
            console.log('[App] No keynote active, clearing session')
            clearSavedMember()
            joinedName.value = ''
            selectedAvatar.value = null
            currentStep.value = 'name'
            status.value = 'waiting'
          }
        } else {
          // No saved member
          status.value = newKeynoteId ? 'idle' : 'waiting'
        }
        return
      }

      // Handle keynote change while already joined/idle
      if (status.value === 'joined' && previousKeynoteId && newKeynoteId !== previousKeynoteId) {
        // Keynote changed - kick back to form
        console.log('[App] Keynote changed, clearing session')
        clearSavedMember()
        joinedName.value = ''
        selectedAvatar.value = null
        currentStep.value = 'name'
        status.value = newKeynoteId ? 'idle' : 'waiting'
      }
    })

    // Subscribe to vote-started messages
    onVoteStarted((msg) => {
      console.log('[App] Vote started:', msg.voteIndex, 'duration:', msg.duration)
      activeVoteIndex.value = msg.voteIndex
      selectedChoice.value = null
      hasVoted.value = false
      voteMissed.value = false
      // Start countdown if duration is provided
      if (msg.duration > 0) {
        startCountdown(msg.duration)
      }
    })

    // After connecting, stay in 'connecting' until we receive session-state
    // Just restore the data, don't set final status yet
    if (savedMember) {
      joinedName.value = savedMember.name
      selectedAvatar.value = savedMember.avatar
      console.log('[App] Restored data for', savedMember.name, ', waiting for session-state')
    }
    // Stay in 'connecting' - will transition when session-state is received
  } catch (err) {
    status.value = 'error'
  }
})

// Go to avatar step
function handleNext() {
  if (!canGoNext.value || status.value !== 'idle') return
  currentStep.value = 'avatar'
}

// Go back to name step
function handleBack() {
  currentStep.value = 'name'
}

// Join the crew (called from AvatarCreator)
async function handleJoin(avatar: string) {
  if (status.value !== 'idle' || !activeKeynoteId.value) return

  status.value = 'joining'
  selectedAvatar.value = avatar

  try {
    await joinCrew(name.value.trim(), activeKeynoteId.value, avatar)
    joinedName.value = name.value.trim()
    status.value = 'joined'

    // Save to localStorage with keynoteId
    const odientId = getOdientId()
    if (odientId) {
      saveMember(name.value.trim(), odientId, activeKeynoteId.value, avatar)
    }
  } catch (err) {
    console.error('Failed to join crew:', err)
    status.value = 'error'
  }
}

// Submit vote
async function submitVote() {
  console.log('[App] submitVote called:', {
    selectedChoice: selectedChoice.value,
    activeVoteIndex: activeVoteIndex.value,
    activeKeynoteId: activeKeynoteId.value
  })

  // Try to get keynoteId from localStorage if not available
  let keynoteId = activeKeynoteId.value
  if (!keynoteId) {
    const saved = loadSavedMember()
    keynoteId = saved?.keynoteId || null
    console.log('[App] Using saved keynoteId:', keynoteId)
  }

  if (!selectedChoice.value || activeVoteIndex.value === null || !keynoteId) {
    console.warn('[App] Cannot submit vote - missing data:', {
      selectedChoice: selectedChoice.value,
      activeVoteIndex: activeVoteIndex.value,
      keynoteId
    })
    return
  }

  try {
    await sendVote(activeVoteIndex.value, selectedChoice.value, keynoteId)
    hasVoted.value = true
    clearCountdown()
    console.log('[App] Vote submitted:', selectedChoice.value)
  } catch (err) {
    console.error('Failed to submit vote:', err)
  }
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>Lighthouse Pirates</h1>

      <!-- State: Connecting -->
      <div v-if="status === 'connecting'" class="status">
        <div class="spinner"></div>
        <p>Connecting...</p>
      </div>

      <!-- State: Waiting for presentation -->
      <div v-else-if="status === 'waiting'" class="status">
        <div class="spinner"></div>
        <p>Waiting for the captain...</p>
        <p class="hint">The presentation hasn't started yet</p>
      </div>

      <!-- State: Error -->
      <div v-else-if="status === 'error'" class="status error">
        <p>Connection error</p>
        <p class="hint">Check your internet connection</p>
      </div>

      <!-- State: Form - Name Step -->
      <div v-else-if="(status === 'idle' || status === 'joining') && currentStep === 'name'" class="form">
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

        <button
          @click="handleNext"
          :disabled="!canGoNext"
          class="next-btn"
        >
          Next
        </button>
      </div>

      <!-- State: Form - Avatar Step -->
      <div v-else-if="(status === 'idle' || status === 'joining') && currentStep === 'avatar'" class="avatar-step">
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

      <!-- State: Joined - Waiting -->
      <div v-else-if="status === 'joined' && activeVoteIndex === null" class="joined-waiting">
        <div class="name-pill">{{ joinedName }}</div>
        <div class="avatar-wrapper">
          <AvatarPreview v-if="selectedAvatar" :avatar="selectedAvatar" :size="120" />
        </div>
        <p class="hint">Wait for the captain's instructions...</p>
      </div>

      <!-- State: Joined - Voting -->
      <div v-else-if="status === 'joined' && activeVoteIndex !== null && !hasVoted" class="voting">
        <h2>Vote now!</h2>
        <div v-if="timeRemaining > 0" class="countdown">{{ timeRemaining }}s</div>
        <p class="vote-hint">Choose your option</p>
        <div class="vote-buttons">
          <button
            :class="['vote-btn', 'vote-a', { selected: selectedChoice === 'A' }]"
            @click="selectedChoice = 'A'"
          >
            A
          </button>
          <button
            :class="['vote-btn', 'vote-b', { selected: selectedChoice === 'B' }]"
            @click="selectedChoice = 'B'"
          >
            B
          </button>
        </div>
        <button
          class="validate-btn"
          :disabled="!selectedChoice"
          @click="submitVote"
        >
          Validate
        </button>
      </div>

      <!-- State: Joined - Voted -->
      <div v-else-if="status === 'joined' && hasVoted" class="success">
        <div class="checkmark">✓</div>
        <h2>Vote recorded!</h2>
        <p>You voted for option {{ selectedChoice }}</p>
        <p class="hint">Wait for the results...</p>
      </div>

      <!-- State: Joined - Missed vote -->
      <div v-else-if="status === 'joined' && voteMissed" class="missed">
        <div class="missed-icon">X</div>
        <h2>Too late!</h2>
        <p>You missed the vote</p>
        <p class="hint">Wait for the next one...</p>
      </div>
    </div>

    <!-- Debug info -->
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
  max-width: 360px;
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
  to { transform: rotate(360deg); }
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
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 24px;
}

.avatar-wrapper {
  margin-bottom: 16px;
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

.join-btn {
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

.join-btn:hover:not(:disabled) {
  transform: scale(1.02);
}

.join-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.missed {
  padding: 20px 0;
}

.missed-icon {
  width: 60px;
  height: 60px;
  background: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
  margin: 0 auto 16px;
}

.missed h2 {
  color: #ef4444;
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

.countdown {
  font-size: 48px;
  font-weight: bold;
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
  width: 80px;
  height: 80px;
  font-size: 32px;
  font-weight: bold;
  border: 3px solid;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.vote-a {
  border-color: #3b82f6;
  color: #3b82f6;
}

.vote-a:hover,
.vote-a.selected {
  background: #3b82f6;
  color: white;
}

.vote-b {
  border-color: #f59e0b;
  color: #f59e0b;
}

.vote-b:hover,
.vote-b.selected {
  background: #f59e0b;
  color: white;
}

.validate-btn {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  color: #1e3a5f;
  background: #22c55e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.validate-btn:hover:not(:disabled) {
  transform: scale(1.02);
}

.validate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
