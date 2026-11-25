export type Lang = 'fr' | 'en'

export const LANGS: readonly Lang[] = ['fr', 'en'] as const

export const DEFAULT_LANG: Lang = 'fr'

export function isLang(value: unknown): value is Lang {
  return value === 'fr' || value === 'en'
}
