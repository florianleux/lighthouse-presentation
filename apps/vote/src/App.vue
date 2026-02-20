<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useAbly } from './composables/useAbly'
import { STORAGE_KEYS } from '../../../shared/constants'
import type { PollChoice, VoteStartedMessage, SessionStateMessage } from '../../../shared/types'
import AvatarCreator from './components/AvatarCreator.vue'
import AvatarPreview from './components/AvatarPreview.vue'

interface SavedMember {
  name: string
  participantId: string
  keynoteId: string
  avatar: string | null
}

interface PersistedVoteState {
  activeVoteIndex: number | null
  selectedChoice: 'A' | 'B' | null
  hasVoted: boolean
  voteMissed: boolean
  countdownEndTimestamp: number | null
  keynoteId: string | null
  voteEndedData?: { winner: 'A' | 'B'; resultsA: number; resultsB: number } | null
}

const {
  isConnected,
  error,
  connect,
  joinCrew,
  getParticipantId,
  restoreSession,
  onSessionState,
  onVoteStarted,
  onVoteEnded,
  onPollStarted,
  onPollEnded,
  sendVote,
  sendPoll,
  setOnReconnect,
  enterPresence,
  fetchSessionHistory,
} = useAbly()

// Form state
const name = ref('')
const status = ref<'connecting' | 'waiting' | 'idle' | 'joining' | 'joined' | 'error'>('connecting')
const currentStep = ref<'name' | 'avatar'>('name')
const joinedName = ref('')
const activeKeynoteId = ref<string | null>(null)

// Avatar state (JSON string)
const selectedAvatar = ref<string | null>(null)

// Voting state
const activeVoteIndex = ref<number | null>(null)
const selectedChoice = ref<'A' | 'B' | null>(null)
const hasVoted = ref(false)
const voteMissed = ref(false)
const voteError = ref<string | null>(null)
const isSubmitting = ref(false)
// Track completed vote indices to prevent re-triggering from stale messages
const completedVotes = new Set<number>()

// Poll state
const activePollId = ref<string | null>(null)
const hasPollVoted = ref(false)

// Slide type & enriched state from session-state messages
const currentSlideType = ref<'vote' | 'poll' | 'other'>('other')
const voteEndedData = ref<{ winner: 'A' | 'B'; resultsA: number; resultsB: number } | null>(null)
const pollPhase = ref<'pending' | 'polling' | 'submitted' | 'ended' | null>(null)

// Computed percentages for vote-ended screen
const percentageA = computed(() => {
  if (!voteEndedData.value) return 50
  const total = voteEndedData.value.resultsA + voteEndedData.value.resultsB
  if (total === 0) return 50
  return Math.round((voteEndedData.value.resultsA / total) * 100)
})
const percentageB = computed(() => 100 - percentageA.value)

// Timer state
const timeRemaining = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

// Ably subscription cleanup functions
const unsubscribes: (() => void)[] = []

// Watch for vote state changes and persist to localStorage
watch(
  [activeVoteIndex, selectedChoice, hasVoted, voteMissed, voteEndedData],
  () => {
    if (status.value === 'joined' && activeVoteIndex.value !== null) {
      saveVoteState()
      // Track completed votes to prevent stale messages from re-triggering
      if (hasVoted.value || voteMissed.value) {
        completedVotes.add(activeVoteIndex.value)
      }
    }
  }
)

function startCountdown(duration: number) {
  timeRemaining.value = duration

  if (timerInterval) clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
      // Auto-submit if a choice is selected, otherwise mark as missed
      // IMPORTANT: Check isSubmitting to prevent double-submit if network is slow
      if (selectedChoice.value && !hasVoted.value && !isSubmitting.value) {
        submitVote()
      } else if (!hasVoted.value && !isSubmitting.value) {
        voteMissed.value = true
      }
    }
  }, 1000)
}

function clearCountdown() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  timeRemaining.value = 0
}

// Validation
const isValid = computed(() => {
  const trimmed = name.value.trim()
  return trimmed.length >= 2 && trimmed.length <= 20
})

const validationMessage = computed(() => {
  const trimmed = name.value.trim()
  if (trimmed.length === 0) return ''
  if (trimmed.length < 2) return 'Minimum 2 characters'
  if (trimmed.length > 20) return 'Maximum 20 characters'
  return ''
})

// Can go to next step if name is valid
const canGoNext = computed(() => isValid.value && activeKeynoteId.value !== null)

// Load saved crew member from localStorage
function loadSavedMember(): SavedMember | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CREW_MEMBER)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('[App] Failed to load saved member:', e)
  }
  return null
}

// Save crew member to localStorage
function saveMember(memberName: string, participantId: string, keynoteId: string, avatar: string | null) {
  try {
    localStorage.setItem(STORAGE_KEYS.CREW_MEMBER, JSON.stringify({
      name: memberName,
      participantId,
      keynoteId,
      avatar
    }))
  } catch (e) {
    console.error('[App] Failed to save member:', e)
  }
}

// Clear saved member from localStorage
function clearSavedMember() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CREW_MEMBER)
  } catch (e) {
    console.error('[App] Failed to clear saved member:', e)
  }
}

// ===========================================
// Vote state persistence
// ===========================================

