// ===========================================
// Types partagés pour la communication Ably
// ===========================================

// Avatar (3 parties combinables = 729 combinaisons)
export interface Avatar {
  head: number      // 0-8
  body: number      // 0-8
  accessory: number // 0-8
}

// Participant (pirate de l'équipage)
export interface CrewMember {
  odientId: string
  name: string
  avatar: Avatar | null
  joinedAt: number
}

// ===========================================
// Messages ENTRANTS (vote app → presentation)
// ===========================================

export interface AvatarCreatedMessage {
  type: 'avatar-created'
  keynoteId: string
  odientId: string
  name: string
  avatar: Avatar | null
  timestamp: number
}

export interface VoteCastMessage {
  type: 'vote-cast'
  keynoteId: string
  odientId: string
  voteIndex: number
  choice: 'A' | 'B'
  timestamp: number
}

export interface HeartbeatResponseMessage {
  type: 'heartbeat-response'
  odientId: string
  timestamp: number
}

// ===========================================
// Messages SORTANTS (presentation → vote app)
// ===========================================

export type SessionPhase = 'intro' | 'voting' | 'results' | 'application' | 'recap'

export interface SessionStateMessage {
  type: 'session-state'
  keynoteId: string | null
  sessionId: string
  currentSlide: number
  path: (string | null)[]
  phase: SessionPhase
  activeVoteIndex: number | null
  timestamp: number
}

export interface HeartbeatRequestMessage {
  type: 'heartbeat-request'
  timestamp: number
}

export interface VoteStartedMessage {
  type: 'vote-started'
  voteIndex: number
  duration: number // en secondes
  timestamp: number
}

export interface VoteEndedMessage {
  type: 'vote-ended'
  voteIndex: number
  winner: 'A' | 'B'
  results: { A: number; B: number }
  timestamp: number
}

// ===========================================
// Union types pour typage strict
// ===========================================

export type IncomingMessage =
  | AvatarCreatedMessage
  | VoteCastMessage
  | HeartbeatResponseMessage

export type OutgoingMessage =
  | SessionStateMessage
  | HeartbeatRequestMessage
  | VoteStartedMessage
  | VoteEndedMessage

// ===========================================
// État de la session (stocké localement)
// ===========================================

export interface VoteResults {
  A: string[]  // Liste des odientIds ayant voté A
  B: string[]  // Liste des odientIds ayant voté B
  winner: 'A' | 'B' | null
}

export interface SessionState {
  keynoteId: string | null
  sessionId: string
  startedAt: number
  currentSlide: number
  path: (string | null)[]
  crew: CrewMember[]
  activeCrew: string[]  // odientIds des participants actifs (heartbeat récent)
  votes: Record<number, VoteResults>  // voteIndex → résultats
}
