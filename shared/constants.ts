// ===========================================
// Shared constants for Lighthouse Pirates
// ===========================================

// Firestore collection paths
export const FIRESTORE_COLLECTIONS = {
  CONFIG: 'config',
  CONFIG_CURRENT: 'config/current',
  PRESENTATIONS: 'presentations',
  PARTICIPANTS: 'participants',
  VOTES: 'votes',
  BALLOTS: 'ballots',
  POLLS: 'polls',
  RESPONSES: 'responses',
} as const

// Vote configuration
export const VOTE_CONFIG = {
  DURATION_SECONDS: 30,
  GRACE_PERIOD_SECONDS: 3,
} as const

// Poll configuration
export const POLL_CONFIG = {
  DURATION_SECONDS: 30,
  GRACE_PERIOD_SECONDS: 3,
  KNOWLEDGE_POLL_ID: 'knowledge-level',
  CHOICES: ['cabin_boy', 'captain', 'admiral'] as const,
} as const

// Performance metrics - Re-exported from centralized metrics-data.ts
// Order: CLS (0) → FCP (1) → LCP (2) → TBT (3) → SI (4)
export { METRICS, METRICS_LIST } from './metrics-data'
export type { MetricConfig, MetricOption, MetricName } from './metrics-data'

// Avatar configuration
export const AVATAR_CONFIG = {
  GENDERS: ['male', 'female'] as const,
  SKIN_TONES: ['dark', 'mid', 'light'] as const,
  MOUTH_COUNT: 3,
  NOSE_COUNT: 4,
  EYE_OPTIONS: 3,
  EYE_COLORS: 4,
  ACCESSORY_COUNT: 4,
  ACCESSORY_COUNT_FEMALE: 3,  // accessory 4 doesn't exist for female
  HAIR_OPTIONS: 3,
  HAIR_COLORS: 5,
  HAT_OPTIONS: 2,
  HAT_COLORS: 4,
  LAYER_ORDER: ['face', 'mouth', 'eyes', 'accessories', 'nose', 'hair', 'hat'] as const,
} as const

// LocalStorage keys
export const STORAGE_KEYS = {
  // Presentation app
  SESSION_DATA: 'lighthouse-session-data',

  // Vote app
  CREW_MEMBER: 'lighthouse-pirates-crew',
  VOTE_STATE: 'lighthouse-pirates-vote-state',
} as const
