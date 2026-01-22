<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAbly } from './composables/useAbly'
import { STORAGE_KEYS } from '../../../shared/constants'

interface SavedMember {
  name: string
  odientId: string
  keynoteId: string
}

const { isConnected, error, connect, joinCrew, getOdientId, restoreSession, onSessionState } = useAbly()

// Form state
const name = ref('')
const status = ref<'connecting' | 'waiting' | 'idle' | 'joining' | 'joined' | 'error'>('connecting')
const joinedName = ref('')
const activeKeynoteId = ref<string | null>(null)

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

// Can join only if we have an active keynote
const canJoin = computed(() => isValid.value && activeKeynoteId.value !== null)

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
function saveMember(memberName: string, odientId: string, keynoteId: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.CREW_MEMBER, JSON.stringify({
      name: memberName,
      odientId,
      keynoteId
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
      console.log('[App] Received session state, keynoteId:', newKeynoteId)

      // Update active keynote
      activeKeynoteId.value = newKeynoteId

      // If we have a saved member, validate keynoteId
      if (savedMember && status.value === 'joined') {
        if (newKeynoteId && savedMember.keynoteId !== newKeynoteId) {
          // Session expired - clear and go back to form
          console.log('[App] Keynote mismatch, clearing session')
          clearSavedMember()
          joinedName.value = ''
          status.value = newKeynoteId ? 'idle' : 'waiting'
        }
      }

      // If waiting and keynote is now available, show form
      if (status.value === 'waiting' && newKeynoteId) {
        status.value = 'idle'
      }
    })

    // Determine initial status
    if (savedMember) {
      // Temporarily show joined state, will validate when we receive session state
      joinedName.value = savedMember.name
      status.value = 'joined'
      console.log('[App] Restored session for', savedMember.name, '(awaiting keynote validation)')
    } else {
      // Show waiting state until we receive a keynote
      status.value = 'waiting'
    }
  } catch (err) {
    status.value = 'error'
  }
})

// Join the crew
async function handleJoin() {
  if (!canJoin.value || status.value !== 'idle' || !activeKeynoteId.value) return

  status.value = 'joining'

  try {
    await joinCrew(name.value.trim(), activeKeynoteId.value)
    joinedName.value = name.value.trim()
    status.value = 'joined'

    // Save to localStorage with keynoteId
    const odientId = getOdientId()
    if (odientId) {
      saveMember(name.value.trim(), odientId, activeKeynoteId.value)
    }
  } catch (err) {
    console.error('Failed to join crew:', err)
    status.value = 'error'
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

      <!-- State: Form -->
      <div v-else-if="status === 'idle' || status === 'joining'" class="form">
        <label for="name">Your pirate name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="Captain Hook"
          maxlength="20"
          :disabled="status === 'joining'"
          @keyup.enter="handleJoin"
        />
        <p v-if="validationMessage" class="validation">{{ validationMessage }}</p>

        <button
          @click="handleJoin"
          :disabled="!canJoin || status === 'joining'"
          class="join-btn"
        >
          <span v-if="status === 'joining'">Boarding...</span>
          <span v-else>Join the crew</span>
        </button>
      </div>

      <!-- State: Joined -->
      <div v-else-if="status === 'joined'" class="success">
        <div class="checkmark">✓</div>
        <h2>Welcome aboard, {{ joinedName }}!</h2>
        <p>You're now part of the crew.</p>
        <p class="hint">Wait for the captain's instructions...</p>
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

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
</style>
