// ===========================================
// Shared constants for Lighthouse Pirates
// ===========================================

// Ably Channels
export const ABLY_CHANNELS = {
  // Session state (presentation → all)
  SESSION: 'lighthouse:session',

  // Votes cast (vote app → presentation)
  VOTES: 'lighthouse:votes',

  // Avatars created (vote app → presentation)
  AVATARS: 'lighthouse:avatars',

  // Heartbeat/presence (bidirectional)
  HEARTBEAT: 'lighthouse:heartbeat',
} as const

// Vote phases
export const VOTE_PHASES = {
  WAITING: 'waiting',   // Waiting for next vote
  VOTING: 'voting',     // Vote in progress
  ENDED: 'ended',       // Vote ended
} as const

// Vote configuration
export const VOTE_CONFIG = {
  DURATION_SECONDS: 20,  // Duration of a vote in seconds
  SLIDES: [15, 23, 31, 39] as const,  // Vote slide numbers (Day 1-4 vote slides)
} as const

// Heartbeat configuration
export const HEARTBEAT_CONFIG = {
  INTERVAL_MS: 10000,     // Interval between requests (10s)
  TIMEOUT_MS: 15000,      // Timeout to consider a participant inactive (15s)
} as const

// Lighthouse categories (vote order)
export const LIGHTHOUSE_CATEGORIES = [
  { index: 0, name: 'Performance', short: 'Perf', color: '#f97316' },
  { index: 1, name: 'Accessibility', short: 'A11y', color: '#3b82f6' },
  { index: 2, name: 'Best Practices', short: 'BP', color: '#22c55e' },
  { index: 3, name: 'SEO', short: 'SEO', color: '#a855f7' },
] as const

// Avatar configuration
export const AVATAR_CONFIG = {
  HEADS_COUNT: 9,
  BODIES_COUNT: 9,
  ACCESSORIES_COUNT: 9,
  TOTAL_COMBINATIONS: 9 * 9 * 9,  // 729
} as const

// LocalStorage keys
export const STORAGE_KEYS = {
  // Presentation app
  SESSION_DATA: 'lighthouse-session-data',

  // Vote app
  CREW_MEMBER: 'lighthouse-pirates-crew',
} as const
