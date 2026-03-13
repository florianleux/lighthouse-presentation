import { reactive, ref, watch } from 'vue'
import { defineAppSetup } from '@slidev/types'
import { STORAGE_KEYS, POLL_CONFIG } from '../../../shared/constants'
import { useFirestore } from '../composables/useFirestore'
import type {
  CrewMember,
  VoteResults,
  PollResults,
  PollChoice,
  SessionPhase,
} from '../../../shared/types'

// ===========================================
// Session phase (communicated to vote apps)
// ===========================================

export const currentPhase = ref<SessionPhase>('lobby')
export const phaseData = ref<Record<string, unknown>>({})

// Firestore instance (singleton)
export const firestore = useFirestore()

// Publish session state to Firestore (called by components on phase changes)
export function publishSessionState() {
  firestore.publishSessionState(currentPhase.value, phaseData.value)
}

// Setup Firestore listeners for a given presentation
function setupFirestoreListeners() {
  if (!firestore.isConnected.value || !sessionStore.keynoteId) return

  firestore.listenToParticipants((member) => {
    sessionStore.addCrewMember(member)
  })
}


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
  isRealtimeConnected: false,

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
  startedVoteIndices: new Set<number>(),

  // Poll results
  pollResults: (initialSessionData?.pollResults ?? {
    [POLL_CONFIG.KNOWLEDGE_POLL_ID]: { newbie: [], captain: [], admiral: [] },
  }) as Record<string, PollResults>,

  // Internal poll state (for PollButtons timer)
  activePollId: null as string | null,
  pollPhase: 'waiting' as 'waiting' | 'polling' | 'ended',
  startedPollIds: new Set<string>(),

  // Manual mode (presenter picks directly)
  manualMode: false,

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
      results = { newbie: [], captain: [], admiral: [] }
      this.pollResults[pollId] = results
    }
    if (results.newbie.includes(participantId) ||
        results.captain.includes(participantId) ||
        results.admiral.includes(participantId)) return
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
    this.startedVoteIndices = new Set<number>()
    this.pollResults = {
      [POLL_CONFIG.KNOWLEDGE_POLL_ID]: { newbie: [], captain: [], admiral: [] },
    }
    this.activePollId = null
    this.pollPhase = 'waiting'
    this.startedPollIds = new Set<string>()
    this.manualMode = false
    voteStore.reset()
    currentPhase.value = 'lobby'
    phaseData.value = {}
  },

  async startNewSession() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.SESSION_DATA)
    }
    voteStore.reset()
    this.keynoteId = generateKeynoteId()
    this.createdAt = Date.now()
    this.lastSlide = 1
    this.resetSession()
    persistSession()

    // Create Firestore presentation document
    firestore.disconnect()
    const connected = firestore.connect()
    if (connected && this.keynoteId) {
      await firestore.createPresentation(this.keynoteId, this.keynoteId)
      // Clean up all old presentations in background (keep only the new one)
      firestore.deleteAllPresentations(this.keynoteId)
      setupFirestoreListeners()
    }

    console.log('[Session] New session started:', this.keynoteId)
  },

  async initKeynote() {
    if (this.keynoteId) return this.keynoteId
    this.keynoteId = generateKeynoteId()
    this.createdAt = Date.now()
    this.lastSlide = 1
    persistSession()

    // Create Firestore presentation document
    if (firestore.isConnected.value && this.keynoteId) {
      await firestore.createPresentation(this.keynoteId, this.keynoteId)
      setupFirestoreListeners()
    }

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

export function getFakeCrewIds(): string[] {
  return sessionStore.crew
    .filter(m => m.isFake)
    .map(m => m.participantId)
}

// ===========================================
// App setup
// ===========================================

export default defineAppSetup(({ app }) => {
  // Connect to Firestore
  const connected = firestore.connect()
  sessionStore.isRealtimeConnected = connected

  // Sync connection status
  watch(firestore.isConnected, (val) => {
    sessionStore.isRealtimeConnected = val
  })

  // Restore existing session or initialize a new one
  if (connected && sessionStore.keynoteId) {
    // Restored from localStorage — reconnect to the same Firestore presentation
    firestore.setPresentationId(sessionStore.keynoteId)
    setupFirestoreListeners()

    // Session exists — set phase to 'idle' (not 'lobby') to avoid overwriting Firebase state
    currentPhase.value = 'idle'

    // Async: sync voteWinners from Firebase (source of truth for derived options)
    firestore.restoreSessionState().then((state) => {
      if (state?.voteWinners) {
        for (const [index, winner] of Object.entries(state.voteWinners)) {
          const idx = Number(index)
          voteStore.path[idx] = winner
          if (sessionStore.voteResults[idx] && !sessionStore.voteResults[idx].winner) {
            sessionStore.voteResults[idx].winner = winner
          }
        }
        persistSession()
        console.log('[Session] Synced voteWinners from Firebase:', state.voteWinners)
      }
    })

    console.log('[Session] Restored session:', sessionStore.keynoteId)
  }

  app.provide('voteStore', voteStore)
  app.provide('sessionStore', sessionStore)
})
