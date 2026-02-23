<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import { sessionStore, voteStore, currentPhase, phaseData, currentVoteIndex, firestore, publishSessionState } from '../setup/main'
import { getVoteProps } from '../../../shared/metrics-data'
import { VOTE_CONFIG } from '../../../shared/constants'

const props = defineProps<{
  metricIndex: number
}>()

const voteProps = computed(() => getVoteProps(props.metricIndex))
const voteIndex = computed(() => voteProps.value.voteIndex)
const titleA = computed(() => voteProps.value.titleA)
const titleB = computed(() => voteProps.value.titleB)

const { next } = useNav()

onMounted(() => {
  currentVoteIndex.value = voteIndex.value
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  clearTimer()
  currentVoteIndex.value = null
  window.removeEventListener('keydown', handleKeydown)
})

// --- Vote logic (shared by manual + audience) ---

function applyVote(choice: 'A' | 'B') {
  const r = sessionStore.voteResults[voteIndex.value]
  if (r) r.winner = choice
  voteStore.vote(voteIndex.value, choice)
  sessionStore.votePhase = 'waiting'
  sessionStore.activeVoteIndex = null
  firestore.stopListeningToBallots()
  currentPhase.value = 'idle'
  phaseData.value = {}
  publishSessionState()
  next()
}

// Manual mode: vote directly from option blocks
function manualVote(choice: 'A' | 'B') {
  if (!sessionStore.manualMode) return
  applyVote(choice)
}

// --- Audience vote session ---

const isVoteActive = computed(() =>
  sessionStore.votePhase === 'voting' && sessionStore.activeVoteIndex === voteIndex.value
)

const isVoteEnded = computed(() =>
  sessionStore.votePhase === 'ended' && sessionStore.activeVoteIndex === voteIndex.value
)

// Timer (internal to presentation only - no sync to vote apps)
const VOTE_DURATION = VOTE_CONFIG.DURATION_SECONDS
const GRACE_PERIOD = VOTE_CONFIG.GRACE_PERIOD_SECONDS
const timeRemaining = ref(VOTE_DURATION)
const isInGracePeriod = ref(false)
let timerInterval: ReturnType<typeof setInterval> | null = null
let graceTimeout: ReturnType<typeof setTimeout> | null = null

function startTimer() {
  clearTimer()
  timeRemaining.value = VOTE_DURATION
  isInGracePeriod.value = false
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
      isInGracePeriod.value = true
      console.log('[VoteSlide] Timer ended, grace period started')
      graceTimeout = setTimeout(() => {
        isInGracePeriod.value = false
        stopVoteSession()
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

// Keyboard shortcut: V to start vote
function handleKeydown(e: KeyboardEvent) {
  if (e.key.toLowerCase() === 'v' && !isVoteActive.value && !isVoteEnded.value && !sessionStore.manualMode) {
    startVoteSession()
  }
}

function startVoteSession() {
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

  console.log('[VoteSlide] Vote session started for vote', voteIndex.value)
}

function stopVoteSession() {
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

  // Update session phase
  currentPhase.value = 'vote-results'
  phaseData.value = {
    voteResult: { index: voteIndex.value, winner: w, countA, countB }
  }

  // Firestore: close vote with results
  firestore.closeVote(voteIndex.value, {
    winner: w,
    counts: { A: countA, B: countB },
    total: countA + countB,
  })
}

function continueWithWinner() {
  // Winner already recorded in stopVoteSession, just navigate
  sessionStore.votePhase = 'waiting'
  sessionStore.activeVoteIndex = null
  currentPhase.value = 'idle'
  phaseData.value = {}
  publishSessionState()
  next()
}
</script>

<template>
  <div
    class="slide-bg relative"
    style="background-image: url('/backgrounds/metric-intro-br.webp');"
  >
    <div v-if="voteProps">
      <!-- Option blocks -->

      <!-- Option A -->
      <div
        class="absolute text-center right-[85%] left-[2%] top-[18.5%]"
        :class="sessionStore.manualMode && 'cursor-pointer hover:text-option-a '"
        style="transform: rotate(-24deg)"
        @click="manualVote('A')"
      >
        <div class="font-bold text-sm font-title">{{ titleA }}</div>
      </div>

      <!-- Option B -->
      <div
        class="absolute right-[3%] top-[17%] text-center left-[82.5%]"
        :class="sessionStore.manualMode && 'cursor-pointer hover:text-option-b'"
        @click="manualVote('B')"
        style="transform: rotate(25deg)"
      >
        <div class="font-bold text-sm font-title">{{ titleB }}</div>
      </div>

      <!-- Audience vote control -->
      <button
        v-if="!sessionStore.manualMode"
        class="absolute top-[65%] left-1/2 -translate-x-1/2 px-6 py-1 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-all cursor-pointer text-lg"
        @click="isVoteEnded ? continueWithWinner() : isVoteActive ? stopVoteSession() : startVoteSession()"
      >
        {{ isVoteEnded ? 'Continue' : isVoteActive ? 'Stop' : 'Start' }}
      </button>


      <div class="absolute text-7xl font-bold font-title -translate-x-1/2 left-[50.5%] top-[3.5%] text-center ">
        {{ timeRemaining }}
      </div>

      <!-- Vote proportion bar -->
      <VoteProportionBar
        v-if="isVoteActive || isVoteEnded"
        :vote-index="voteIndex"
        :label-a="titleA"
        :label-b="titleB"
      />

    </div>
  </div>
</template>
