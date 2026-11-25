import { computed } from 'vue'
import { createI18n } from 'vue-i18n'
import { messages, pluralRules } from '../../../shared/i18n'
import { DEFAULT_LANG, type Lang } from '../../../shared/i18n/types'
import { formatMetricValue } from '../../../shared/i18n/format'
import { localizedAssetPath } from '../../../shared/i18n/localizedAssets'

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LANG,
  fallbackLocale: DEFAULT_LANG,
  messages,
  pluralRules,
  warnHtmlMessage: false,
})

export const currentLang = computed(() => i18n.global.locale.value as Lang)

export function setLang(lang: Lang) {
  i18n.global.locale.value = lang
  if (typeof document !== 'undefined') document.documentElement.lang = lang
}

/** Traduction hors composant (stores, composables) */
export const t = i18n.global.t

/** Valeur de métrique formatée dans la langue courante (réactif si appelé dans un rendu/computed) */
export function formatMetric(metricName: string, value: number, opts?: { compactCls?: boolean }) {
  return formatMetricValue(metricName, value, currentLang.value, opts)
}

/** Image localisée (variante `nom.<lang>.webp` si elle existe), en `url('…')` pour background-image */
export function localizedBg(path: string) {
  return `url('${localizedAssetPath(path, currentLang.value)}')`
}
