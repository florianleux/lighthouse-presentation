<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import { registerVoteSlide, sessionStore, voteStore, getAbly, publishSessionState } from '../setup/main'
import { getVoteProps } from '../../../shared/metrics-data'
import { ABLY_CHANNELS, VOTE_CONFIG } from '../../../shared/constants'
import type { VoteStartedMessage, VoteEndedMessage } from '../../../shared/types'

const props = defineProps<{
  metricIndex: number
}>()

const voteProps = computed(() => getVoteProps(props.metricIndex))
const voteIndex = computed(() => voteProps.value.voteIndex)
const titleA = computed(() => voteProps.value.titleA)
const titleB = computed(() => voteProps.value.titleB)

const { currentSlideNo, next } = useNav()

onMounted(() => {
  registerVoteSlide(currentSlideNo.value, voteIndex.value)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  clearTimer()
  window.removeEventListener('keydown', handleKeydown)
})

// --- Vote logic (shared by manual + audience) ---

function applyVote(choice: 'A' | 'B') {
  // Persist the winner in voteResults so it survives refresh
  const r = sessionStore.voteResults[voteIndex.value]
  if (r) r.winner = choice
  voteStore.vote(voteIndex.value, choice)
  sessionStore.votePhase = 'waiting'
  sessionStore.activeVoteIndex = null
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

const results = computed(() => sessionStore.voteResults[voteIndex.value])

const isVoteEnded = computed(() =>
  sessionStore.votePhase === 'ended' && sessionStore.activeVoteIndex === voteIndex.value
)

const winner = computed<'A' | 'B'>(() => {
  const aCount = results.value.A.length
  const bCount = results.value.B.length
  return bCount > aCount ? 'B' : 'A'
})


// Timer
const VOTE_DURATION = VOTE_CONFIG.DURATION_SECONDS
const GRACE_PERIOD = VOTE_CONFIG.GRACE_PERIOD_SECONDS
const TIME_SYNC_INTERVAL = VOTE_CONFIG.TIME_SYNC_INTERVAL_SECONDS
const timeRemaining = ref(30)
const isInGracePeriod = ref(false)
let timerInterval: ReturnType<typeof setInterval> | null = null
let graceTimeout: ReturnType<typeof setTimeout> | null = null
let timeSyncInterval: ReturnType<typeof setInterval> | null = null

function startTimer() {
  clearTimer()
  timeRemaining.value = VOTE_DURATION
  isInGracePeriod.value = false
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
      if (timeSyncInterval) {
        clearInterval(timeSyncInterval)
        timeSyncInterval = null
      }
      isInGracePeriod.value = true
      console.log('[VoteSlide] Timer ended, grace period started')
      graceTimeout = setTimeout(() => {
        isInGracePeriod.value = false
        stopVoteSession()
      }, GRACE_PERIOD * 1000)
    }
  }, 1000)

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

async function publishTimeSync() {
  const ably = getAbly()
  if (ably && timeRemaining.value > 0) {
    const message: VoteStartedMessage = {
      type: 'vote-started',
      voteIndex: voteIndex.value,
      duration: timeRemaining.value,
      timestamp: Date.now()
    }
    await ably.publish(ABLY_CHANNELS.SESSION, message)
    console.log('[VoteSlide] Time sync published:', timeRemaining.value, 'seconds remaining')
  }
}

// Keyboard shortcut: V to start vote
function handleKeydown(e: KeyboardEvent) {
  if (e.key.toLowerCase() === 'v' && !isVoteActive.value && !isVoteEnded.value && !sessionStore.manualMode) {
    startVoteSession()
  }
}

async function startVoteSession() {
  sessionStore.activeVoteIndex = voteIndex.value
  sessionStore.votePhase = 'voting'
  sessionStore.voteStartTimestamp = Date.now()
  startTimer()

  const ably = getAbly()
  if (ably) {
    const message: VoteStartedMessage = {
      type: 'vote-started',
      voteIndex: voteIndex.value,
      duration: VOTE_DURATION,
      timestamp: Date.now()
    }
    await ably.publish(ABLY_CHANNELS.SESSION, message)
    console.log('[VoteSlide] Vote session started for vote', voteIndex.value)
  }

  // Publish enriched session state so vote apps get voteContext
  publishSessionState(currentSlideNo.value)
}

async function stopVoteSession() {
  clearTimer()
  sessionStore.votePhase = 'ended'

  // Capture slide number BEFORE the async publish — the presenter might click
  // "Continue" during the await, which changes currentSlideNo via next()
  const slideNo = currentSlideNo.value

  // Publish VoteEndedMessage so vote apps show "Vote closed!" with results
  const ably = getAbly()
  if (ably) {
    const r = sessionStore.voteResults[voteIndex.value]
    const aLen = r?.A.length ?? 0
    const bLen = r?.B.length ?? 0
    const message: VoteEndedMessage = {
      type: 'vote-ended',
      voteIndex: voteIndex.value,
      winner: bLen > aLen ? 'B' : 'A',
      results: { A: aLen, B: bLen },
      timestamp: Date.now(),
    }
    await ably.publish(ABLY_CHANNELS.SESSION, message)
    console.log('[VoteSlide] Vote ended published for vote', voteIndex.value)
  }

  // Publish enriched session state with voteContext.votePhase = 'ended'
  publishSessionState(slideNo)
}

function continueWithWinner() {
  applyVote(winner.value)
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
