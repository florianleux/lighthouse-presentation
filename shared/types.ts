// ===========================================
// Shared types for Lighthouse Pirates
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
  isFake?: boolean
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
  // Accumulated vote winners across all rounds (persists across all phases)
  voteWinners?: Record<number, 'A' | 'B'>
  // Pre-resolved derived options (e.g., 'lcp:a' → FCP loser)
  resolvedDerived?: Record<string, ResolvedDerivedOption>
  timestamp: number
}

// ===========================================
// Poll choice type
// ===========================================

export type PollChoice = 'cabin_boy' | 'captain' | 'admiral'

// ===========================================
// Firestore document types
// ===========================================

export interface FirestoreConfig {
  activePresentationId: string | null
}

export interface ResolvedDerivedOption {
  sourceMetricIndex: number
  sourceOption: 'a' | 'b'
}

export interface FirestorePresentation {
  keynoteId: string
  createdAt: number
  active: boolean
  phase: SessionPhase
  vote?: { index: number }
  voteResult?: { index: number; winner: 'A' | 'B'; countA: number; countB: number }
  poll?: { id: string }
  pollResult?: { id: string; results: Record<string, number> }
  voteWinners?: Record<number, 'A' | 'B'>
  resolvedDerived?: Record<string, ResolvedDerivedOption>
}

export interface FirestoreParticipant {
  name: string
  avatar: string
  createdAt: number
  isFake?: boolean
}

export interface FirestoreVote {
  status: 'open' | 'closed'
  startTime: number
  closedAt?: number
  result?: { winner: 'A' | 'B'; counts: { A: number; B: number }; total: number }
}

export interface FirestoreBallot {
  choice: 'A' | 'B'
  votedAt: number
}

export interface FirestorePoll {
  status: 'open' | 'closed'
  startTime: number
  closedAt?: number
}

export interface FirestorePollResponse {
  choice: PollChoice
  respondedAt: number
}

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
  captain: string[]
  admiral: string[]
}
