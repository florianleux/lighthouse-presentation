import { reactive, ref } from 'vue'
import { defineAppSetup } from '@slidev/types'
import { useAbly } from '../composables/useAbly'
import { STORAGE_KEYS, POLL_CONFIG } from '../../../shared/constants'
import type {
  CrewMember,
  VoteResults,
  PollResults,
  PollChoice,
  SessionStateMessage,
  SessionPhase,
} from '../../../shared/types'

// Debug mode detection (?debug in URL)
function isDebugMode(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('debug')
}

export const debugMode = isDebugMode()

// ===========================================
// Session phase (communicated to vote apps)
// ===========================================

export const currentPhase = ref<SessionPhase>('lobby')
export const phaseData = ref<Partial<SessionStateMessage>>({})

// Track which slide type is active (for CrewPills visibility)
export const currentVoteIndex = ref<number | null>(null)
export const currentPollId = ref<string | null>(null)

// ===========================================
// Session data persistence
// ===========================================

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

function generateSessionId(): string {
  return 'session-' + crypto.randomUUID()
}

const initialSessionData = loadSessionData()

// ===========================================
// Vote store (presenter's chosen path)
// ===========================================

export const voteStore = reactive({
  path: initialSessionData?.votePath ?? [null, null, null, null, null] as (string | null)[],

  vote(index: number, choice: 'A' | 'B') {
    this.path[index] = choice
    sessionStore.saveVotePath()
  },

  getChoice(index: number) {
    return this.path[index]
  },

  reset() {
    this.path = [null, null, null, null, null]
  },
})

// ===========================================
// Session store
// ===========================================

export const sessionStore = reactive({
  keynoteId: initialSessionData?.keynoteId ?? null as string | null,
  createdAt: initialSessionData?.createdAt ?? null as number | null,
  lastSlide: initialSessionData?.lastSlide ?? 1,
  sessionId: generateSessionId(),
  isAblyConnected: false,

  // Crew
  crew: (initialSessionData?.crew ?? []) as CrewMember[],
  activeCrew: [] as string[],

  // Vote results (5 votes: CLS, FCP, LCP, TBT, SI)
  voteResults: (initialSessionData?.voteResults ?? {
    0: { A: [], B: [], winner: null },
    1: { A: [], B: [], winner: null },
    2: { A: [], B: [], winner: null },
    3: { A: [], B: [], winner: null },
    4: { A: [], B: [], winner: null },
  }) as Record<number, VoteResults>,

  // Internal vote state (for VoteSlide timer)
  activeVoteIndex: null as number | null,
  votePhase: 'waiting' as 'waiting' | 'voting' | 'ended',

  // Poll results
  pollResults: (initialSessionData?.pollResults ?? {
    [POLL_CONFIG.KNOWLEDGE_POLL_ID]: { cabin_boy: [], quartermaster: [], captain: [] },
  }) as Record<string, PollResults>,

  // Internal poll state (for PollButtons timer)
  activePollId: null as string | null,
  pollPhase: 'waiting' as 'waiting' | 'polling' | 'ended',

  // Manual mode (presenter picks directly)
  manualMode: debugMode,

  // Actions
  addCrewMember(member: CrewMember) {
    const existing = this.crew.find((m) => m.participantId === member.participantId)
    if (existing) {
      // Update existing member (re-announce after reconnect)
      existing.name = member.name
      existing.avatar = member.avatar
      existing.joinedAt = member.joinedAt
    } else {
      this.crew.push(member)
    }
    persistSession()
  },

  recordVote(participantId: string, voteIndex: number, choice: 'A' | 'B') {
    const results = this.voteResults[voteIndex]
    if (!results) return
    if (results.A.includes(participantId) || results.B.includes(participantId)) return
    results[choice].push(participantId)
    persistSession()
  },

  recordPollVote(participantId: string, pollId: string, choice: PollChoice) {
    let results = this.pollResults[pollId]
    if (!results) {
      results = { cabin_boy: [], quartermaster: [], captain: [] }
      this.pollResults[pollId] = results
    }
    if (results.cabin_boy.includes(participantId) ||
        results.quartermaster.includes(participantId) ||
        results.captain.includes(participantId)) return
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

  updateLastSlide(slide: number) {
    this.lastSlide = slide
    persistSession()
  },

  saveVotePath() {
    persistSession()
  },

  resetSession() {
    this.sessionId = generateSessionId()
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
    this.pollResults = {
      [POLL_CONFIG.KNOWLEDGE_POLL_ID]: { cabin_boy: [], quartermaster: [], captain: [] },
    }
    this.activePollId = null
    this.pollPhase = 'waiting'
    this.manualMode = debugMode
    voteStore.reset()
    currentPhase.value = 'lobby'
    phaseData.value = {}
    currentVoteIndex.value = null
    currentPollId.value = null
  },

  startNewSession() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.SESSION_DATA)
    }
    voteStore.reset()
    this.keynoteId = generateKeynoteId()
    this.createdAt = Date.now()
    this.lastSlide = 1
    this.resetSession()
    persistSession()
    console.log('[Session] New session started:', this.keynoteId)
  },

  initKeynote() {
    if (this.keynoteId) return this.keynoteId
    this.keynoteId = generateKeynoteId()
    this.createdAt = Date.now()
    this.lastSlide = 1
    persistSession()
    console.log('[Session] Keynote initialized:', this.keynoteId)
    return this.keynoteId
  },
})

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

// ===========================================
// Ably setup
// ===========================================

let ablyInstance: ReturnType<typeof useAbly> | null = null

export function getAbly() {
  return ablyInstance
}

export default defineAppSetup(({ app }) => {
  if (debugMode) {
    console.log('[Debug] Debug mode enabled - manual vote mode active')
  }

  app.provide('voteStore', voteStore)
  app.provide('sessionStore', sessionStore)

  const apiKey = import.meta.env.VITE_ABLY_API_KEY as string

  if (apiKey) {
    ablyInstance = useAbly()

    ablyInstance.connect(apiKey)
      .then(() => {
        sessionStore.isAblyConnected = true
        console.log('[Session] Ably connected')

        // Listen for crew joins
        ablyInstance!.onJoinCrew((msg) => {
          if (msg.keynoteId !== sessionStore.keynoteId) return
          sessionStore.addCrewMember({
            participantId: msg.participantId,
            name: msg.name,
            avatar: msg.avatar,
            joinedAt: msg.timestamp,
          })
        })

        // Listen for votes
        ablyInstance!.onVoteCast((msg) => {
          if (msg.keynoteId !== sessionStore.keynoteId) return
          sessionStore.recordVote(msg.participantId, msg.voteIndex, msg.choice)
        })

        // Listen for polls
        ablyInstance!.onPollCast((msg) => {
          if (msg.keynoteId !== sessionStore.keynoteId) return
          sessionStore.recordPollVote(msg.participantId, msg.pollId, msg.choice)
        })

        // Track active crew via presence
        ablyInstance!.onPresenceEnter((participantId) => {
          sessionStore.updateActiveCrew(participantId)
        })
        ablyInstance!.onPresenceLeave((participantId) => {
          sessionStore.removeActiveCrew(participantId)
        })

        // Sync current presence members
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

// ===========================================
// Publish session state (called by global-top + components)
// ===========================================

export function publishSessionState() {
  if (!ablyInstance || !sessionStore.isAblyConnected || !sessionStore.keynoteId) return

  const message: SessionStateMessage = {
    type: 'session-state',
    keynoteId: sessionStore.keynoteId,
    phase: currentPhase.value,
    ...phaseData.value,
    timestamp: Date.now(),
  }

  ablyInstance.publish(message)
}
