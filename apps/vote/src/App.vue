<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAbly } from './composables/useAbly'

const { isConnected, error, connect, joinCrew } = useAbly()

// État du formulaire
const name = ref('')
const status = ref<'connecting' | 'idle' | 'joining' | 'joined' | 'error'>('connecting')
const joinedName = ref('')

// Validation
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

// Connexion au démarrage
onMounted(async () => {
  const apiKey = import.meta.env.VITE_ABLY_API_KEY as string

  if (!apiKey) {
    status.value = 'error'
    console.error('VITE_ABLY_API_KEY not set')
    return
  }

  try {
    await connect(apiKey)
    status.value = 'idle'
  } catch (err) {
    status.value = 'error'
  }
})

// Rejoindre l'équipage
async function handleJoin() {
  if (!isValid.value || status.value !== 'idle') return

  status.value = 'joining'

  try {
    await joinCrew(name.value.trim())
    joinedName.value = name.value.trim()
    status.value = 'joined'
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

      <!-- État: Connexion -->
      <div v-if="status === 'connecting'" class="status">
        <div class="spinner"></div>
        <p>Connexion en cours...</p>
      </div>

      <!-- État: Erreur -->
      <div v-else-if="status === 'error'" class="status error">
        <p>Erreur de connexion</p>
        <p class="hint">Vérifiez votre connexion internet</p>
      </div>

      <!-- État: Formulaire -->
      <div v-else-if="status === 'idle' || status === 'joining'" class="form">
        <label for="name">Votre nom de pirate</label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="Capitaine Crochet"
          maxlength="20"
          :disabled="status === 'joining'"
          @keyup.enter="handleJoin"
        />
        <p v-if="validationMessage" class="validation">{{ validationMessage }}</p>

        <button
          @click="handleJoin"
          :disabled="!isValid || status === 'joining'"
          class="join-btn"
        >
          <span v-if="status === 'joining'">Embarquement...</span>
          <span v-else>Rejoindre l'équipage</span>
        </button>
      </div>

      <!-- État: Rejoint -->
      <div v-else-if="status === 'joined'" class="success">
        <div class="checkmark">✓</div>
        <h2>Bienvenue à bord, {{ joinedName }} !</h2>
        <p>Vous êtes maintenant dans l'équipage.</p>
        <p class="hint">Attendez les instructions du capitaine...</p>
      </div>
    </div>

    <!-- Debug info -->
    <div class="debug">
      <span :class="isConnected ? 'connected' : 'disconnected'">
        {{ isConnected ? 'Connecté' : 'Déconnecté' }}
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
