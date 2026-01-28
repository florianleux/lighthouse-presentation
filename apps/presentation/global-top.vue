<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import NavigationBlocker from './components/NavigationBlocker.vue'
import VoteTower from './components/VoteTower.vue'
import AdminPanel from './components/AdminPanel.vue'
import CrewPills from './components/CrewPills.vue'
import { sessionStore, voteStore, VOTE_SLIDES, publishSessionState } from './setup/main'

const { go, currentSlideNo } = useNav()

// Track slide changes to persist last slide and auto-skip completed votes
watch(currentSlideNo, (slide) => {
  if (sessionStore.keynoteId && slide) {
    sessionStore.updateLastSlide(slide)
    // Publish session state on every slide change so late joiners get the current state
    publishSessionState(slide, 'intro')
  }

  // Auto-skip completed vote slides
  const voteIndex = VOTE_SLIDES.indexOf(slide)
  if (voteIndex !== -1 && voteStore.path[voteIndex] !== null) {
    // Vote already done, skip forward
    nextTick(() => go(slide + 1))
  }
})

const showAdminPanel = ref(false)

// Join session with timed heartbeat
let heartbeatInterval: ReturnType<typeof setInterval> | null = null
let countdownInterval: ReturnType<typeof setInterval> | null = null
const joinSessionRemaining = ref(0)

function startHeartbeat() {
  if (heartbeatInterval) return
  heartbeatInterval = setInterval(() => {
    if (sessionStore.keynoteId && currentSlideNo.value) {
      publishSessionState(currentSlideNo.value, 'intro')
    }
  }, 3000)
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval)
    heartbeatInterval = null
  }
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  joinSessionRemaining.value = 0
}

function handleStartJoinSession(durationMinutes: number) {
  // Stop any existing session
  stopHeartbeat()
  stopCountdown()

  // Start countdown
  joinSessionRemaining.value = durationMinutes * 60
  countdownInterval = setInterval(() => {
    joinSessionRemaining.value--
    if (joinSessionRemaining.value <= 0) {
      stopHeartbeat()
      stopCountdown()
    }
  }, 1000)

  // Start heartbeat
  startHeartbeat()
  // Send immediate heartbeat
  if (sessionStore.keynoteId && currentSlideNo.value) {
    publishSessionState(currentSlideNo.value, 'intro')
  }
}

function handleSendHeartbeat() {
  if (sessionStore.keynoteId && currentSlideNo.value) {
    publishSessionState(currentSlideNo.value, 'intro')
  }
}

function handleKeydown(e: KeyboardEvent) {
  // Toggle admin panel with K key
  if (e.key === 'k' || e.key === 'K') {
    // Don't trigger if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
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

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  stopHeartbeat()
  stopCountdown()
})
</script>

<template>
  <NavigationBlocker />
  <CrewPills :current-slide="currentSlideNo" />
  <VoteTower />
  <AdminPanel
    :visible="showAdminPanel"
    :join-session-remaining="joinSessionRemaining"
    @close="showAdminPanel = false"
    @start-join-session="handleStartJoinSession"
    @send-heartbeat="handleSendHeartbeat"
  />
</template>
