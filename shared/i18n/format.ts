import type { Lang } from './types'

const INTL_LOCALES: Record<Lang, string> = { fr: 'fr-FR', en: 'en-US' }

function formatNumber(value: number, lang: Lang, minDigits: number, maxDigits: number): string {
  return new Intl.NumberFormat(INTL_LOCALES[lang], {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  }).format(value)
}

/**
 * Formate une valeur de métrique selon la langue : `1,8 s` (FR) / `1.8 s` (EN).
 * - CLS : sans unité (2 décimales, ou jusqu'à 2 si `compactCls`)
 * - ≥ 1000 ms : secondes avec 1 décimale
 * - sinon : millisecondes entières
 */
export function formatMetricValue(
  metricName: string,
  value: number,
  lang: Lang,
  { compactCls = false }: { compactCls?: boolean } = {},
): string {
  if (metricName === 'CLS') return formatNumber(value, lang, compactCls ? 0 : 2, 2)
  if (value >= 1000) return `${formatNumber(value / 1000, lang, 1, 1)} s`
  return `${formatNumber(value, lang, 0, 0)} ms`
}
