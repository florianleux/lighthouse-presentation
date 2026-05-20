<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import { sessionStore, voteStore, currentPhase, phaseData, firestore, publishSessionState, getFakeCrewIds } from '../setup/main'
import { VOTE_CONFIG } from '../../../shared/constants'
import { useResolvedMetric } from '../composables/useResolvedMetric'
import { getMetricByIndex } from '../../../shared/metrics-data'
import { FLOOR_POSITIONS } from '../../../shared/floor-positions'

const props = defineProps<{
  metricIndex: number
}>()

const { getResolvedVoteProps } = useResolvedMetric()
const voteProps = computed(() => getResolvedVoteProps(props.metricIndex))
const voteIndex = computed(() => voteProps.value.voteIndex)
const titleA = computed(() => voteProps.value.titleA)
const titleB = computed(() => voteProps.value.titleB)

const metricName = computed(() => getMetricByIndex(props.metricIndex)?.name.toLowerCase() ?? '')
const floorA = computed(() => `/floors/floor-${metricName.value}-a.webp`)
const floorB = computed(() => `/floors/floor-${metricName.value}-b.webp`)
const posA = computed(() => FLOOR_POSITIONS[metricName.value]?.vote.a ?? {})
const posB = computed(() => FLOOR_POSITIONS[metricName.value]?.vote.b ?? {})

const { next, currentSlideNo } = useNav()

// Block navigation during active vote (capture phase to intercept before Slidev)
function blockNavigation(e: KeyboardEvent) {
  if (!isVoteActive.value) return
  const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'Enter', 'PageUp', 'PageDown']
  if (navKeys.includes(e.code) || navKeys.includes(e.key)) {
    e.preventDefault()
    e.stopPropagation()
  }
}

onMounted(() => {
  window.addEventListener('keydown', blockNavigation, true)
})

onUnmounted(() => {
  clearTimer()
  window.removeEventListener('keydown', blockNavigation, true)
})

// --- Vote logic (shared by manual + audience) ---

async function applyVote(choice: 'A' | 'B') {
  const r = sessionStore.voteResults[voteIndex.value]
  if (r) r.winner = choice
  voteStore.vote(voteIndex.value, choice)
  sessionStore.votePhase = 'waiting'
  sessionStore.activeVoteIndex = null
  firestore.stopListeningToBallots()

  // Persist winner to Firebase for derived option resolution (even in manual mode)
  await firestore.persistVoteWinner(voteIndex.value, choice)

  currentPhase.value = 'idle'
  phaseData.value = {}
  publishSessionState()
  next()
}

// Direct vote from option block clicks (always available, overrides any ongoing/completed vote)
function manualVote(choice: 'A' | 'B') {
  if (isVoteActive.value) {
    // Terminate ongoing vote session cleanly before applying override
    clearTimer()
    sessionStore.votePhase = 'ended'
    firestore.stopListeningToBallots()
    const r = sessionStore.voteResults[voteIndex.value]
    firestore.closeVote(voteIndex.value, {
      winner: choice,
      counts: { A: r?.A.length ?? 0, B: r?.B.length ?? 0 },
      total: (r?.A.length ?? 0) + (r?.B.length ?? 0),
    })
  }
  applyVote(choice)
}

// --- Audience vote session ---

const isVoteActive = computed(() =>
  sessionStore.votePhase === 'voting' && sessionStore.activeVoteIndex === voteIndex.value
)

const isVoteDone = computed(() =>
  sessionStore.voteResults[voteIndex.value]?.winner !== null
)

// Timer (internal to presentation only - no sync to vote apps)
const VOTE_DURATION = VOTE_CONFIG.DURATION_SECONDS
const timeRemaining = ref(VOTE_DURATION)
let timerInterval: ReturnType<typeof setInterval> | null = null

function startTimer() {
  clearTimer()
  timeRemaining.value = VOTE_DURATION
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
      console.log('[VoteSlide] Timer ended, auto-stopping vote')
      stopVoteSession()
    }
  }, 1000)
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Clear timer interval when vote phase resets (e.g. after session reset or vote ends)
// Note: timeRemaining is NOT reset here — startTimer() handles that when a new vote begins
watch(() => sessionStore.votePhase, (phase) => {
  if (phase === 'waiting') {
    clearTimer()
  }
})

// Auto-stop when all crew members have voted
const totalVotes = computed(() => {
  const r = sessionStore.voteResults[voteIndex.value]
  return (r?.A.length ?? 0) + (r?.B.length ?? 0)
})

watch(totalVotes, (total) => {
  if (isVoteActive.value && sessionStore.crew.length > 0 && total >= sessionStore.crew.length) {
    console.log('[VoteSlide] All crew voted, auto-stopping vote')
    stopVoteSession()
  }
})

// Auto-start vote when arriving on this slide
// All VoteSlide instances are mounted by Slidev, so check DOM visibility to only start the right one
const slideEl = ref<HTMLElement | null>(null)

function isSlideVisible(): boolean {
  if (!slideEl.value) return false
  const rect = slideEl.value.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
}

// A vote can only be started once per session — prevents re-triggering on back/forward navigation
const hasBeenStarted = computed(() => sessionStore.startedVoteIndices.has(voteIndex.value))

