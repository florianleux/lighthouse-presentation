import { fr } from './fr'
import { en } from './en'

export const messages = { fr, en }

// Pluriel FR : 0 et 1 au singulier (« 0 membre », « 1 membre », « 2 membres »)
export const pluralRules = {
  fr: (choice: number) => (choice > 1 ? 1 : 0),
}

export type { Lang } from './types'
