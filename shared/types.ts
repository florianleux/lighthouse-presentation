// ===========================================
// Shared types for Ably communication
// ===========================================

// ===========================================
// Pirate Avatar types
// ===========================================

export type SkinTone = 'dark' | 'mid' | 'light'
export type Gender = 'male' | 'female'

export interface PirateAvatar {
  gender: Gender             // male or female
  skinTone: SkinTone
  mouth: number              // 1-3
  eyes: { option: number; color: number }  // option: 1-3, color: 1-4
  nose: number               // 1-4
  accessories: {
    regular: number[]        // subset of [1,2,3,4] for male, [1,2,3] for female (no accessory 4)
    eyePatch: 'left' | 'right' | null
  }
  hair: { option: number; color: number } | null  // option: 1-3, color: 1-5
  hat: { option: number; color: number } | null   // option: 1-2, color: 1-4
}

// Avatar - JSON-serialized PirateAvatar string (backward compatible)
export type Avatar = string

// Participant (crew pirate)
export interface CrewMember {
  odientId: string
  name: string
  avatar: Avatar | null
  joinedAt: number
}

// ===========================================
// INCOMING Messages (vote app → presentation)
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
// OUTGOING Messages (presentation → vote app)
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
  duration: number // in seconds
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
// Union types for strict typing
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
// Session state (stored locally)
// ===========================================

export interface VoteResults {
  A: string[]  // List of odientIds who voted A
  B: string[]  // List of odientIds who voted B
  winner: 'A' | 'B' | null
}

export interface SessionState {
  keynoteId: string | null
  sessionId: string
  startedAt: number
  currentSlide: number
  path: (string | null)[]
  crew: CrewMember[]
  activeCrew: string[]  // odientIds of active participants (recent heartbeat)
  votes: Record<number, VoteResults>  // voteIndex → résultats
}
