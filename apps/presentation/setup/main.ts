import { reactive, watch } from 'vue'
import { defineAppSetup } from '@slidev/types'
import { useAbly } from '../composables/useAbly'
import { ABLY_CHANNELS, STORAGE_KEYS, POLL_CONFIG, VOTE_CONFIG } from '../../../shared/constants'

// Debug mode detection (?debug in URL)
function isDebugMode(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('debug')
}

export const debugMode = isDebugMode()
import type {
  CrewMember,
  VoteResults,
  PollResults,
  PollChoice,
  SessionStateMessage,
  VoteContext,
  PollContext,
} from '../../../shared/types'

// Session data persistence
interface SessionData {
  keynoteId: string
  createdAt: number
  lastSlide: number
  votePath: (string | null)[]
  crew: CrewMember[]
  voteResults: Record<number, VoteResults>
  pollResults: Record<string, PollResults>
}

function loadSessionData(): SessionData | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION_DATA)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function saveSessionData(data: SessionData) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(data))
}

function generateKeynoteId(): string {
  return 'keynote-' + crypto.randomUUID()
}

// Load initial session data
const initialSessionData = loadSessionData()

// Dynamic vote slide registry (slideNo → voteIndex)
// Populated at runtime when Vote components mount
export const voteSlideRegistry = reactive(new Map<number, number>())

export function registerVoteSlide(slideNo: number, voteIndex: number) {
  voteSlideRegistry.set(slideNo, voteIndex)
}

export function isVoteSlide(slideNo: number): boolean {
  return voteSlideRegistry.has(slideNo)
}


export function clearVoteSlideRegistry() {
  voteSlideRegistry.clear()
}

// Dynamic poll slide registry (slideNo → pollId)
// Populated at runtime when Poll components mount
export const pollSlideRegistry = reactive(new Map<number, string>())

export function registerPollSlide(slideNo: number, pollId: string) {
  pollSlideRegistry.set(slideNo, pollId)
}

export function isPollSlide(slideNo: number): boolean {
  return pollSlideRegistry.has(slideNo)
}

export function clearPollSlideRegistry() {
  pollSlideRegistry.clear()
}

// Global vote store (5 votes for 5 metrics: CLS, FCP, LCP, TBT, SI)
export const voteStore = reactive({
  path: initialSessionData?.votePath ?? [null, null, null, null, null] as (string | null)[],

  vote(index: number, choice: 'A' | 'B') {
    this.path[index] = choice
    // Persist immediately
    sessionStore.saveVotePath()
  },

  getChoice(index: number) {
    return this.path[index]
  },

  reset() {
    this.path = [null, null, null, null, null]
  }
})

