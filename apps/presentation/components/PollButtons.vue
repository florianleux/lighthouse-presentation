<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { sessionStore, currentPhase, phaseData, firestore, getFakeCrewIds } from '../setup/main'
import { POLL_CONFIG } from '../../../shared/constants'

const props = defineProps<{
  pollId: string
}>()

// Is this poll currently active?
const isPollActive = computed(() =>
  sessionStore.pollPhase === 'polling' && sessionStore.activePollId === props.pollId
)

// Poll results for this poll
const results = computed(() => {
  const raw = sessionStore.pollResults[props.pollId]
  return {
    newbie: raw?.newbie ?? [],
    captain: raw?.captain ?? [],
    admiral: raw?.admiral ?? [],
  }
})

// Total poll votes (for X/X display and auto-stop)
const totalPollVotes = computed(() => {
  const r = results.value
  return r.newbie.length + r.captain.length + r.admiral.length
})

// Timer (internal to presentation only)
const POLL_DURATION = POLL_CONFIG.DURATION_SECONDS
const timeRemaining = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

function startTimer() {
  clearTimer()
  timeRemaining.value = POLL_DURATION
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
      console.log('[PollButtons] Timer ended, auto-stopping poll')
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

// Reset timer when poll phase resets (e.g. after session reset)
watch(() => sessionStore.pollPhase, (phase) => {
  if (phase === 'waiting') {
    clearTimer()
    timeRemaining.value = 0
  }
})

// Auto-stop when all crew members have voted
watch(totalPollVotes, (total) => {
  if (isPollActive.value && sessionStore.crew.length > 0 && total >= sessionStore.crew.length) {
    console.log('[PollButtons] All crew voted, auto-stopping poll')
    stopPollSession()
  }
})

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

function startPollSession() {
  sessionStore.activePollId = props.pollId
  sessionStore.pollPhase = 'polling'
  startTimer()

  // Update session phase
  currentPhase.value = 'polling'
  phaseData.value = { poll: { id: props.pollId } }

  // Firestore: open poll and listen for responses
  firestore.openPoll(props.pollId, POLL_DURATION)
  firestore.listenToPollResponses(props.pollId, (participantId, choice) => {
    sessionStore.recordPollVote(participantId, props.pollId, choice)
  })

  // Auto-simulate fake crew poll responses (fire-and-forget)
  const fakeCrewIds = getFakeCrewIds()
  if (fakeCrewIds.length > 0) {
    const maxDurationMs = Math.min(fakeCrewIds.length * 200, 20000)
    firestore.simulateFakePollResponses(props.pollId, fakeCrewIds, maxDurationMs)
    console.log(`[PollButtons] Auto-simulating ${fakeCrewIds.length} fake poll responses`)
  }

  console.log('[PollButtons] Poll session started for', props.pollId)
}

function stopPollSession() {
  // Guard: prevent double-stop (timer + all-voted watcher can race)
  if (sessionStore.pollPhase !== 'polling') return

  clearTimer()
  sessionStore.pollPhase = 'ended'
  firestore.stopListeningToPollResponses()

  // Compute results
  const r = results.value
  const pollResults: Record<string, number> = {
    newbie: r.newbie.length,
    captain: r.captain.length,
    admiral: r.admiral.length,
  }

  // Update session phase
  currentPhase.value = 'poll-results'
  phaseData.value = {
    pollResult: { id: props.pollId, results: pollResults }
  }

  // Firestore: close poll with results
  firestore.closePoll(props.pollId, pollResults)

  console.log('[PollButtons] Poll ended for', props.pollId)
}
</script>

<template>
  <div>
    <div class="absolute top-[88%] left-[21%] p-1 px-2 text-center -translate-x-1/2">
      <div class="text-4xl font-bold font-title">{{ results.newbie.length }}</div>
    </div>
    <div class="absolute top-[88%] left-[54%] p-1 px-2 text-center -translate-x-1/2">
      <div class="text-4xl font-bold font-title">{{ results.captain.length }}</div>
    </div>
    <div class="absolute top-[87.6%] left-[86.4%] p-1 px-2 text-center -translate-x-1/2">
      <div class="text-4xl font-bold font-title">{{ results.admiral.length }}</div>
    </div>

    <div
      v-if="isPollActive && timeRemaining > 0"
      class="absolute top-[82%] left-[7.5%] -translate-x-1/2 text-3xl font-bold font-title text-white"
    >
      {{ timeRemaining }}
    </div>

    <!-- Participation counter -->
    <div
      v-if="isPollActive"
      class="absolute -bottom-[3%] -right-[3%] -translate-1/2 text-xl font-bold font-title text-center text-white"
    >
      {{ totalPollVotes }}/{{ sessionStore.crew.length }}<br>answered
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