function saveVoteState() {
  try {
    const state: PersistedVoteState = {
      activeVoteIndex: activeVoteIndex.value,
      selectedChoice: selectedChoice.value,
      hasVoted: hasVoted.value,
      voteMissed: voteMissed.value,
      countdownEndTimestamp: timeRemaining.value > 0
        ? Date.now() + (timeRemaining.value * 1000)
        : null,
      keynoteId: activeKeynoteId.value,
      voteEndedData: voteEndedData.value,
    }
    localStorage.setItem(STORAGE_KEYS.VOTE_STATE, JSON.stringify(state))
  } catch (e) {
    console.error('[App] Failed to save vote state:', e)
  }
}

function loadVoteState(): PersistedVoteState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.VOTE_STATE)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('[App] Failed to load vote state:', e)
  }
  return null
}

function clearVoteState() {
  try {
    localStorage.removeItem(STORAGE_KEYS.VOTE_STATE)
  } catch (e) {
    console.error('[App] Failed to clear vote state:', e)
  }
}

// Restore vote state from localStorage
function restoreVoteState() {
  const saved = loadVoteState()
  if (!saved) return false

  // Only restore if it's for the same keynote
  if (saved.keynoteId !== activeKeynoteId.value) {
    console.log('[App] Vote state keynote mismatch, clearing')
    clearVoteState()
    return false
  }

  // Restore voteEndedData if present
  if (saved.voteEndedData) {
    voteEndedData.value = saved.voteEndedData
  }

  // Don't restore if already voted or missed
  if (saved.hasVoted || saved.voteMissed) {
    activeVoteIndex.value = saved.activeVoteIndex
    selectedChoice.value = saved.selectedChoice
    hasVoted.value = saved.hasVoted
    voteMissed.value = saved.voteMissed
    console.log('[App] Restored final vote state:', saved)
    return true
  }

  // Restore vote state
  activeVoteIndex.value = saved.activeVoteIndex
  selectedChoice.value = saved.selectedChoice
  hasVoted.value = saved.hasVoted
  voteMissed.value = saved.voteMissed

  // Restore countdown if still active
  if (saved.countdownEndTimestamp && saved.activeVoteIndex !== null) {
    const remainingMs = saved.countdownEndTimestamp - Date.now()
    if (remainingMs > 0) {
      startCountdown(Math.ceil(remainingMs / 1000))
      console.log('[App] Restored countdown with', Math.ceil(remainingMs / 1000), 'seconds')
    } else {
      // Time expired while away
      // Check isSubmitting to prevent double-submit
      if (saved.selectedChoice && !saved.hasVoted && !isSubmitting.value) {
        // Auto-submit the selected choice
        console.log('[App] Time expired, auto-submitting:', saved.selectedChoice)
        submitVote()
      } else if (!isSubmitting.value) {
        voteMissed.value = true
        console.log('[App] Time expired, vote missed')
      }
    }
  }

  console.log('[App] Restored vote state:', saved)
  return true
}

// ===========================================
// Page visibility handling
// ===========================================

const hiddenTimestamp = ref<number | null>(null)
const pausedTimeRemaining = ref(0)

function handleVisibilityChange() {
  if (document.hidden) {
    // Page is now hidden - note timestamp and paused time
    hiddenTimestamp.value = Date.now()
    pausedTimeRemaining.value = timeRemaining.value
    console.log('[App] Page hidden, paused at', pausedTimeRemaining.value, 'seconds')
  } else {
    // Page is now visible
    console.log('[App] Page visible again')

    if (hiddenTimestamp.value && pausedTimeRemaining.value > 0 && activeVoteIndex.value !== null && !hasVoted.value && !voteMissed.value) {
      // Calculate elapsed time while hidden
      const elapsedMs = Date.now() - hiddenTimestamp.value
      const elapsedSeconds = Math.floor(elapsedMs / 1000)
      const newRemaining = pausedTimeRemaining.value - elapsedSeconds

      if (newRemaining > 0) {
        // Resume countdown with adjusted time
        clearCountdown()
        startCountdown(newRemaining)
        console.log('[App] Resumed countdown with', newRemaining, 'seconds')
      } else {
        // Time expired while hidden
        clearCountdown()
        // Check isSubmitting to prevent double-submit
        if (selectedChoice.value && !isSubmitting.value) {
          // Auto-submit selected choice
          submitVote()
          console.log('[App] Time expired while hidden, auto-submitting')
        } else if (!isSubmitting.value) {
          voteMissed.value = true
          console.log('[App] Time expired while hidden, vote missed')
        }
      }
    }

    // Request state sync on visibility restore (debounced to avoid rapid-fire)
    debouncedRequestStateSync()

    hiddenTimestamp.value = null
    pausedTimeRemaining.value = 0
  }
}

// ===========================================
// State sync on reconnection
// ===========================================

let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null

function debouncedRequestStateSync() {
  if (syncDebounceTimer) clearTimeout(syncDebounceTimer)
  // Jittered delay (500ms - 2500ms) to spread thundering herd of 100+ reconnections
  const jitter = 500 + Math.floor(Math.random() * 2000)
  syncDebounceTimer = setTimeout(() => {
    syncDebounceTimer = null
    requestStateSync()
  }, jitter)
}

