import { createI18n } from 'vue-i18n'
import { messages, pluralRules } from '../../../shared/i18n'
import { DEFAULT_LANG, isLang, type Lang } from '../../../shared/i18n/types'
import { STORAGE_KEYS } from '../../../shared/constants'

// La langue est pilotée par la présentation (champ `lang` du doc Firestore).
// Avant la 1re session reçue, on affiche la dernière langue connue.
function loadLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG)
    return isLang(saved) ? saved : DEFAULT_LANG
  } catch {
    return DEFAULT_LANG
  }
}

const initialLang = loadLang()
if (typeof document !== 'undefined') document.documentElement.lang = initialLang

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLang,
  fallbackLocale: DEFAULT_LANG,
  messages,
  pluralRules,
  warnHtmlMessage: false,
})

export const t = i18n.global.t

export function setLang(lang: Lang) {
  if (i18n.global.locale.value === lang) return
  i18n.global.locale.value = lang
  document.documentElement.lang = lang
  try { localStorage.setItem(STORAGE_KEYS.LANG, lang) } catch { }
}