watch(currentSlideNo, () => {
  if (sessionStore.manualMode || isVoteDone.value || isVoteActive.value || hasBeenStarted.value) return
  if (currentPhase.value === 'lobby') return // Don't auto-start during reset/lobby
  setTimeout(() => {
    if (isSlideVisible() && !isVoteDone.value && !hasBeenStarted.value && currentPhase.value !== 'lobby' && sessionStore.activeVoteIndex === null && sessionStore.votePhase === 'waiting') {
      startVoteSession()
    }
  }, 200)
})

function startVoteSession() {
  sessionStore.startedVoteIndices.add(voteIndex.value)
  sessionStore.activeVoteIndex = voteIndex.value
  sessionStore.votePhase = 'voting'
  startTimer()

  // Update session phase
  currentPhase.value = 'voting'
  phaseData.value = { vote: { index: voteIndex.value } }

  // Firestore: open vote and listen for ballots
  firestore.openVote(voteIndex.value, VOTE_DURATION)
  firestore.listenToBallots(voteIndex.value, (participantId, choice) => {
    sessionStore.recordVote(participantId, voteIndex.value, choice)
  })

  // Auto-simulate fake crew votes (fire-and-forget)
  const fakeCrewIds = getFakeCrewIds()
  if (fakeCrewIds.length > 0) {
    const maxDurationMs = Math.min(fakeCrewIds.length * 200, 20000)
    firestore.simulateFakeVotes(voteIndex.value, fakeCrewIds, maxDurationMs)
    console.log(`[VoteSlide] Auto-simulating ${fakeCrewIds.length} fake votes`)
  }

  console.log('[VoteSlide] Vote session started for vote', voteIndex.value)
}

async function stopVoteSession() {
  // Guard: prevent double-stop (timer + all-voted watcher can race)
  if (sessionStore.votePhase !== 'voting') return

  clearTimer()
  sessionStore.votePhase = 'ended'
  firestore.stopListeningToBallots()

  // Compute results
  const r = sessionStore.voteResults[voteIndex.value]
  const countA = r?.A.length ?? 0
  const countB = r?.B.length ?? 0
  const w: 'A' | 'B' = countB > countA ? 'B' : 'A'

  // Record winner immediately so WinnerDisplay works regardless of navigation method
  if (r) r.winner = w
  voteStore.vote(voteIndex.value, w)

  // Firestore: close vote with results (writes voteWinners + publishes 'vote-results')
  // Await to ensure voteWinners is persisted before resetting phase
  await firestore.closeVote(voteIndex.value, {
    winner: w,
    counts: { A: countA, B: countB },
    total: countA + countB,
  })

  // Reset vote state so navigation can proceed normally
  sessionStore.votePhase = 'waiting'
  sessionStore.activeVoteIndex = null
  currentPhase.value = 'idle'
  phaseData.value = {}
  publishSessionState()
}
</script>

<template>
  <div
    ref="slideEl"
    class="slide-bg relative"
    style="background-image: url('/backgrounds/metric-intro-br.webp');"
  >
    <VoteCrewScatter
      :vote-index="voteIndex"
      :avatar-size="35"
      :neutral-zone="{ top: 20, left: 31, right: 33, bottom: 32 }"
      :zone-a="{ top: 25, left: 3, right: 77, bottom: 30 }"
      :zone-b="{ top: 26, left: 75, right: 6, bottom: 35 }"
    />


    <div v-if="voteProps">
      <!-- Option blocks -->

      <!-- Option A -->
      <div
        class="absolute text-center right-[85%] left-[2%] top-[18.5%]  cursor-pointer hover:text-option-a"
        style="transform: rotate(-24deg)"
        @click="manualVote('A')"
      >
        <div class="font-bold text-sm font-title leading-4">{{ titleA }}</div>
      </div>

      <!-- Option B -->
      <div
        class="absolute right-[3%] top-[17%] text-center left-[82.5%]  cursor-pointer hover:text-option-b"
        @click="manualVote('B')"
        style="transform: rotate(25deg)"
      >
        <div class="font-bold text-sm font-title leading-4">{{ titleB }}</div>
      </div>

      <!-- Manual vote control (start/stop button, only in manual mode) -->
      <button
        v-if="sessionStore.manualMode && !isVoteDone"
        class="absolute top-[65%] left-1/2 -translate-x-1/2 px-6 py-1 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-all cursor-pointer text-lg"
        @click="isVoteActive ? stopVoteSession() : startVoteSession()"
      >
        {{ isVoteActive ? 'Arrêter' : 'Démarrer' }}
      </button>


      <div class="absolute text-7xl font-bold font-title -translate-x-1/2 left-[50.5%] top-[3.5%] text-center ">
        {{ timeRemaining }}
      </div>

      <!-- Participation counter -->
      <div
        class="absolute bottom-[29%] text-[#17443e] text-shadow-md left-1/2 -translate-x-1/2 text-3xl uppercase font-title opacity-80"
      >
        {{ totalVotes }}/{{ sessionStore.crew.length }} votes
      </div>

      <!-- Vote proportion bar -->
      <VoteProportionBar
        v-if="isVoteActive || isVoteDone"
        :vote-index="voteIndex"
        :label-a="titleA"
        :label-b="titleB"
      />

    </div>

    <img
      :src="floorA"
      class="absolute"
      :style="posA"
      alt=""
    />
    <img
      :src="floorB"
      class="absolute"
      :style="posB"
      alt=""
    />
  </div>
</template>
