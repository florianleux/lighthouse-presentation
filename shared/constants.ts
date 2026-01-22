// ===========================================
// Constantes partagées Lighthouse Pirates
// ===========================================

// Channels Ably
export const ABLY_CHANNELS = {
  // État de la session (presentation → all)
  SESSION: 'lighthouse:session',

  // Votes émis (vote app → presentation)
  VOTES: 'lighthouse:votes',

  // Avatars créés (vote app → presentation)
  AVATARS: 'lighthouse:avatars',

  // Heartbeat/présence (bidirectionnel)
  HEARTBEAT: 'lighthouse:heartbeat',
} as const

// Phases de vote
export const VOTE_PHASES = {
  WAITING: 'waiting',   // En attente du prochain vote
  VOTING: 'voting',     // Vote en cours
  ENDED: 'ended',       // Vote terminé
} as const

// Configuration des votes
export const VOTE_CONFIG = {
  DURATION_SECONDS: 20,  // Durée d'un vote en secondes
  SLIDES: [11, 16, 21, 26] as const,  // Numéros des slides de vote
} as const

// Configuration heartbeat
export const HEARTBEAT_CONFIG = {
  INTERVAL_MS: 10000,     // Intervalle entre les requêtes (10s)
  TIMEOUT_MS: 15000,      // Timeout pour considérer un participant inactif (15s)
} as const

// Catégories Lighthouse (ordre des votes)
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