async function requestStateSync() {
  console.log('[App] Requesting state sync...')

  if (!isConnected.value) {
    console.warn('[App] Cannot sync - not connected')
    return
  }

  // If we have a saved member and are still 'connecting', restore joined status
  const savedMember = loadSavedMember()
  if (savedMember && status.value === 'connecting') {
    console.log('[App] Restoring joined status for', savedMember.name)
    status.value = 'joined'
    joinedName.value = savedMember.name
    selectedAvatar.value = savedMember.avatar
    activeKeynoteId.value = savedMember.keynoteId
  }

  // Restore from localStorage first
  const restoredFromStorage = restoreVoteState()

  // Fetch recent history to catch any missed messages
  const { sessionState, voteStarted, voteEnded, pollStarted, pollEnded } = await fetchSessionHistory()

  if (sessionState) {
    // Update keynoteId if different
    if (sessionState.keynoteId && sessionState.keynoteId !== activeKeynoteId.value) {
      console.log('[App] Keynote changed during disconnect')
      activeKeynoteId.value = sessionState.keynoteId
      // Clear vote state if keynote changed
      clearVoteState()
      activeVoteIndex.value = null
      selectedChoice.value = null
      hasVoted.value = false
      voteMissed.value = false
      voteEndedData.value = null
    }

    // Apply enriched session state context
    if (sessionState.slideType) {
      currentSlideType.value = sessionState.slideType
    }
    if (sessionState.voteContext) {
      activeVoteIndex.value = sessionState.voteContext.voteIndex
      if (sessionState.voteContext.votePhase === 'ended' && sessionState.voteContext.winner) {
        voteEndedData.value = {
          winner: sessionState.voteContext.winner,
          resultsA: sessionState.voteContext.resultsA ?? 0,
          resultsB: sessionState.voteContext.resultsB ?? 0,
        }
        clearCountdown()
      }
    }
    if (sessionState.pollContext) {
      activePollId.value = sessionState.pollContext.pollId
      if (sessionState.pollContext.pollPhase === 'ended') {
        pollPhase.value = 'ended'
        clearCountdown()
      }
    }
  }

  // Apply voteEnded from history (takes priority over session state for results)
  if (voteEnded && !restoredFromStorage) {
    voteEndedData.value = {
      winner: voteEnded.winner,
      resultsA: voteEnded.results.A,
      resultsB: voteEnded.results.B,
    }
    activeVoteIndex.value = voteEnded.voteIndex
    clearCountdown()
  }

  // Apply pollEnded from history
  if (pollEnded) {
    activePollId.value = pollEnded.pollId
    pollPhase.value = 'ended'
    clearCountdown()
  }

  // Re-announce to the presentation AFTER validating keynoteId from session history
  const currentKeynoteId = activeKeynoteId.value
  if (savedMember && currentKeynoteId) {
    try {
      await joinCrew(savedMember.name, currentKeynoteId, savedMember.avatar)
      console.log('[App] Re-announced crew member to presentation')
    } catch (err) {
      console.error('[App] Failed to re-announce:', err)
    }
  }

  if (voteStarted && !restoredFromStorage && !voteEnded) {
    // A vote might be in progress that we missed (only if not already ended)
    handleVoteStartedSync(voteStarted)
  }

  // Apply pollStarted from history (only if not already ended)
  if (pollStarted && !pollEnded && !hasPollVoted.value) {
    activePollId.value = pollStarted.pollId
    pollPhase.value = 'polling'
    const elapsedMs = Date.now() - pollStarted.timestamp
    const elapsedSeconds = Math.floor(elapsedMs / 1000)
    const remainingDuration = Math.max(0, pollStarted.duration - elapsedSeconds)
    if (remainingDuration > 0) {
      startCountdown(remainingDuration)
    }
  }
}

function handleVoteStartedSync(msg: VoteStartedMessage) {
  // Ignore stale messages for votes we already completed
  if (completedVotes.has(msg.voteIndex)) {
    console.log('[App] Vote', msg.voteIndex, 'already completed, ignoring sync')
    return
  }

  // Calculate remaining time based on timestamp
  const elapsedMs = Date.now() - msg.timestamp
  const elapsedSeconds = Math.floor(elapsedMs / 1000)
  const remainingDuration = msg.duration - elapsedSeconds

  // Don't sync if we already have this vote or already voted
  if (activeVoteIndex.value === msg.voteIndex && (hasVoted.value || voteMissed.value)) {
    console.log('[App] Already processed vote', msg.voteIndex)
    return
  }

  if (remainingDuration > 0 && !hasVoted.value) {
    console.log('[App] Syncing with active vote, remaining:', remainingDuration)
    activeVoteIndex.value = msg.voteIndex
    selectedChoice.value = null
    hasVoted.value = false
    voteMissed.value = false
    voteError.value = null
    isSubmitting.value = false
    startCountdown(remainingDuration)
  } else if (!hasVoted.value && activeVoteIndex.value !== msg.voteIndex) {
    console.log('[App] Vote expired during disconnect')
    activeVoteIndex.value = msg.voteIndex
    voteMissed.value = true
  }
}

// ===========================================
// Initial session-state processing (shared between live handler and history bootstrap)
// ===========================================