// Session store (crew, votes, state)
export const sessionStore = reactive({
  keynoteId: initialSessionData?.keynoteId ?? null,
  createdAt: initialSessionData?.createdAt ?? null,
  lastSlide: initialSessionData?.lastSlide ?? 1,
  sessionId: generateSessionId(),
  startedAt: Date.now(),
  isAblyConnected: false,

  // Crew (restored from localStorage)
  crew: (initialSessionData?.crew ?? []) as CrewMember[],
  activeCrew: [] as string[],

  // Vote results (5 votes for 5 metrics: CLS, FCP, LCP, TBT, SI) - restored from localStorage
  voteResults: (initialSessionData?.voteResults ?? {
    0: { A: [], B: [], winner: null },
    1: { A: [], B: [], winner: null },
    2: { A: [], B: [], winner: null },
    3: { A: [], B: [], winner: null },
    4: { A: [], B: [], winner: null },
  }) as Record<number, VoteResults>,

  // Current vote state
  activeVoteIndex: null as number | null,
  votePhase: 'waiting' as 'waiting' | 'voting' | 'ended',
  voteStartTimestamp: null as number | null,

  // Poll results (restored from localStorage)
  pollResults: (initialSessionData?.pollResults ?? {
    [POLL_CONFIG.KNOWLEDGE_POLL_ID]: { cabin_boy: [], quartermaster: [], captain: [] },
  }) as Record<string, PollResults>,

  // Current poll state
  activePollId: null as string | null,
  pollPhase: 'waiting' as 'waiting' | 'polling' | 'ended',
  pollStartTimestamp: null as number | null,

  // Manual mode (presenter picks A/B directly, no audience vote)
  // Enabled by default in debug mode (?debug URL param)
  manualMode: debugMode,

  // Actions
  addCrewMember(member: CrewMember) {
    if (!this.crew.find(m => m.participantId === member.participantId)) {
      this.crew.push(member)
      persistSession()
    }
  },

  recordVote(participantId: string, voteIndex: number, choice: 'A' | 'B') {
    const results = this.voteResults[voteIndex]
    if (!results) return

    // Avoid duplicates
    if (results.A.includes(participantId) || results.B.includes(participantId)) {
      return
    }

    results[choice].push(participantId)
    persistSession()
  },

  recordPollVote(participantId: string, pollId: string, choice: PollChoice) {
    let results = this.pollResults[pollId]
    if (!results) {
      results = { cabin_boy: [], quartermaster: [], captain: [] }
      this.pollResults[pollId] = results
    }

    // Avoid duplicates
    if (results.cabin_boy.includes(participantId) ||
        results.quartermaster.includes(participantId) ||
        results.captain.includes(participantId)) {
      return
    }

    results[choice].push(participantId)
    persistSession()
  },

  updateActiveCrew(participantId: string) {
    if (!this.activeCrew.includes(participantId)) {
      this.activeCrew.push(participantId)
    }
  },

  removeActiveCrew(participantId: string) {
    const idx = this.activeCrew.indexOf(participantId)
    if (idx > -1) this.activeCrew.splice(idx, 1)
  },

  // Update last slide and persist
  updateLastSlide(slide: number) {
    this.lastSlide = slide
    persistSession()
  },

  // Save vote path to session data
  saveVotePath() {
    persistSession()
  },

  resetSession() {
    this.sessionId = generateSessionId()
    this.startedAt = Date.now()
    this.crew = []
    this.activeCrew = []
    this.voteResults = {
      0: { A: [], B: [], winner: null },
      1: { A: [], B: [], winner: null },
      2: { A: [], B: [], winner: null },
      3: { A: [], B: [], winner: null },
      4: { A: [], B: [], winner: null },
    }
    this.activeVoteIndex = null
    this.votePhase = 'waiting'
    this.voteStartTimestamp = null
    this.pollResults = {
      [POLL_CONFIG.KNOWLEDGE_POLL_ID]: { cabin_boy: [], quartermaster: [], captain: [] },
    }
    this.activePollId = null
    this.pollPhase = 'waiting'
    this.pollStartTimestamp = null
    this.manualMode = debugMode // Keep manual mode in debug
    voteStore.reset()
    clearVoteSlideRegistry()
    clearPollSlideRegistry()
  },

  // Start a new session with a new keynoteId (called from admin panel)
  startNewSession() {
    // Clear localStorage first to ensure clean slate
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.SESSION_DATA)
    }

    // Reset vote path
    voteStore.reset()

    // Generate new keynote (don't use initKeynote to avoid double-persist)
    this.keynoteId = generateKeynoteId()
    this.createdAt = Date.now()
    this.lastSlide = 1

    // Reset all session state
    this.resetSession()

    // Persist the clean state AFTER all resets
    persistSession()

    console.log('[Session] New session started:', this.keynoteId)
  },

  // Generate keynoteId without resetting (first time setup)
  initKeynote() {
    if (this.keynoteId) return this.keynoteId

    this.keynoteId = generateKeynoteId()
    this.createdAt = Date.now()
    this.lastSlide = 1
    persistSession()
    console.log('[Session] Keynote initialized:', this.keynoteId)
    return this.keynoteId
  }
})

// Persist current session state to localStorage
function persistSession() {
  if (!sessionStore.keynoteId || !sessionStore.createdAt) return
  saveSessionData({
    keynoteId: sessionStore.keynoteId,
    createdAt: sessionStore.createdAt,
    lastSlide: sessionStore.lastSlide,
    votePath: voteStore.path,
    crew: sessionStore.crew,
    voteResults: sessionStore.voteResults,
    pollResults: sessionStore.pollResults,
  })
}

function generateSessionId(): string {
  return 'session-' + crypto.randomUUID()
}

// Ably instance (initialized at setup)
let ablyInstance: ReturnType<typeof useAbly> | null = null

export function getAbly() {
  return ablyInstance
}

