import { sessionStore } from '../setup/main'

// Mode local : les avatars arrivent par lots (saisie main levée, bots ajoutés d'un coup).
// On étale leurs départs pour que tout le monde soit arrivé en 3 s max
// (2,2 s de délai + 0,8 s de trajet). Délai stable par avatar, dérivé de son id.
const MAX_DELAY_MS = 2200

export function staggerDelay(id: string): string {
  if (!sessionStore.localMode) return '0ms'
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return `${Math.abs(hash) % MAX_DELAY_MS}ms`
}
