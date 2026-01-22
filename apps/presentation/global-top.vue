<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import NavigationBlocker from './components/NavigationBlocker.vue'
import VoteTower from './components/VoteTower.vue'
import AdminPanel from './components/AdminPanel.vue'
import SessionRecoveryModal from './components/SessionRecoveryModal.vue'
import { sessionStore, publishSessionState } from './setup/main'

const { go } = useNav()

const showAdminPanel = ref(false)
const showRecoveryModal = ref(false)

function handleKeydown(e: KeyboardEvent) {
  // Toggle admin panel with K key
  if (e.key === 'k' || e.key === 'K') {
    // Don't trigger if user is typing in an input or modal is shown
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }
    if (showRecoveryModal.value) {
      return
    }
    showAdminPanel.value = !showAdminPanel.value
  }

  // Close with Escape
  if (e.key === 'Escape') {
    if (showAdminPanel.value) {
      showAdminPanel.value = false
    }
  }
}

function handleContinueSession() {
  showRecoveryModal.value = false
  // Publish session state so vote apps receive the keynoteId
  publishSessionState(1, 'intro')
}

function handleResetSession() {
  showRecoveryModal.value = false
  // Start fresh with new keynoteId
  sessionStore.startNewSession()
  // Navigate to slide 1
  go(1)
  // Publish the new session state
  publishSessionState(1, 'intro')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  // Show recovery modal if keynoteId exists
  if (sessionStore.keynoteId) {
    showRecoveryModal.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <NavigationBlocker />
  <VoteTower />
  <AdminPanel
    :visible="showAdminPanel"
    @close="showAdminPanel = false"
  />
  <SessionRecoveryModal
    :visible="showRecoveryModal"
    :keynote-id="sessionStore.keynoteId || ''"
    @continue="handleContinueSession"
    @reset="handleResetSession"
  />
</template>