export default defineAppSetup(({ app }) => {
  // Debug mode indicator
  if (debugMode) {
    console.log('[Debug] Debug mode enabled - manual vote mode active')
  }

  // Make stores globally accessible
  app.provide('voteStore', voteStore)
  app.provide('sessionStore', sessionStore)

  // Initialize Ably if API key is available
  const apiKey = import.meta.env.VITE_ABLY_API_KEY as string

  if (apiKey) {
    ablyInstance = useAbly()

    ablyInstance.connect(apiKey)
      .then(() => {
        sessionStore.isAblyConnected = true
        console.log('[Session] Ably connected, session:', sessionStore.sessionId)

        // Listen for avatar creation (validate keynoteId to prevent cross-session contamination)
        ablyInstance!.onAvatarCreated((msg) => {
          if (msg.keynoteId !== sessionStore.keynoteId) {
            console.warn('[Session] Ignoring avatar for different keynote:', msg.keynoteId)
            return
          }
          sessionStore.addCrewMember({
            participantId: msg.participantId,
            name: msg.name,
            avatar: msg.avatar,
            joinedAt: msg.timestamp,
          })
        })

        // Listen for votes (validate keynoteId to prevent cross-session contamination)
        ablyInstance!.onVoteCast((msg) => {
          if (msg.keynoteId !== sessionStore.keynoteId) {
            console.warn('[Session] Ignoring vote for different keynote:', msg.keynoteId)
            return
          }
          sessionStore.recordVote(msg.participantId, msg.voteIndex, msg.choice)
        })

        // Listen for polls (validate keynoteId to prevent cross-session contamination)
        ablyInstance!.onPollCast((msg) => {
          if (msg.keynoteId !== sessionStore.keynoteId) {
            console.warn('[Session] Ignoring poll for different keynote:', msg.keynoteId)
            return
          }
          sessionStore.recordPollVote(msg.participantId, msg.pollId, msg.choice)
        })

        // Track active crew via Ably Presence
        ablyInstance!.onPresenceEnter((participantId) => {
          sessionStore.updateActiveCrew(participantId)
        })
        ablyInstance!.onPresenceLeave((participantId) => {
          sessionStore.removeActiveCrew(participantId)
        })

        // Sync current presence members (voters who joined before us)
        ablyInstance!.getPresenceMembers().then((members) => {
          members.forEach((id) => sessionStore.updateActiveCrew(id))
        })
      })
      .catch((err) => {
        console.error('[Session] Failed to connect to Ably:', err)
      })
  } else {
    console.warn('[Session] VITE_ABLY_API_KEY not set - running in offline mode')
  }
})

// Helper to publish session state
export function publishSessionState(currentSlide: number) {
  if (!ablyInstance || !sessionStore.isAblyConnected) return

  // Determine slideType from registries
  let slideType: 'vote' | 'poll' | 'other' = 'other'
  if (voteSlideRegistry.has(currentSlide)) slideType = 'vote'
  else if (pollSlideRegistry.has(currentSlide)) slideType = 'poll'

  // Build voteContext when on a vote slide
  let voteContext: VoteContext | null = null
  if (slideType === 'vote') {
    const voteIdx = voteSlideRegistry.get(currentSlide)!
    const isThisVoteActive = sessionStore.activeVoteIndex === voteIdx
    let votePhase: VoteContext['votePhase'] = 'pending'
    if (isThisVoteActive && sessionStore.votePhase === 'voting') votePhase = 'voting'
    else if (isThisVoteActive && sessionStore.votePhase === 'ended') votePhase = 'ended'

    voteContext = { voteIndex: voteIdx, votePhase }

    if (votePhase === 'voting' && sessionStore.voteStartTimestamp) {
      voteContext.startTimestamp = sessionStore.voteStartTimestamp
      voteContext.duration = VOTE_CONFIG.DURATION_SECONDS
    }

    if (votePhase === 'ended') {
      const results = sessionStore.voteResults[voteIdx]
      if (results) {
        const aLen = results.A.length
        const bLen = results.B.length
        voteContext.winner = bLen > aLen ? 'B' : 'A'
        voteContext.resultsA = aLen
        voteContext.resultsB = bLen
      }
    }
  }

  // Build pollContext when on a poll slide
  let pollContext: PollContext | null = null
  if (slideType === 'poll') {
    const pollId = pollSlideRegistry.get(currentSlide)!
    const isThisPollActive = sessionStore.activePollId === pollId
    let pollPhase: PollContext['pollPhase'] = 'pending'
    if (isThisPollActive && sessionStore.pollPhase === 'polling') pollPhase = 'polling'
    else if (isThisPollActive && sessionStore.pollPhase === 'ended') pollPhase = 'ended'

    pollContext = { pollId, pollPhase }

    if (pollPhase === 'polling' && sessionStore.pollStartTimestamp) {
      pollContext.startTimestamp = sessionStore.pollStartTimestamp
      pollContext.duration = POLL_CONFIG.DURATION_SECONDS
    }
  }

  const message: SessionStateMessage = {
    type: 'session-state',
    keynoteId: sessionStore.keynoteId,
    sessionId: sessionStore.sessionId,
    currentSlide,
    path: voteStore.path,
    timestamp: Date.now(),
    slideType,
    voteContext,
    pollContext,
  }

  ablyInstance.publish(ABLY_CHANNELS.SESSION, message)
}
