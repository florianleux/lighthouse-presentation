import { reactive, watch } from 'vue'
import { defineAppSetup } from '@slidev/types'
import { useAbly } from '../composables/useAbly'
import { VOTE_CONFIG, ABLY_CHANNELS, STORAGE_KEYS, POLL_CONFIG } from '../../../shared/constants'
import type {
  CrewMember,
  VoteResults,
  PollResults,
  PollChoice,
  SessionStateMessage,
  SessionPhase,
} from '../../../shared/types'

// Session data persistence
interface SessionData {
  keynoteId: string
  createdAt: number
  lastSlide: number
  votePath: (string | null)[]
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

// Vote slides (navigation blocked)
export const VOTE_SLIDES = VOTE_CONFIG.SLIDES as unknown as number[]

// Global vote store
export const voteStore = reactive({
  path: initialSessionData?.votePath ?? [null, null, null, null] as (string | null)[],

  vote(index: number, choice: 'A' | 'B') {
    this.path[index] = choice
    // Persist immediately
    sessionStore.saveVotePath()
  },

  getChoice(index: number) {
    return this.path[index]
  },

  reset() {
    this.path = [null, null, null, null]
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

  // Crew
  crew: [] as CrewMember[],
  activeCrew: [] as string[],

  // Vote results
  voteResults: {
    0: { A: [], B: [], winner: null },
    1: { A: [], B: [], winner: null },
    2: { A: [], B: [], winner: null },
    3: { A: [], B: [], winner: null },
  } as Record<number, VoteResults>,

  // Current vote state
  activeVoteIndex: null as number | null,
  votePhase: 'waiting' as 'waiting' | 'voting' | 'ended',

  // Poll results
  pollResults: {
    [POLL_CONFIG.KNOWLEDGE_POLL_ID]: { cabin_boy: [], quartermaster: [], captain: [] },
  } as Record<string, PollResults>,

  // Current poll state
  activePollId: null as string | null,
  pollPhase: 'waiting' as 'waiting' | 'polling' | 'ended',

  // Actions
  addCrewMember(member: CrewMember) {
    if (!this.crew.find(m => m.odientId === member.odientId)) {
      this.crew.push(member)
    }
  },

  recordVote(odientId: string, voteIndex: number, choice: 'A' | 'B') {
    const results = this.voteResults[voteIndex]
    if (!results) return

    // Avoid duplicates
    if (results.A.includes(odientId) || results.B.includes(odientId)) {
      return
    }

    results[choice].push(odientId)
  },

  recordPollVote(odientId: string, pollId: string, choice: PollChoice) {
    let results = this.pollResults[pollId]
    if (!results) {
      results = { cabin_boy: [], quartermaster: [], captain: [] }
      this.pollResults[pollId] = results
    }

    // Avoid duplicates
    if (results.cabin_boy.includes(odientId) ||
        results.quartermaster.includes(odientId) ||
        results.captain.includes(odientId)) {
      return
    }

    results[choice].push(odientId)
  },

  updateActiveCrew(odientId: string) {
    if (!this.activeCrew.includes(odientId)) {
      this.activeCrew.push(odientId)
    }
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
    }
    this.activeVoteIndex = null
    this.votePhase = 'waiting'
    this.pollResults = {
      [POLL_CONFIG.KNOWLEDGE_POLL_ID]: { cabin_boy: [], quartermaster: [], captain: [] },
    }
    this.activePollId = null
    this.pollPhase = 'waiting'
    voteStore.reset()
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

        // Listen for avatar creation
        ablyInstance!.onAvatarCreated((msg) => {
          sessionStore.addCrewMember({
            odientId: msg.odientId,
            name: msg.name,
            avatar: msg.avatar,
            joinedAt: msg.timestamp,
          })
        })

        // Listen for votes
        ablyInstance!.onVoteCast((msg) => {
          sessionStore.recordVote(msg.odientId, msg.voteIndex, msg.choice)
        })

        // Listen for polls
        ablyInstance!.onPollCast((msg) => {
          sessionStore.recordPollVote(msg.odientId, msg.pollId, msg.choice)
        })

        // Listen for heartbeats
        ablyInstance!.onHeartbeatResponse((msg) => {
          sessionStore.updateActiveCrew(msg.odientId)
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
export function publishSessionState(currentSlide: number, phase: SessionPhase) {
  if (!ablyInstance || !sessionStore.isAblyConnected) return

  const message: SessionStateMessage = {
    type: 'session-state',
    keynoteId: sessionStore.keynoteId,
    sessionId: sessionStore.sessionId,
    currentSlide,
    path: voteStore.path,
    phase,
    activeVoteIndex: sessionStore.activeVoteIndex,
    timestamp: Date.now(),
  }

  ablyInstance.publish(ABLY_CHANNELS.SESSION, message)
}
