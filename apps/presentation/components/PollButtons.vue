<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
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

// Timer
const POLL_DURATION = POLL_CONFIG.DURATION_SECONDS
const timeRemaining = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

function startTimer() {
  timeRemaining.value = POLL_DURATION
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      stopPollSession()
    }
  }, 1000)
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

onUnmounted(() => clearTimer())

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
    <!-- Start Poll Button -->
    <div v-if="!isPollActive && sessionStore.pollPhase !== 'ended'" class="mb-6 text-center">
      <button
        class="px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 transition-all cursor-pointer"
        @click="startPollSession"
      >
        Start Poll Session
      </button>
    </div>

    <!-- Polling in progress + Timer + Stop button -->
    <div v-else-if="isPollActive" class="mb-6 text-center flex items-center justify-center gap-4">
      <span class="text-4xl font-bold text-white min-w-16">{{ timeRemaining }}s</span>
      <span class="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold animate-pulse">
        Polling in progress...
      </span>
      <button
        class="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all cursor-pointer"
        @click="stopPollSession"
      >
        Stop Poll
      </button>
    </div>

    <!-- Poll ended indicator -->
    <div v-else-if="sessionStore.pollPhase === 'ended'" class="mb-6 text-center">
      <span class="px-4 py-2 bg-gray-600 text-white rounded-full text-sm font-semibold">
        Poll ended - {{ totalVotes }} responses
      </span>
    </div>

    <!-- Real-time poll results (always visible) -->
    <div class="grid grid-cols-3 gap-6 pt-4">
      <div class="p-6 border-2 border-blue-500 rounded-lg text-center">
        <div class="text-5xl mb-3">🪣</div>
        <div class="text-lg font-semibold mb-2">Cabin Boy</div>
        <div class="text-3xl font-bold text-blue-500">{{ results.cabin_boy.length }}</div>
      </div>
      <div class="p-6 border-2 border-amber-500 rounded-lg text-center">
        <div class="text-5xl mb-3">⚓</div>
        <div class="text-lg font-semibold mb-2">Quartermaster</div>
        <div class="text-3xl font-bold text-amber-500">{{ results.quartermaster.length }}</div>
      </div>
      <div class="p-6 border-2 border-purple-500 rounded-lg text-center">
        <div class="text-5xl mb-3">🏴‍☠️</div>
        <div class="text-lg font-semibold mb-2">Captain</div>
        <div class="text-3xl font-bold text-purple-500">{{ results.captain.length }}</div>
      </div>
    </div>
  </div>
</template>
