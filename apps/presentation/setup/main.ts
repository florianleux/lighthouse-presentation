import { reactive, watch } from 'vue'
import { defineAppSetup } from '@slidev/types'
import { useAbly } from '../composables/useAbly'
import { VOTE_CONFIG, ABLY_CHANNELS } from '../../../shared/constants'
import type {
  CrewMember,
  VoteResults,
  SessionStateMessage,
  SessionPhase,
} from '../../../shared/types'

// Slides de vote (navigation bloquée)
export const VOTE_SLIDES = VOTE_CONFIG.SLIDES as unknown as number[]

// Store global pour les votes
export const voteStore = reactive({
  path: [null, null, null, null] as (string | null)[],

  vote(index: number, choice: 'A' | 'B') {
    this.path[index] = choice
  },

  getChoice(index: number) {
    return this.path[index]
  },

  reset() {
    this.path = [null, null, null, null]
  }
})

// Store de session (équipage, votes, état)
export const sessionStore = reactive({
  sessionId: generateSessionId(),
  startedAt: Date.now(),
  isAblyConnected: false,

  // Équipage
  crew: [] as CrewMember[],
  activeCrew: [] as string[],

  // Résultats des votes
  voteResults: {
    0: { A: [], B: [], winner: null },
    1: { A: [], B: [], winner: null },
    2: { A: [], B: [], winner: null },
    3: { A: [], B: [], winner: null },
  } as Record<number, VoteResults>,

  // État du vote en cours
  activeVoteIndex: null as number | null,
  votePhase: 'waiting' as 'waiting' | 'voting' | 'ended',

  // Actions
  addCrewMember(member: CrewMember) {
    if (!this.crew.find(m => m.odientId === member.odientId)) {
      this.crew.push(member)
    }
  },

  recordVote(odientId: string, voteIndex: number, choice: 'A' | 'B') {
    const results = this.voteResults[voteIndex]
    if (!results) return

    // Éviter les doublons
    if (results.A.includes(odientId) || results.B.includes(odientId)) {
      return
    }

    results[choice].push(odientId)
  },

  updateActiveCrew(odientId: string) {
    if (!this.activeCrew.includes(odientId)) {
      this.activeCrew.push(odientId)
    }
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
    voteStore.reset()
  }
})

function generateSessionId(): string {
  return 'session-' + Math.random().toString(36).substring(2, 9)
}

// Instance Ably (initialisée au setup)
let ablyInstance: ReturnType<typeof useAbly> | null = null

export function getAbly() {
  return ablyInstance
}

export default defineAppSetup(({ app }) => {
  // Rendre les stores accessibles globalement
  app.provide('voteStore', voteStore)
  app.provide('sessionStore', sessionStore)

  // Initialiser Ably si la clé est disponible
  const apiKey = import.meta.env.VITE_ABLY_API_KEY as string

  if (apiKey) {
    ablyInstance = useAbly()

    ablyInstance.connect(apiKey)
      .then(() => {
        sessionStore.isAblyConnected = true
        console.log('[Session] Ably connected, session:', sessionStore.sessionId)

        // Écouter les avatars créés
        ablyInstance!.onAvatarCreated((msg) => {
          sessionStore.addCrewMember({
            odientId: msg.odientId,
            name: msg.name,
            avatar: msg.avatar,
            joinedAt: msg.timestamp,
          })
        })

        // Écouter les votes
        ablyInstance!.onVoteCast((msg) => {
          sessionStore.recordVote(msg.odientId, msg.voteIndex, msg.choice)
        })

        // Écouter les heartbeats
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

// Helper pour publier l'état de session
export function publishSessionState(currentSlide: number, phase: SessionPhase) {
  if (!ablyInstance || !sessionStore.isAblyConnected) return

  const message: SessionStateMessage = {
    type: 'session-state',
    sessionId: sessionStore.sessionId,
    currentSlide,
    path: voteStore.path,
    phase,
    activeVoteIndex: sessionStore.activeVoteIndex,
    timestamp: Date.now(),
  }

  ablyInstance.publish(ABLY_CHANNELS.SESSION, message)
}
