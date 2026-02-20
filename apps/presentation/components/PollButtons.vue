<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import { sessionStore, getAbly, registerPollSlide, publishSessionState } from '../setup/main'
import { ABLY_CHANNELS, POLL_CONFIG } from '../../../shared/constants'
import type { PollStartedMessage, PollEndedMessage } from '../../../shared/types'

const props = defineProps<{
  pollId: string
}>()

const { currentSlideNo } = useNav()

// Is this poll currently active?
const isPollActive = computed(() =>
  sessionStore.pollPhase === 'polling' && sessionStore.activePollId === props.pollId
)

// Poll results for this poll
const results = computed(() => sessionStore.pollResults[props.pollId] || {
  cabin_boy: [],
  quartermaster: [],
  captain: []
})

// Timer - use shared constants for consistency
const POLL_DURATION = POLL_CONFIG.DURATION_SECONDS
const GRACE_PERIOD = POLL_CONFIG.GRACE_PERIOD_SECONDS
const TIME_SYNC_INTERVAL = POLL_CONFIG.TIME_SYNC_INTERVAL_SECONDS
const timeRemaining = ref(0)
const isInGracePeriod = ref(false)
let timerInterval: ReturnType<typeof setInterval> | null = null
let graceTimeout: ReturnType<typeof setTimeout> | null = null
let timeSyncInterval: ReturnType<typeof setInterval> | null = null

function startTimer() {
  clearTimer() // Clear any existing timer first
  timeRemaining.value = POLL_DURATION
  isInGracePeriod.value = false
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
      // Stop time sync during grace period
      if (timeSyncInterval) {
        clearInterval(timeSyncInterval)
        timeSyncInterval = null
      }
      // Start grace period - keep accepting votes for a few more seconds
      isInGracePeriod.value = true
      console.log('[PollButtons] Timer ended, grace period started')
      graceTimeout = setTimeout(() => {
        isInGracePeriod.value = false
        stopPollSession()
      }, GRACE_PERIOD * 1000)
    }
  }, 1000)

  // Start periodic time sync to keep vote apps synchronized
  timeSyncInterval = setInterval(() => {
    publishTimeSync()
  }, TIME_SYNC_INTERVAL * 1000)
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  if (graceTimeout) {
    clearTimeout(graceTimeout)
    graceTimeout = null
  }
  if (timeSyncInterval) {
    clearInterval(timeSyncInterval)
    timeSyncInterval = null
  }
  isInGracePeriod.value = false
}

// Publish time sync message to keep vote apps synchronized
async function publishTimeSync() {
  const ably = getAbly()
  if (ably && timeRemaining.value > 0) {
    const message: PollStartedMessage = {
      type: 'poll-started',
      pollId: props.pollId,
      duration: timeRemaining.value,
      timestamp: Date.now()
    }
    await ably.publish(ABLY_CHANNELS.SESSION, message)
    console.log('[PollButtons] Time sync published:', timeRemaining.value, 'seconds remaining')
  }
}

// Keyboard shortcut: V to start poll
function handleKeydown(e: KeyboardEvent) {
  if (e.key.toLowerCase() === 'v' && !isPollActive.value && sessionStore.pollPhase !== 'ended') {
    startPollSession()
  }
}

onMounted(() => {
  registerPollSlide(currentSlideNo.value, props.pollId)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  clearTimer()
  window.removeEventListener('keydown', handleKeydown)
})

// Start poll session
async function startPollSession() {
  sessionStore.activePollId = props.pollId
  sessionStore.pollPhase = 'polling'
  startTimer()

  const ably = getAbly()
  if (ably) {
    const message: PollStartedMessage = {
      type: 'poll-started',
      pollId: props.pollId,
      duration: POLL_DURATION,
      timestamp: Date.now()
    }
    await ably.publish(ABLY_CHANNELS.SESSION, message)
    console.log('[PollButtons] Poll session started for', props.pollId)
  }

  // Publish enriched session state so vote apps get pollContext
  publishSessionState(currentSlideNo.value, 'voting')
}

// Stop poll session
async function stopPollSession() {
  clearTimer()
  sessionStore.pollPhase = 'ended'

  // Publish PollEndedMessage so vote apps show "Poll closed!"
  const ably = getAbly()
  if (ably) {
    const message: PollEndedMessage = {
      type: 'poll-ended',
      pollId: props.pollId,
      timestamp: Date.now(),
    }
    await ably.publish(ABLY_CHANNELS.SESSION, message)
    console.log('[PollButtons] Poll ended published for', props.pollId)
  }

  // Publish enriched session state with pollContext.pollPhase = 'ended'
  publishSessionState(currentSlideNo.value, 'voting')
}
</script>

<template>
  <div>
    <div class="absolute top-[88%] left-[21%] p-1 px-2 text-center -translate-x-1/2">
      <div class="text-4xl font-bold font-title">{{ results.cabin_boy.length }}</div>
    </div>
    <div class="absolute top-[88%] left-[54%] p-1 px-2 text-center -translate-x-1/2">
      <div class="text-4xl font-bold font-title ">{{ results.quartermaster.length }}</div>
    </div>
    <div class="absolute top-[87.6%] left-[86.4%] p-1 px-2 text-center -translate-x-1/2">
      <div class="text-4xl font-bold font-title">{{ results.captain.length }}</div>
    </div>

    <button
      v-if="sessionStore.pollPhase !== 'ended'"
      class="absolute top-[89%] px-6 py-1 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-all cursor-pointer text-lg"
      @click="isPollActive ? stopPollSession() : startPollSession()"
    >
      {{ isPollActive ? 'Stop' : 'Start' }}
    </button>
  </div>
</template>