function processInitialSessionState(msg: SessionStateMessage, savedMember: SavedMember): void {
  const newKeynoteId = msg.keynoteId
  activeKeynoteId.value = newKeynoteId

  if (newKeynoteId && savedMember.keynoteId === newKeynoteId) {
    // Same keynote - restore session
    status.value = 'joined'
    console.log('[App] Same keynote, restoring session')

    // Restore vote state from localStorage
    restoreVoteState()

    // Apply slide context from this session-state message
    currentSlideType.value = msg.slideType ?? 'other'
    if (msg.voteContext) {
      activeVoteIndex.value = msg.voteContext.voteIndex
      if (msg.voteContext.votePhase === 'ended' && msg.voteContext.winner) {
        voteEndedData.value = {
          winner: msg.voteContext.winner,
          resultsA: msg.voteContext.resultsA ?? 0,
          resultsB: msg.voteContext.resultsB ?? 0,
        }
      }
    }
    if (msg.pollContext) {
      activePollId.value = msg.pollContext.pollId
      if (msg.pollContext.pollPhase === 'ended') {
        pollPhase.value = 'ended'
      }
    }

    // If we restored vote state but slideType is unknown, infer it
    if (currentSlideType.value === 'other' && activeVoteIndex.value !== null) {
      currentSlideType.value = 'vote'
    }

    // Re-announce to presentation so it re-registers us in the crew
    joinCrew(savedMember.name, newKeynoteId, savedMember.avatar)
      .then(() => console.log('[App] Re-announced on initial restore'))
      .catch((err) => console.error('[App] Failed to re-announce on restore:', err))
  } else if (newKeynoteId) {
    // Different keynote active - clear and show form
    console.log('[App] Different keynote, clearing session')
    clearSavedMember()
    joinedName.value = ''
    selectedAvatar.value = null
    currentStep.value = 'name'
    status.value = 'idle'
  } else {
    // No keynote active - clear and wait
    console.log('[App] No keynote active, clearing session')
    clearSavedMember()
    joinedName.value = ''
    selectedAvatar.value = null
    currentStep.value = 'name'
    status.value = 'waiting'
  }
}

