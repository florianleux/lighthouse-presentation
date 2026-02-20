<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import AdminPanel from './components/AdminPanel.vue'
import CrewPills from './components/CrewPills.vue'
import { sessionStore, publishSessionState } from './setup/main'

const { currentSlideNo } = useNav()

// Track slide changes to persist last slide
watch(currentSlideNo, (slide) => {
  if (sessionStore.keynoteId && slide) {
    sessionStore.updateLastSlide(slide)
    // Publish session state on every slide change so late joiners get the current state
    publishSessionState(slide)
  }
})

const showAdminPanel = ref(false)

// Session state broadcast for late joiners
let broadcastInterval: ReturnType<typeof setInterval> | null = null
let countdownInterval: ReturnType<typeof setInterval> | null = null
const joinSessionRemaining = ref(0)

function startBroadcast() {
  if (broadcastInterval) return
  broadcastInterval = setInterval(() => {
    if (sessionStore.keynoteId && currentSlideNo.value) {
      publishSessionState(currentSlideNo.value)
    }
  }, 3000)
}

function stopBroadcast() {
  if (broadcastInterval) {
    clearInterval(broadcastInterval)
    broadcastInterval = null
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
  stopBroadcast()
  stopCountdown()

  joinSessionRemaining.value = durationMinutes * 60
  countdownInterval = setInterval(() => {
    joinSessionRemaining.value--
    if (joinSessionRemaining.value <= 0) {
      stopBroadcast()
      stopCountdown()
    }
  }, 1000)

  startBroadcast()
  // Send immediate session state
  if (sessionStore.keynoteId && currentSlideNo.value) {
    publishSessionState(currentSlideNo.value)
  }
}

function handleSendHeartbeat() {
  if (sessionStore.keynoteId && currentSlideNo.value) {
    publishSessionState(currentSlideNo.value)
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'k' || e.key === 'K') {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }
    showAdminPanel.value = !showAdminPanel.value
  }

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
  stopBroadcast()
  stopCountdown()
})
</script>

<template>
  <CrewPills :current-slide="currentSlideNo" />
  <AdminPanel
    :visible="showAdminPanel"
    :join-session-remaining="joinSessionRemaining"
    @close="showAdminPanel = false"
    @start-join-session="handleStartJoinSession"
    @send-heartbeat="handleSendHeartbeat"
  />
</template>
