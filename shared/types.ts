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
  participantId: string
  name: string
  avatar: Avatar | null
  joinedAt: number
}

// ===========================================
// Session state (presentation → vote apps)
// ===========================================

export type SessionPhase = 'lobby' | 'idle' | 'voting' | 'vote-results' | 'polling' | 'poll-results'

export interface SessionStateMessage {
  type: 'session-state'
  keynoteId: string
  phase: SessionPhase
  // Present only when phase === 'voting'
  vote?: { index: number }
  // Present only when phase === 'vote-results'
  voteResult?: { index: number; winner: 'A' | 'B'; countA: number; countB: number }
  // Present only when phase === 'polling'
  poll?: { id: string }
  // Present only when phase === 'poll-results'
  pollResult?: { id: string; results: Record<string, number> }
  timestamp: number
}

// ===========================================
// Actions (vote app → presentation)
// ===========================================

export interface JoinCrewAction {
  type: 'join-crew'
  participantId: string
  name: string
  avatar: string // JSON serialized PirateAvatar
  keynoteId: string
  timestamp: number
}

export interface VoteCastAction {
  type: 'vote-cast'
  participantId: string
  voteIndex: number
  choice: 'A' | 'B'
  keynoteId: string
  timestamp: number
}

export type PollChoice = 'cabin_boy' | 'quartermaster' | 'captain'

export interface PollCastAction {
  type: 'poll-cast'
  participantId: string
  pollId: string
  choice: PollChoice
  keynoteId: string
  timestamp: number
}

export type ActionMessage = JoinCrewAction | VoteCastAction | PollCastAction

// ===========================================
// Session state (stored locally by presentation)
// ===========================================

export interface VoteResults {
  A: string[]  // List of participantIds who voted A
  B: string[]  // List of participantIds who voted B
  winner: 'A' | 'B' | null
}

export interface PollResults {
  cabin_boy: string[]
  quartermaster: string[]
  captain: string[]
}