// Connect on mount
onMounted(async () => {
  const apiKey = import.meta.env.VITE_ABLY_API_KEY as string

  if (!apiKey) {
    status.value = 'error'
    console.error('VITE_ABLY_API_KEY not set')
    return
  }

  // Check for saved member
  const savedMember = loadSavedMember()

  try {
    // Connect (with saved participantId if available)
    await connect(apiKey, savedMember?.participantId)

    if (savedMember) {
      restoreSession(savedMember.participantId)
    }

    // Subscribe to session state to get keynoteId
    unsubscribes.push(onSessionState((msg) => {
      const newKeynoteId = msg.keynoteId
      const previousKeynoteId = activeKeynoteId.value
      console.log('[App] Received session state, keynoteId:', newKeynoteId, 'status:', status.value)
      activeKeynoteId.value = newKeynoteId

      // Only handle initial sync when in 'connecting' state
      if (status.value === 'connecting') {
        if (savedMember) {
          processInitialSessionState(msg, savedMember)
        } else {
          activeKeynoteId.value = newKeynoteId
          status.value = newKeynoteId ? 'idle' : 'waiting'
        }
        return
      }

      // Handle keynote change while already joined/idle
      if (status.value === 'joined' && previousKeynoteId && newKeynoteId !== previousKeynoteId) {
        // Keynote changed - kick back to form
        console.log('[App] Keynote changed, clearing session')
        clearSavedMember()
        joinedName.value = ''
        selectedAvatar.value = null
        currentStep.value = 'name'
        status.value = newKeynoteId ? 'idle' : 'waiting'
        return
      }

      // --- Handle session-state updates for joined users ---
      if (status.value === 'joined') {
        const prevSlideType = currentSlideType.value
        currentSlideType.value = msg.slideType ?? 'other'

        // Vote slide context
        if (currentSlideType.value === 'vote' && msg.voteContext) {
          activeVoteIndex.value = msg.voteContext.voteIndex

          if (msg.voteContext.votePhase === 'ended' && msg.voteContext.winner) {
            voteEndedData.value = {
              winner: msg.voteContext.winner,
              resultsA: msg.voteContext.resultsA ?? 0,
              resultsB: msg.voteContext.resultsB ?? 0,
            }
            clearCountdown()
          }
          // Don't override local timer for 'voting' phase (timer comes from vote-started message)
          // Don't override local state for 'pending' if we have an active vote/timer
        }

        // Poll slide context
        if (currentSlideType.value === 'poll' && msg.pollContext) {
          activePollId.value = msg.pollContext.pollId

          if (msg.pollContext.pollPhase === 'ended') {
            pollPhase.value = 'ended'
            clearCountdown()
          }
          // Don't override local timer for 'polling' phase
        }

        // Cleanup when leaving a vote slide
        if (prevSlideType === 'vote' && currentSlideType.value !== 'vote') {
          if (activeVoteIndex.value !== null && completedVotes.has(activeVoteIndex.value)) {
            console.log('[App] Left vote slide, cleaning up vote state')
            voteEndedData.value = null
            hasVoted.value = false
            voteMissed.value = false
            selectedChoice.value = null
            activeVoteIndex.value = null
            clearVoteState()
          }
        }

        // Cleanup when leaving a poll slide
        if (prevSlideType === 'poll' && currentSlideType.value !== 'poll') {
          if (pollPhase.value === 'ended' || hasPollVoted.value) {
            console.log('[App] Left poll slide, cleaning up poll state')
            pollPhase.value = null
            hasPollVoted.value = false
            activePollId.value = null
          }
        }
      }
    }))

    // Subscribe to vote-started messages
    unsubscribes.push(onVoteStarted((msg) => {
      console.log('[App] Vote started:', msg.voteIndex, 'duration:', msg.duration)

      // Ignore stale messages for votes we already completed (voted or missed)
      if (completedVotes.has(msg.voteIndex)) {
        console.log('[App] Vote', msg.voteIndex, 'already completed, ignoring')
        return
      }

      // If it's a new vote (different index), reset state
      if (activeVoteIndex.value !== msg.voteIndex) {
        clearVoteState()
        activeVoteIndex.value = msg.voteIndex
        selectedChoice.value = null
        hasVoted.value = false
        voteMissed.value = false
        voteError.value = null
        isSubmitting.value = false
        voteEndedData.value = null
      }
      currentSlideType.value = 'vote'

      // Update/start countdown for late joiners (only if not voted/missed)
      if (msg.duration > 0 && !hasVoted.value && !voteMissed.value) {
        const elapsedMs = Date.now() - msg.timestamp
        const elapsedSeconds = Math.floor(elapsedMs / 1000)
        const remainingDuration = Math.max(0, msg.duration - elapsedSeconds)
        if (remainingDuration > 0) {
          startCountdown(remainingDuration)
        }
      }
    }))

    // Subscribe to poll-started messages
    unsubscribes.push(onPollStarted((msg) => {
      console.log('[App] Poll started:', msg.pollId, 'duration:', msg.duration)
      activePollId.value = msg.pollId
      currentSlideType.value = 'poll'
      pollPhase.value = 'polling'
      hasPollVoted.value = false
      voteError.value = null
      isSubmitting.value = false
      // Start countdown with synchronized time (account for message delay)
      if (msg.duration > 0) {
        const elapsedMs = Date.now() - msg.timestamp
        const elapsedSeconds = Math.floor(elapsedMs / 1000)
        const remainingDuration = Math.max(0, msg.duration - elapsedSeconds)
        if (remainingDuration > 0) {
          startCountdown(remainingDuration)
        }
      }
    }))

    // Subscribe to vote-ended messages
    unsubscribes.push(onVoteEnded((msg) => {
      console.log('[App] Vote ended:', msg.voteIndex, 'winner:', msg.winner)

      // Wait for any in-flight submission to complete before applying ended state
      const applyVoteEnded = () => {
        voteEndedData.value = {
          winner: msg.winner,
          resultsA: msg.results.A,
          resultsB: msg.results.B,
        }
        activeVoteIndex.value = msg.voteIndex
        currentSlideType.value = 'vote'
        clearCountdown()
        // Mark as missed if user hadn't voted
        if (!hasVoted.value && !isSubmitting.value) {
          voteMissed.value = true
        }
        completedVotes.add(msg.voteIndex)
      }

      if (isSubmitting.value) {
        // Poll until submission finishes (max 3s)
        let waited = 0
        const poll = setInterval(() => {
          waited += 100
          if (!isSubmitting.value || waited >= 3000) {
            clearInterval(poll)
            applyVoteEnded()
          }
        }, 100)
      } else {
        applyVoteEnded()
      }
    }))

    // Subscribe to poll-ended messages
    unsubscribes.push(onPollEnded((msg) => {
      console.log('[App] Poll ended:', msg.pollId)
      if (activePollId.value === msg.pollId) {
        pollPhase.value = 'ended'
        clearCountdown()
      }
    }))

    // Setup reconnection callback (debounced to avoid rapid-fire re-announces)
    setOnReconnect(() => {
      console.log('[App] Reconnected - requesting state sync')
      debouncedRequestStateSync()
    })

    // Enter Ably Presence so the presentation tracks us as active
    enterPresence()

    // Restore display data immediately
    if (savedMember) {
      joinedName.value = savedMember.name
      selectedAvatar.value = savedMember.avatar
    }

    // Bootstrap from Ably history instead of waiting for a live session-state
    // (the presentation has no periodic heartbeat — only publishes on events)
    if (savedMember) {
      try {
        const { sessionState } = await fetchSessionHistory()
        // Only process if still waiting (no live message beat us)
        if (status.value === 'connecting' && sessionState) {
          // keynoteId validation happens inside processInitialSessionState
          processInitialSessionState(sessionState, savedMember)
        } else if (status.value === 'connecting') {
          // No history at all — presentation never published anything
          // Stay in 'connecting', a live message will arrive eventually
          console.log('[App] No session history, waiting for live message')
        }
      } catch (err) {
        console.warn('[App] Failed to fetch initial history:', err)
      }
    }
  } catch (err) {
    status.value = 'error'
  }

  // Add page visibility change listener
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

// Cleanup on unmount
onBeforeUnmount(() => {
  clearCountdown()
  if (syncDebounceTimer) clearTimeout(syncDebounceTimer)
  unsubscribes.forEach(fn => fn())
  unsubscribes.length = 0
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

// Go to avatar step
function handleNext() {
  if (!canGoNext.value || status.value !== 'idle') return
  currentStep.value = 'avatar'
}

// Go back to name step
function handleBack() {
  currentStep.value = 'name'
}

// Join the crew (called from AvatarCreator)
async function handleJoin(avatar: string) {
  if (status.value !== 'idle' || !activeKeynoteId.value) return

  status.value = 'joining'
  selectedAvatar.value = avatar

  try {
    await joinCrew(name.value.trim(), activeKeynoteId.value, avatar)
    joinedName.value = name.value.trim()
    status.value = 'joined'

    // Save to localStorage with keynoteId
    const participantId = getParticipantId()
    if (participantId) {
      saveMember(name.value.trim(), participantId, activeKeynoteId.value, avatar)
    }
  } catch (err) {
    console.error('Failed to join crew:', err)
    status.value = 'error'
  }
}

// Direct vote (auto-submit on click)
async function directVote(choice: 'A' | 'B') {
  if (hasVoted.value || isSubmitting.value) return
  selectedChoice.value = choice
  await submitVote()
}

// Submit vote
async function submitVote() {
  console.log('[App] submitVote called:', {
    selectedChoice: selectedChoice.value,
    activeVoteIndex: activeVoteIndex.value,
    activeKeynoteId: activeKeynoteId.value
  })

  // Clear previous error
  voteError.value = null

  // Try to get keynoteId from localStorage if not available
  let keynoteId = activeKeynoteId.value
  if (!keynoteId) {
    const saved = loadSavedMember()
    keynoteId = saved?.keynoteId || null
    console.log('[App] Using saved keynoteId:', keynoteId)
  }

  if (!selectedChoice.value || activeVoteIndex.value === null || !keynoteId) {
    console.warn('[App] Cannot submit vote - missing data:', {
      selectedChoice: selectedChoice.value,
      activeVoteIndex: activeVoteIndex.value,
      keynoteId
    })
    voteError.value = 'Missing data to submit vote'
    return
  }

  isSubmitting.value = true
  try {
    await sendVote(activeVoteIndex.value, selectedChoice.value, keynoteId)
    hasVoted.value = true
    clearCountdown()
    console.log('[App] Vote submitted:', selectedChoice.value)
  } catch (err) {
    console.error('Failed to submit vote:', err)
    voteError.value = 'Failed to submit vote. Tap to retry.'
  } finally {
    isSubmitting.value = false
  }
}

// Submit poll (auto-submit on click)
async function submitPoll(choice: PollChoice) {
  console.log('[App] submitPoll called:', {
    choice,
    activePollId: activePollId.value
  })

  // Clear previous error
  voteError.value = null

  if (hasPollVoted.value || !activePollId.value) {
    console.warn('[App] Cannot submit poll - already voted or no active poll')
    return
  }

  // Try to get keynoteId from localStorage if not available
  let keynoteId = activeKeynoteId.value
  if (!keynoteId) {
    const saved = loadSavedMember()
    keynoteId = saved?.keynoteId || null
  }

  if (!keynoteId) {
    console.warn('[App] Cannot submit poll - no keynoteId')
    voteError.value = 'Connection lost. Please refresh.'
    return
  }

  isSubmitting.value = true
  try {
    await sendPoll(activePollId.value, choice, keynoteId)
    hasPollVoted.value = true
    pollPhase.value = 'submitted'
    clearCountdown()
    console.log('[App] Poll submitted:', choice)
  } catch (err) {
    console.error('Failed to submit poll:', err)
    voteError.value = 'Failed to submit. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>Lighthouse Pirates</h1>

      <!-- #1 Connecting -->
      <div
        v-if="status === 'connecting'"
        class="status"
      >
        <div class="spinner"></div>
        <p>Connecting...</p>
      </div>

      <!-- #2 Waiting for presentation -->
      <div
        v-else-if="status === 'waiting'"
        class="status"
      >
        <div class="spinner"></div>
        <p>Waiting for the captain...</p>
        <p class="hint">The presentation hasn't started yet</p>
      </div>

      <!-- #3 Error -->
      <div
        v-else-if="status === 'error'"
        class="status error"
      >
        <p>Connection error</p>
        <p class="hint">Check your internet connection</p>
      </div>

      <!-- #4 Form - Name Step -->
      <div
        v-else-if="(status === 'idle' || status === 'joining') && currentStep === 'name'"
        class="form"
      >
        <label for="name">Your pirate name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="Captain Hook"
          maxlength="20"
          :disabled="status === 'joining'"
          @keyup.enter="handleNext"
        />
        <p
          v-if="validationMessage"
          class="validation"
        >{{ validationMessage }}</p>

        <button
          @click="handleNext"
          :disabled="!canGoNext"
          class="next-btn"
        >
          Next
        </button>
      </div>

      <!-- #5 Form - Avatar Step -->
      <div
        v-else-if="(status === 'idle' || status === 'joining') && currentStep === 'avatar'"
        class="avatar-step"
      >
        <button
          class="back-btn"
          @click="handleBack"
          :disabled="status === 'joining'"
        >
          ← Back
        </button>
        <p class="name-preview">{{ name }}</p>
        <AvatarCreator @join="handleJoin" />
        <div
          v-if="status === 'joining'"
          class="joining-overlay"
        >
          <div class="spinner"></div>
          <p>Boarding...</p>
        </div>
      </div>

      <!-- #6 Vote ended - show winner + percentages -->
      <div
        v-else-if="status === 'joined' && currentSlideType === 'vote' && voteEndedData"
        class="vote-ended"
      >
        <h2>Vote closed!</h2>
        <p class="winner-text">Option {{ voteEndedData.winner }} wins!</p>
        <div class="results-bar">
          <div class="results-a" :style="{ width: percentageA + '%' }">
            <span v-if="percentageA >= 15">A - {{ percentageA }}%</span>
          </div>
          <div class="results-b" :style="{ width: percentageB + '%' }">
            <span v-if="percentageB >= 15">B - {{ percentageB }}%</span>
          </div>
        </div>
        <p v-if="hasVoted" class="hint">You voted {{ selectedChoice }}</p>
        <p v-else class="hint">You missed this vote</p>
      </div>

      <!-- #7 Voted - waiting for results -->
      <div
        v-else-if="status === 'joined' && currentSlideType === 'vote' && hasVoted"
        class="success"
      >
        <div class="checkmark">✓</div>
        <h2>Vote recorded!</h2>
        <p>You voted for option {{ selectedChoice }}</p>
        <p class="hint">Wait for the results...</p>
      </div>

      <!-- #8 Missed vote -->
      <div
        v-else-if="status === 'joined' && currentSlideType === 'vote' && voteMissed"
        class="missed"
      >
        <div class="missed-icon">X</div>
        <h2>Too late!</h2>
        <p>You missed the vote</p>
        <p class="hint">Wait for the results...</p>
      </div>

      <!-- #9 Voting in progress -->
      <div
        v-else-if="status === 'joined' && currentSlideType === 'vote' && timeRemaining > 0 && activeVoteIndex !== null"
        class="voting"
      >
        <h2>Vote now!</h2>
        <div class="countdown">{{ timeRemaining }}s</div>
        <p class="vote-hint">Choose your option</p>
        <div class="vote-buttons">
          <button
            :class="['vote-btn', 'vote-a', { selected: selectedChoice === 'A' }]"
            @click="directVote('A')"
            :disabled="isSubmitting"
          >
            A
          </button>
          <button
            :class="['vote-btn', 'vote-b', { selected: selectedChoice === 'B' }]"
            @click="directVote('B')"
            :disabled="isSubmitting"
          >
            B
          </button>
        </div>
        <p v-if="voteError" class="vote-error">{{ voteError }}</p>
        <p v-if="isSubmitting" class="submitting-hint">Sending...</p>
      </div>

      <!-- #10 Vote slide - pending (get ready!) -->
      <div
        v-else-if="status === 'joined' && currentSlideType === 'vote'"
        class="vote-pending"
      >
        <h2>Get ready to vote!</h2>
        <p class="hint">The vote will start soon...</p>
      </div>

      <!-- #11 Poll ended -->
      <div
        v-else-if="status === 'joined' && currentSlideType === 'poll' && pollPhase === 'ended'"
        class="poll-ended"
      >
        <div class="checkmark">✓</div>
        <h2>Poll closed!</h2>
        <p v-if="hasPollVoted" class="hint">Your response has been recorded</p>
        <p v-else class="hint">You missed this poll</p>
      </div>

      <!-- #12 Poll submitted -->
      <div
        v-else-if="status === 'joined' && currentSlideType === 'poll' && hasPollVoted"
        class="success"
      >
        <div class="checkmark">✓</div>
        <h2>Thanks!</h2>
        <p class="hint">Your response has been recorded</p>
      </div>

      <!-- #13 Poll in progress -->
      <div
        v-else-if="status === 'joined' && currentSlideType === 'poll' && activePollId && timeRemaining > 0"
        class="polling"
      >
        <h2>Quick question!</h2>
        <div class="countdown">{{ timeRemaining }}s</div>
        <p class="poll-hint">What's your Lighthouse knowledge level?</p>
        <p v-if="voteError" class="vote-error">{{ voteError }}</p>
        <div class="poll-buttons">
          <button
            class="poll-btn poll-cabin"
            @click="submitPoll('cabin_boy')"
            :disabled="isSubmitting"
          >
            <span class="poll-emoji">🪣</span>
            <span class="poll-label">Cabin Boy</span>
          </button>
          <button
            class="poll-btn poll-quarter"
            @click="submitPoll('quartermaster')"
            :disabled="isSubmitting"
          >
            <span class="poll-emoji">⚓</span>
            <span class="poll-label">Quartermaster</span>
          </button>
          <button
            class="poll-btn poll-captain"
            @click="submitPoll('captain')"
            :disabled="isSubmitting"
          >
            <span class="poll-emoji">🏴‍☠️</span>
            <span class="poll-label">Captain</span>
          </button>
        </div>
      </div>

      <!-- #14 Poll slide - pending (get ready!) -->
      <div
        v-else-if="status === 'joined' && currentSlideType === 'poll'"
        class="poll-pending"
      >
        <h2>Get ready!</h2>
        <p class="hint">A quick question is coming...</p>
      </div>

      <!-- #15 Joined - default (between votes) -->
      <div
        v-else-if="status === 'joined'"
        class="joined-waiting"
      >
        <div class="avatar-wrapper-large">
          <AvatarPreview
            v-if="selectedAvatar"
            :avatar="selectedAvatar"
            :size="400"
            class="responsive-avatar"
          />
        </div>
        <div class="name-pill">{{ joinedName }}</div>
        <p class="hint">The captain will let you know about the next vote!</p>
      </div>
    </div>

    <!-- Debug info -->
    <div class="debug">
      <span :class="isConnected ? 'connected' : 'disconnected'">
        {{ isConnected ? 'Connected' : 'Disconnected' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 24px;
  color: #ffd700;
}

.status {
  padding: 20px 0;
}

.status.error {
  color: #ff6b6b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.joined-waiting {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.name-pill {
  padding: 8px 20px;
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid #ffd700;
  border-radius: 20px;
  color: #ffd700;
  font-size: 18px;
  font-weight: 600;
  margin-top: -30px;
}

.avatar-wrapper-large {
  width: 100%;
  max-width: 500px;
  margin-bottom: 16px;
}

.avatar-wrapper-large :deep(.avatar-container) {
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 1;
}

.avatar-wrapper-large :deep(.avatar-layer) {
  width: 100%;
  height: 100%;
}

.avatar-wrapper {
  margin-bottom: 16px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.next-btn {
  margin-top: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #1e3a5f;
  background: #ffd700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.next-btn:hover:not(:disabled) {
  transform: scale(1.02);
}

.next-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.avatar-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
}

.back-btn {
  align-self: flex-start;
  padding: 8px 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.back-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.name-preview {
  font-size: 18px;
  color: #ffd700;
  font-weight: 600;
  margin: 0;
}

.joining-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  z-index: 10;
}

label {
  font-size: 14px;
  text-align: left;
  opacity: 0.8;
}

input {
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #ffd700;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.validation {
  font-size: 12px;
  color: #ff6b6b;
  text-align: left;
}

.vote-error {
  font-size: 14px;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 8px 16px;
  border-radius: 8px;
  margin: 8px 0;
}

.join-btn {
  margin-top: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #1e3a5f;
  background: #ffd700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.join-btn:hover:not(:disabled) {
  transform: scale(1.02);
}

.join-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success {
  padding: 20px 0;
}

.checkmark {
  width: 60px;
  height: 60px;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 16px;
}

.success h2 {
  color: #ffd700;
  margin-bottom: 8px;
}

.missed {
  padding: 20px 0;
}

.missed-icon {
  width: 60px;
  height: 60px;
  background: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
  margin: 0 auto 16px;
}

.missed h2 {
  color: #ef4444;
  margin-bottom: 8px;
}

.hint {
  font-size: 14px;
  opacity: 0.6;
  margin-top: 8px;
}

.debug {
  position: fixed;
  bottom: 16px;
  right: 16px;
  font-size: 12px;
  opacity: 0.5;
}

.connected {
  color: #22c55e;
}

.disconnected {
  color: #ff6b6b;
}

/* Voting styles */
.voting {
  padding: 20px 0;
}

.voting h2 {
  color: #ffd700;
  margin-bottom: 8px;
}

.countdown {
  font-size: 48px;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 8px;
}

.vote-hint {
  opacity: 0.8;
  margin-bottom: 20px;
}

.vote-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 20px;
}

.vote-btn {
  width: 80px;
  height: 80px;
  font-size: 32px;
  font-weight: bold;
  border: 3px solid;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.vote-a {
  border-color: #3b82f6;
  color: #3b82f6;
}

.vote-a:hover,
.vote-a.selected {
  background: #3b82f6;
  color: white;
}

.vote-b {
  border-color: #f59e0b;
  color: #f59e0b;
}

.vote-b:hover,
.vote-b.selected {
  background: #f59e0b;
  color: white;
}

.submitting-hint {
  font-size: 14px;
  color: #ffd700;
  opacity: 0.8;
  margin-top: 8px;
}

/* Poll styles */
.polling {
  padding: 20px 0;
}

.polling h2 {
  color: #ffd700;
  margin-bottom: 8px;
}

.poll-hint {
  opacity: 0.8;
  margin-bottom: 20px;
}

.poll-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.poll-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  font-size: 18px;
  font-weight: 600;
  border: 3px solid;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.poll-emoji {
  font-size: 32px;
}

.poll-label {
  flex: 1;
  text-align: left;
}

.poll-cabin {
  border-color: #3b82f6;
}

.poll-cabin:hover {
  background: #3b82f6;
}

.poll-quarter {
  border-color: #f59e0b;
}

.poll-quarter:hover {
  background: #f59e0b;
}

.poll-captain {
  border-color: #a855f7;
}

.poll-captain:hover {
  background: #a855f7;
}

/* Vote ended styles */
.vote-ended {
  padding: 20px 0;
}

.vote-ended h2 {
  color: #ffd700;
  margin-bottom: 8px;
}

.winner-text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.results-bar {
  display: flex;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.results-a {
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: white;
  transition: width 0.5s ease;
}

.results-b {
  background: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: white;
  transition: width 0.5s ease;
}

/* Vote/Poll pending styles */
.vote-pending,
.poll-pending {
  padding: 40px 0;
}

.vote-pending h2,
.poll-pending h2 {
  color: #ffd700;
  margin-bottom: 8px;
  font-size: 24px;
}

/* Poll ended styles */
.poll-ended {
  padding: 20px 0;
}

.poll-ended h2 {
  color: #ffd700;
  margin-bottom: 8px;
}
</style>
