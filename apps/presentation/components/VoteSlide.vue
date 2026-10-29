<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import { sessionStore, voteStore, currentPhase, phaseData, firestore, publishSessionState, getFakeCrewIds } from '../setup/main'
import { VOTE_CONFIG } from '../../../shared/constants'
import { useResolvedMetric } from '../composables/useResolvedMetric'
import { useGraceClose } from '../composables/useGraceClose'
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
const NAV_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'Enter', 'PageUp', 'PageDown']
// Touches « suivant » (clavier et télécommande, qui envoie souvent PageDown)
const FORWARD_KEYS = ['ArrowRight', 'ArrowDown', 'Space', 'PageDown']

// Vrai entre la clôture et le passage à WinnerDisplay (applyVote attend Firestore)
const isApplyingVote = ref(false)

function blockNavigation(e: KeyboardEvent) {
  // Saisie main levée : laisser l'input recevoir ses touches (Entrée comprise)
  if (e.target instanceof HTMLInputElement) return
  const isNavKey = NAV_KEYS.includes(e.code) || NAV_KEYS.includes(e.key)
  const isForwardKey = FORWARD_KEYS.includes(e.code) || FORWARD_KEYS.includes(e.key)

  // Clôture en cours : un 2e appui ferait sauter WinnerDisplay (applyVote appelle next())
  if (isApplyingVote.value) {
    if (isNavKey) {
      e.preventDefault()
      e.stopPropagation()
    }
    return
  }

  // Main levée : « suivant » clôture le vote avec les chiffres saisis.
  // Avant toute saisie, il est bloqué pour ne pas passer le vote sans gagnant.
  if (sessionStore.handRaiseMode && isForwardKey && !isVoteDone.value && isSlideVisible()) {
    e.preventDefault()
    e.stopPropagation()
    if (isVoteActive.value) closeHandRaise()
    return
  }

  if (!isVoteActive.value) return
  if (isNavKey) {
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

  isApplyingVote.value = true
  try {
    // Persist winner to Firebase for derived option resolution (even in manual mode)
    await firestore.persistVoteWinner(voteIndex.value, choice)

    currentPhase.value = 'idle'
    phaseData.value = {}
    publishSessionState()
    next()
  } finally {
    isApplyingVote.value = false
  }
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

// Main levée : clôture avec la majorité saisie. Égalité (0-0 compris) : rien, on tranche au clic A/B.
function closeHandRaise() {
  if (!isVoteActive.value) return
  const r = sessionStore.voteResults[voteIndex.value]
  const countA = r?.A.length ?? 0
  const countB = r?.B.length ?? 0
  if (countA === countB) return
  const winner: 'A' | 'B' = countA > countB ? 'A' : 'B'
  sessionStore.votePhase = 'ended'
  firestore.closeVote(voteIndex.value, {
    winner,
    counts: { A: countA, B: countB },
    total: countA + countB,
  })
  applyVote(winner)
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
const { isClosing, waitForStragglers } = useGraceClose(VOTE_CONFIG.GRACE_PERIOD_SECONDS)
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

// Nouvelle session : le minuteur repart de la durée pleine au lieu d'afficher l'ancienne valeur.
watch(() => sessionStore.sessionId, () => {
  clearTimer()
  timeRemaining.value = VOTE_DURATION
})

// Auto-stop when all crew members have voted
const totalVotes = computed(() => {
  const r = sessionStore.voteResults[voteIndex.value]
  return (r?.A.length ?? 0) + (r?.B.length ?? 0)
})

watch(totalVotes, (total) => {
  if (sessionStore.handRaiseMode) return
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
  if (sessionStore.handRaiseMode || isVoteDone.value || isVoteActive.value || hasBeenStarted.value) return
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

  // Update session phase
  currentPhase.value = 'voting'
  phaseData.value = { vote: { index: voteIndex.value } }

  // Firestore: open vote and listen for ballots
  firestore.openVote(voteIndex.value, VOTE_DURATION)

  // Main levée : pas de minuteur, pas de bulletins, les bots restent au milieu
  if (sessionStore.handRaiseMode) {
    console.log('[VoteSlide] Hand-raise vote session started for vote', voteIndex.value)
    return
  }

  startTimer()
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
  if (!isVoteActive.value || isClosing.value) return

  clearTimer()

  // Tout l'équipage a voté : aucun bulletin à attendre.
  if (totalVotes.value < sessionStore.crew.length) {
    await waitForStragglers()
    // Vote forcé à la main ou session réinitialisée pendant le dépouillement
    // (un autre vote a même pu démarrer depuis).
    if (!isVoteActive.value) return
  }

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
  const sessionId = sessionStore.sessionId
  await firestore.closeVote(voteIndex.value, {
    winner: w,
    counts: { A: countA, B: countB },
    total: countA + countB,
  })
  // Session réinitialisée pendant l'écriture : la nouvelle reste en lobby.
  if (sessionStore.sessionId !== sessionId) return

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


      <div class="absolute text-7xl font-bold font-title -translate-x-1/2 left-[50.5%] top-[3.5%] text-center ">
        <!-- Main levée : pas de minuteur, un tiret pour ne pas laisser le cadran vide -->
        <template v-if="sessionStore.handRaiseMode">-</template>
        <span
          v-else-if="isClosing"
          class="text-3xl"
        >Dépouillement...</span>
        <template v-else>{{ timeRemaining }}</template>
      </div>

      <!-- Participation counter -->
      <div
        class="absolute bottom-[29%] text-[#17443e] text-shadow-md left-1/2 -translate-x-1/2 text-3xl uppercase font-title opacity-80"
      >
        {{ totalVotes }}/{{ sessionStore.crew.length }} votes
      </div>

      <!-- Vote proportion bar -->
      <VoteProportionBar
        v-if="isVoteActive || isVoteDone || sessionStore.handRaiseMode"
        :vote-index="voteIndex"
        :label-a="titleA"
        :label-b="titleB"
        :editable="sessionStore.handRaiseMode && !isVoteDone"
        @hand-raise-input="!isVoteActive && startVoteSession()"
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
