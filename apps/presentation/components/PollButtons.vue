<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch, onMounted, onUnmounted, inject } from 'vue'
import { useNav } from '@slidev/client'
import { sessionStore, currentPhase, phaseData, firestore, getFakeCrewIds } from '../setup/main'
import { POLL_CONFIG } from '../../../shared/constants'
import type { PollChoice } from '../../../shared/types'
import { useGraceClose } from '../composables/useGraceClose'

const props = defineProps<{
  pollId: string
}>()

const { currentSlideNo } = useNav()
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)
const lastHandledClick = ref(0)

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
const { isClosing, waitForStragglers } = useGraceClose(POLL_CONFIG.GRACE_PERIOD_SECONDS)
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
  if (sessionStore.handRaiseMode) return
  if (isPollActive.value && sessionStore.crew.length > 0 && total >= sessionStore.crew.length) {
    console.log('[PollButtons] All crew voted, auto-stopping poll')
    stopPollSession()
  }
})

// Slidev clicker control: click 1 => Start
watch(clicks, (currentClick) => {
  if (currentClick < lastHandledClick.value) {
    lastHandledClick.value = currentClick
    return
  }

  if (currentClick === lastHandledClick.value)
    return

  lastHandledClick.value = currentClick

  if (currentClick === 1 && !isPollActive.value && sessionStore.pollPhase !== 'ended') {
    startPollSession()
    return
  }
})

