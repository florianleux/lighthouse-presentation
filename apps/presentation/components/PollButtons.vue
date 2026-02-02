<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { sessionStore, getAbly } from '../setup/main'
import { ABLY_CHANNELS, POLL_CONFIG } from '../../../shared/constants'
import type { PollStartedMessage } from '../../../shared/types'

const props = defineProps<{
  pollId: string
}>()

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

// Total votes
const totalVotes = computed(() =>
  results.value.cabin_boy.length +
  results.value.quartermaster.length +
  results.value.captain.length
)

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
}

// Stop poll session
function stopPollSession() {
  clearTimer()
  sessionStore.pollPhase = 'ended'
  console.log('[PollButtons] Poll session stopped for', props.pollId)
}
</script>

<template>
  <div class="poll-container">
    <!-- Start poll button -->


    <!-- Polling in progress + Timer + Stop button -->
    <div
      v-if="isPollActive"
      class="mb-6 text-center flex items-center justify-center gap-4"
    >
      <span class="text-4xl font-bold text-white min-w-16">{{ timeRemaining }}s</span>
      <span
        v-if="!isInGracePeriod"
        class="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold animate-pulse"
      >
        Polling in progress...
      </span>
      <span
        v-else
        class="px-4 py-2 bg-yellow-600 text-white rounded-full text-sm font-semibold animate-pulse"
      >
        Accepting late votes...
      </span>
      <button
        class="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all cursor-pointer"
        @click="stopPollSession"
      >
        Stop Poll
      </button>
    </div>

    <!-- Poll ended indicator -->
    <div
      v-if="sessionStore.pollPhase === 'ended'"
      class="mb-6 text-center"
    >
      <span class="px-4 py-2 bg-gray-600 text-white rounded-full text-sm font-semibold">
        Poll ended - {{ totalVotes }} responses
      </span>
    </div>

    <!-- Real-time poll results (always visible) -->
    <div class="grid grid-cols-3 gap-6 pt-4">
      <div class="p-6 rounded-lg text-center">
        <div class="text-5xl mb-3">🪣</div>
        <div class="text-lg font-semibold">Cabin Boy</div>
        <div class="text-xs mb-4 font-light italic">Never heard of it until today</div>
        <div class="text-3xl font-bold text-blue-500">{{ results.cabin_boy.length }}</div>
      </div>
      <div class="p-6 rounded-lg text-center">
        <div class="text-5xl mb-3">⚓</div>
        <div class="text-lg font-semibold">Quartermaster</div>
        <div class="text-xs mb-4 font-light italic">Know the concepts roughly</div>
        <div class="text-3xl font-bold text-amber-500">{{ results.quartermaster.length }}</div>
      </div>
      <div class="p-6 rounded-lg text-center">
        <div class="text-5xl mb-3">🏴‍☠️</div>
        <div class="text-lg font-semibold">Captain</div>
        <div class="text-xs mb-4 font-light italic">Worked on it several times</div>
        <div class="text-3xl font-bold text-purple-500">{{ results.captain.length }}</div>
      </div>
    </div>
    <div
      v-if="!isPollActive && sessionStore.pollPhase !== 'ended'"
      class="mb-6 text-center"
    >
      <button
        class="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all cursor-pointer text-lg"
        @click="startPollSession"
      >
        Start Poll
      </button>
    </div>
  </div>
</template>
