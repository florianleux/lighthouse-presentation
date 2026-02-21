<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { sessionStore, currentPhase, phaseData, currentPollId, publishSessionState } from '../setup/main'
import { POLL_CONFIG } from '../../../shared/constants'

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

// Timer (internal to presentation only)
const POLL_DURATION = POLL_CONFIG.DURATION_SECONDS
const GRACE_PERIOD = POLL_CONFIG.GRACE_PERIOD_SECONDS
const timeRemaining = ref(0)
const isInGracePeriod = ref(false)
let timerInterval: ReturnType<typeof setInterval> | null = null
let graceTimeout: ReturnType<typeof setTimeout> | null = null

function startTimer() {
  clearTimer()
  timeRemaining.value = POLL_DURATION
  isInGracePeriod.value = false
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
      isInGracePeriod.value = true
      console.log('[PollButtons] Timer ended, grace period started')
      graceTimeout = setTimeout(() => {
        isInGracePeriod.value = false
        stopPollSession()
      }, GRACE_PERIOD * 1000)
    }
  }, 1000)
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
  isInGracePeriod.value = false
}

// Keyboard shortcut: V to start poll
function handleKeydown(e: KeyboardEvent) {
  if (e.key.toLowerCase() === 'v' && !isPollActive.value && sessionStore.pollPhase !== 'ended') {
    startPollSession()
  }
}

onMounted(() => {
  currentPollId.value = props.pollId
  // Publish so vote apps know we're on a poll slide
  publishSessionState()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  clearTimer()
  currentPollId.value = null
  window.removeEventListener('keydown', handleKeydown)
})

function startPollSession() {
  sessionStore.activePollId = props.pollId
  sessionStore.pollPhase = 'polling'
  startTimer()

  // Tell vote apps we're in polling phase
  currentPhase.value = 'polling'
  phaseData.value = { poll: { id: props.pollId } }
  publishSessionState()

  console.log('[PollButtons] Poll session started for', props.pollId)
}

function stopPollSession() {
  clearTimer()
  sessionStore.pollPhase = 'ended'

  // Compute results
  const r = results.value
  const pollResults: Record<string, number> = {
    cabin_boy: r.cabin_boy.length,
    quartermaster: r.quartermaster.length,
    captain: r.captain.length,
  }

  // Tell vote apps poll is over
  currentPhase.value = 'poll-results'
  phaseData.value = {
    pollResult: { id: props.pollId, results: pollResults }
  }
  publishSessionState()

  console.log('[PollButtons] Poll ended for', props.pollId)
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
