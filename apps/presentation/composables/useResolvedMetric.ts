import { voteStore } from '../setup/main'
import { t } from '../setup/i18n'
import {
  getMetricByIndex,
  getMetricOption,
  getChoiceProps,
  getVoteProps,
  getVoteData,
  resolveDerivedOption,
  type MetricName,
} from '../../../shared/metrics-data'

/**
 * Composable that resolves metric options accounting for derived options.
 * E.g., LCP option B dynamically becomes the FCP loser at runtime.
 */
// Les titres/sous-titres de metrics-data sont des clés i18n : on les traduit en sortie.
// Appelé dans un rendu ou un computed, le résultat suit la langue courante.
function translateOption<T extends { title: string; subtitle?: string }>(opt: T): T {
  const out = { ...opt, title: t(opt.title) }
  if (opt.subtitle !== undefined) out.subtitle = t(opt.subtitle)
  return out
}

export function useResolvedMetric() {
  const getWinner = (metricIndex: number) => voteStore.getChoice(metricIndex)

  function getResolvedChoiceProps(metricIndex: number) {
    const base = getChoiceProps(metricIndex)
    if (!base) return undefined

    // Check if option B is derived
    const metric = getMetricByIndex(metricIndex)
    if (!metric) return base

    const metricName = metric.name.toLowerCase() as MetricName
    const resolvedB = resolveDerivedOption(metricIndex, 'b', getWinner)

    if (resolvedB.metricName !== metricName || resolvedB.option !== 'b') {
      const sourceOption = getMetricOption(resolvedB.metricIndex, resolvedB.option.toUpperCase() as 'A' | 'B')
      if (sourceOption) {
        base.optionB = {
          title: sourceOption.title,
          subtitle: sourceOption.subtitle,
        }
      }
    }

    // Check if option A is derived
    const resolvedA = resolveDerivedOption(metricIndex, 'a', getWinner)
    if (resolvedA.metricName !== metricName || resolvedA.option !== 'a') {
      const sourceOption = getMetricOption(resolvedA.metricIndex, resolvedA.option.toUpperCase() as 'A' | 'B')
      if (sourceOption) {
        base.optionA = {
          title: sourceOption.title,
          subtitle: sourceOption.subtitle,
        }
      }
    }

    return { optionA: translateOption(base.optionA), optionB: translateOption(base.optionB) }
  }

  function getResolvedVoteProps(metricIndex: number) {
    const base = getVoteProps(metricIndex)
    if (!base) return undefined

    const metric = getMetricByIndex(metricIndex)
    if (!metric) return base

    const metricName = metric.name.toLowerCase() as MetricName

    const resolvedA = resolveDerivedOption(metricIndex, 'a', getWinner)
    if (resolvedA.metricName !== metricName || resolvedA.option !== 'a') {
      const sourceOption = getMetricOption(resolvedA.metricIndex, resolvedA.option.toUpperCase() as 'A' | 'B')
      if (sourceOption) base.titleA = sourceOption.title
    }

    const resolvedB = resolveDerivedOption(metricIndex, 'b', getWinner)
    if (resolvedB.metricName !== metricName || resolvedB.option !== 'b') {
      const sourceOption = getMetricOption(resolvedB.metricIndex, resolvedB.option.toUpperCase() as 'A' | 'B')
      if (sourceOption) base.titleB = sourceOption.title
    }

    return { ...base, titleA: t(base.titleA), titleB: t(base.titleB) }
  }

  function getResolvedVoteData(metricIndex: number) {
    const base = getVoteData(metricIndex)
    if (!base) return undefined

    const metric = getMetricByIndex(metricIndex)
    if (!metric) return base

    const metricName = metric.name.toLowerCase() as MetricName

    const resolvedA = resolveDerivedOption(metricIndex, 'a', getWinner)
    if (resolvedA.metricName !== metricName || resolvedA.option !== 'a') {
      const sourceOption = getMetricOption(resolvedA.metricIndex, resolvedA.option.toUpperCase() as 'A' | 'B')
      if (sourceOption) base.A = { title: sourceOption.title }
    }

    const resolvedB = resolveDerivedOption(metricIndex, 'b', getWinner)
    if (resolvedB.metricName !== metricName || resolvedB.option !== 'b') {
      const sourceOption = getMetricOption(resolvedB.metricIndex, resolvedB.option.toUpperCase() as 'A' | 'B')
      if (sourceOption) base.B = { title: sourceOption.title }
    }

    return { A: translateOption(base.A), B: translateOption(base.B) }
  }

  function resolveSlideSource(
    metricName: MetricName,
    option: 'a' | 'b',
  ): { metricName: MetricName; option: 'a' | 'b' } {
    const metric = getMetricByIndex(
      { cls: 0, fcp: 1, lcp: 2, tbt: 3, si: 4 }[metricName],
    )
    if (!metric) return { metricName, option }

    const resolved = resolveDerivedOption(metric.index, option, getWinner)
    return { metricName: resolved.metricName, option: resolved.option }
  }

  return {
    getResolvedChoiceProps,
    getResolvedVoteProps,
    getResolvedVoteData,
    resolveSlideSource,
  }
}