// Keyboard shortcut: V to start poll
function handleKeydown(e: KeyboardEvent) {
  if (e.target instanceof HTMLInputElement) return
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

// Auto-start poll when arriving on this slide
// All PollButtons instances are mounted by Slidev, so check DOM visibility to only start the right one
const slideEl = ref<HTMLElement | null>(null)

function isSlideVisible(): boolean {
  if (!slideEl.value) return false
  // PollButtons' root div has no intrinsic dimensions (all children are absolute),
  // so check the parent slide container which has proper dimensions via slide-bg class
  const el = slideEl.value.parentElement ?? slideEl.value
  const rect = el.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
}

// A poll can only be started once per session — prevents re-triggering on back/forward navigation
const hasBeenStarted = computed(() => sessionStore.startedPollIds.has(props.pollId))
watch(currentSlideNo, () => {
  // Main levée : en quittant la slide, le poll se clôture avec les chiffres saisis
  if (sessionStore.handRaiseMode && isPollActive.value) {
    setTimeout(() => {
      if (!isSlideVisible() && isPollActive.value) stopPollSession()
    }, 200)
    return
  }
  if (sessionStore.isManual || isPollActive.value || sessionStore.pollPhase === 'ended' || hasBeenStarted.value) return
  if (currentPhase.value === 'lobby') return
  setTimeout(() => {
    if (isSlideVisible() && !hasBeenStarted.value && currentPhase.value !== 'lobby' && sessionStore.activePollId === null && sessionStore.pollPhase === 'waiting') {
      startPollSession()
    }
  }, 200)
})

function startPollSession() {
  sessionStore.startedPollIds.add(props.pollId)
  sessionStore.activePollId = props.pollId
  sessionStore.pollPhase = 'polling'

  // Update session phase
  currentPhase.value = 'polling'
  phaseData.value = { poll: { id: props.pollId } }

  // Firestore: open poll and listen for responses
  firestore.openPoll(props.pollId, POLL_DURATION)

  // Main levée : pas de minuteur, pas de réponses, le présentateur saisit les comptes
  if (sessionStore.handRaiseMode) {
    console.log('[PollButtons] Hand-raise poll session started for', props.pollId)
    return
  }

  startTimer()
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

async function stopPollSession() {
  // Guard: prevent double-stop (timer + all-voted watcher can race)
  if (!isPollActive.value || isClosing.value) return

  clearTimer()

  // Délai de grâce, comme pour les votes (VoteSlide), sauf si tout le monde a répondu.
  if (!sessionStore.handRaiseMode && totalPollVotes.value < sessionStore.crew.length) {
    await waitForStragglers()
    // Session réinitialisée pendant le dépouillement.
    if (!isPollActive.value) return
  }

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

// --- Saisie main levée ---
const validated = reactive<Record<PollChoice, boolean>>({ newbie: false, captain: false, admiral: false })
const inputValues = reactive<Record<PollChoice, string | number>>({ newbie: '', captain: '', admiral: '' })
const inputEls: Partial<Record<PollChoice, HTMLInputElement | null>> = {}

watch(() => sessionStore.sessionId, () => {
  validated.newbie = validated.captain = validated.admiral = false
  inputValues.newbie = inputValues.captain = inputValues.admiral = ''
})

// Main levée : saisie directe, sans « Démarrer » (le poll s'ouvre à la première saisie)
const canEdit = computed(() =>
  sessionStore.handRaiseMode && sessionStore.pollPhase !== 'ended'
  && (isPollActive.value || sessionStore.activePollId === null)
)

function showInput(choice: PollChoice) {
  return canEdit.value && !validated[choice]
}

function submit(choice: PollChoice, e: KeyboardEvent) {
  if (!isPollActive.value) startPollSession()
  sessionStore.assignHandRaisePoll(props.pollId, choice, Number(inputValues[choice]))
  validated[choice] = true
  // Rendre le focus à la slide : Slidev ignore ses raccourcis tant qu'un input a le focus
  ;(e.target as HTMLInputElement).blur()
}

async function edit(choice: PollChoice) {
  if (!canEdit.value) return
  inputValues[choice] = results.value[choice].length
  validated[choice] = false
  await nextTick()
  inputEls[choice]?.focus()
  inputEls[choice]?.select()
}

const counters: { choice: PollChoice; style: string }[] = [
  { choice: 'newbie', style: 'top: 88%; left: 21%' },
  { choice: 'captain', style: 'top: 88%; left: 54%' },
  { choice: 'admiral', style: 'top: 87.6%; left: 86.4%' },
]
</script>

<template>
  <div ref="slideEl">
    <!-- Create a Slidev click step for clicker-only control -->
    <span v-click="1" class="hidden" />

    <div
      v-for="{ choice, style } in counters"
      :key="choice"
      class="absolute p-1 px-2 text-center -translate-x-1/2"
      :style="style"
    >
      <input
        v-if="showInput(choice)"
        :ref="(el) => { inputEls[choice] = el as HTMLInputElement | null }"
        v-model="inputValues[choice]"
        type="number"
        min="0"
        :max="sessionStore.crew.length"
        class="hand-raise-input text-4xl font-bold font-title"
        @keydown.enter.prevent="submit(choice, $event)"
      />
      <div
        v-else
        class="text-4xl font-bold font-title"
        :class="{ 'cursor-pointer': canEdit }"
        @click="edit(choice)"
      >{{ results[choice].length }}</div>
    </div>

    <div
      v-if="isPollActive && (isClosing || timeRemaining > 0)"
      class="absolute top-[82%] left-[7.5%] -translate-x-1/2 text-3xl font-bold font-title text-white"
    >
      <span
        v-if="isClosing"
        class="text-base"
      >Dépouillement...</span>
      <template v-else>{{ timeRemaining }}</template>
    </div>

    <!-- Participation counter -->
    <div
      v-if="isPollActive"
      class="absolute -bottom-[3%] -right-[3%] -translate-1/2 text-xl font-bold font-title text-center text-white"
    >
      {{ totalPollVotes }}/{{ sessionStore.crew.length }}<br>réponses
    </div>

    <button
      v-if="!sessionStore.handRaiseMode && sessionStore.pollPhase !== 'ended' && (sessionStore.manualMode || isPollActive)"
      class="absolute top-[89%] px-6 py-1 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-all cursor-pointer text-lg"
      @click="isPollActive ? stopPollSession() : startPollSession()"
    >
      {{ isPollActive ? 'Arrêter' : 'Démarrer' }}
    </button>
  </div>
</template>

<style scoped>
.hand-raise-input {
  width: 1.8em;
  border: none;
  background: transparent;
  color: inherit;
  text-align: center;
  outline: none;
  -moz-appearance: textfield;
}

.hand-raise-input::-webkit-outer-spin-button,
.hand-raise-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
