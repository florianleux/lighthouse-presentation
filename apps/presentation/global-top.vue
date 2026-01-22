<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import NavigationBlocker from './components/NavigationBlocker.vue'
import VoteTower from './components/VoteTower.vue'
import AdminPanel from './components/AdminPanel.vue'
import SessionRecoveryModal from './components/SessionRecoveryModal.vue'
import { sessionStore, voteStore, VOTE_SLIDES, publishSessionState } from './setup/main'

const { go, currentSlideNo } = useNav()

// Track slide changes to persist last slide and auto-skip completed votes
watch(currentSlideNo, (slide) => {
  if (sessionStore.keynoteId && slide) {
    sessionStore.updateLastSlide(slide)
  }

  // Auto-skip completed vote slides
  const voteIndex = VOTE_SLIDES.indexOf(slide)
  if (voteIndex !== -1 && voteStore.path[voteIndex] !== null) {
    // Vote already done, skip forward
    nextTick(() => go(slide + 1))
  }
})

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

function handleContinueHere() {
  showRecoveryModal.value = false
  // Resume at current URL slide
  const targetSlide = currentSlideNo.value
  go(targetSlide)
  publishSessionState(targetSlide, 'intro')
}

function handleContinueAtLast() {
  showRecoveryModal.value = false
  // Resume at last recorded slide
  const targetSlide = sessionStore.lastSlide
  go(targetSlide)
  publishSessionState(targetSlide, 'intro')
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
    :created-at="sessionStore.createdAt || 0"
    :last-slide="sessionStore.lastSlide"
    :current-slide="currentSlideNo"
    @continue-here="handleContinueHere"
    @continue-at-last="handleContinueAtLast"
    @reset="handleResetSession"
  />
</template>
