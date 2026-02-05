// ===========================================
// Centralized Metrics Data for Lighthouse Pirates
// Single source of truth for all 5 performance metrics
// ===========================================

// ===========================================
// Type Definitions
// ===========================================

/**
 * Keywords for Choice component (1-4 items)
 */
export type Keywords =
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]

/**
 * A single choice option (A or B) for a metric
 */
export interface MetricOption {
  // For Choice component
  title: string
  subtitle: string
  keywords: Keywords

  // For WinnerDisplay component
  fixes: string[]

  // For ApplicationDisplay and PathDisplay
  score: number | string // Can be number or '[??]' placeholder
  label: string
}

/**
 * Both options for a metric
 */
export interface MetricOptions {
  a: MetricOption
  b: MetricOption
}

/**
 * Business impact case study
 */
export interface BusinessInfo {
  company: string
  comment: string
}

/**
 * Threshold values for metric scoring
 * Can be numbers (e.g., 0.1) or strings (e.g., '1.8 sec')
 */
export type ThresholdValue = number | string

/**
 * Complete metric configuration
 */
export interface MetricConfig {
  // Core identification
  index: number
  name: string // 'CLS', 'FCP', 'LCP', 'TBT', 'SI'
  fullName: string
  weight: number // Percentage (25, 10, 25, 30, 10)
  color: string // Hex color

  // Presentation structure
  day: number // 1-5
  floor: string // 'Floor 1', 'Floor 2', etc.

  // For MetricIntro component
  thresholds: [ThresholdValue, ThresholdValue] // [good, poor] boundaries
  formula: string // h3 prop - description/formula
  tags: string[] // Key points (up to 4)
  businessInfo: BusinessInfo[]

  // Vote options
  options: MetricOptions
}

/**
 * Lowercase metric name keys for API access
 */
export type MetricName = 'cls' | 'fcp' | 'lcp' | 'tbt' | 'si'

/**
 * The full metrics data structure supporting access like METRICS.fcp.options.a.title
 */
export type MetricsData = {
  [K in MetricName]: MetricConfig
}

// ===========================================
// Metrics Configuration Data
// ===========================================

export const METRICS: MetricsData = {
  cls: {
    index: 0,
    name: 'CLS',
    fullName: 'Cumulative Layout Shift',
    weight: 25,
    color: '#f97316',
    day: 1,
    floor: 'Floor 1',
    thresholds: [0.1, 0.25],
    formula: 'Impact fraction × Distance fraction',
    tags: [
      'Core Web Vital: Impact SEO!',
      'High CLS destroys trust',
      'User initiated shifts are excluded',
      'Only the worst burst of shift counts',
    ],
    businessInfo: [
      { company: 'Yahoo! Japan', comment: 'Reduced CLS by 0.2 → 15% increase in page views' },
    ],
    options: {
      a: {
        title: 'First-party assets',
        subtitle: 'Optimize what you control',
        keywords: ['Images', 'Fonts'],
        fixes: [
          '[PLACEHOLDER: Fix 1 for CLS Option A]',
          '[PLACEHOLDER: Fix 2 for CLS Option A]',
          '[PLACEHOLDER: Fix 3 for CLS Option A]',
        ],
        score: '[??]',
        label: 'First-party assets',
      },
      b: {
        title: 'Third-party content',
        subtitle: 'Tame the unpredictable',
        keywords: ['Ads', 'Embeds'],
        fixes: [
          '[PLACEHOLDER: Fix 1 for CLS Option B]',
          '[PLACEHOLDER: Fix 2 for CLS Option B]',
          '[PLACEHOLDER: Fix 3 for CLS Option B]',
        ],
        score: '[??]',
        label: 'Third-party content',
      },
    },
  },

  fcp: {
    index: 1,
    name: 'FCP',
    fullName: 'First Contentful Paint',
    weight: 10,
    color: '#22c55e',
    day: 2,
    floor: 'Floor 2',
    thresholds: ['1.8 sec', '3.0 sec'],
    formula: 'Text, image, SVG or canvas',
    tags: ['All about perception', 'Low FCP is reassuring'],
    businessInfo: [],
    options: {
      a: {
        title: '[PLACEHOLDER Option A]',
        subtitle: '[PLACEHOLDER subtitle]',
        keywords: ['[Keyword 1]', '[Keyword 2]'],
        fixes: [
          '[PLACEHOLDER: Fix 1 for FCP Option A]',
          '[PLACEHOLDER: Fix 2 for FCP Option A]',
          '[PLACEHOLDER: Fix 3 for FCP Option A]',
        ],
        score: '[??]',
        label: '[Option A]',
      },
      b: {
        title: '[PLACEHOLDER Option B]',
        subtitle: '[PLACEHOLDER subtitle]',
        keywords: ['[Keyword 1]', '[Keyword 2]'],
        fixes: [
          '[PLACEHOLDER: Fix 1 for FCP Option B]',
          '[PLACEHOLDER: Fix 2 for FCP Option B]',
          '[PLACEHOLDER: Fix 3 for FCP Option B]',
        ],
        score: '[??]',
        label: '[Option B]',
      },
    },
  },

  lcp: {
    index: 2,
    name: 'LCP',
    fullName: 'Largest Contentful Paint',
    weight: 25,
    color: '#3b82f6',
    day: 3,
    floor: 'Floor 3',
    thresholds: ['2.5 sec', '4.0 sec'],
    formula: 'Time to render largest element',
    tags: [
      'Core Web Vital: Impact SEO!',
      'Measures perceived load speed',
      'Usually hero image or heading',
      'Affected by server response time',
    ],
    businessInfo: [],
    options: {
      a: {
        title: '[PLACEHOLDER Option A]',
        subtitle: '[PLACEHOLDER subtitle]',
        keywords: ['[Keyword 1]', '[Keyword 2]'],
        fixes: [
          '[PLACEHOLDER: Fix 1 for LCP Option A]',
          '[PLACEHOLDER: Fix 2 for LCP Option A]',
          '[PLACEHOLDER: Fix 3 for LCP Option A]',
        ],
        score: '[??]',
        label: '[Option A]',
      },
      b: {
        title: '[PLACEHOLDER Option B]',
        subtitle: '[PLACEHOLDER subtitle]',
        keywords: ['[Keyword 1]', '[Keyword 2]'],
        fixes: [
          '[PLACEHOLDER: Fix 1 for LCP Option B]',
          '[PLACEHOLDER: Fix 2 for LCP Option B]',
          '[PLACEHOLDER: Fix 3 for LCP Option B]',
        ],
        score: '[??]',
        label: '[Option B]',
      },
    },
  },

  tbt: {
    index: 3,
    name: 'TBT',
    fullName: 'Total Blocking Time',
    weight: 30,
    color: '#a855f7',
    day: 4,
    floor: 'Floor 4',
    thresholds: ['200 ms', '600 ms'],
    formula: 'Sum of blocking time beyond 50ms',
    tags: [
      'Lab metric (not field)',
      'Proxy for First Input Delay',
      'Long tasks block main thread',
      'Highest weight in Performance score',
    ],
    businessInfo: [],
    options: {
      a: {
        title: '[PLACEHOLDER Option A]',
        subtitle: '[PLACEHOLDER subtitle]',
        keywords: ['[Keyword 1]', '[Keyword 2]'],
        fixes: [
          '[PLACEHOLDER: Fix 1 for TBT Option A]',
          '[PLACEHOLDER: Fix 2 for TBT Option A]',
          '[PLACEHOLDER: Fix 3 for TBT Option A]',
        ],
        score: '[??]',
        label: '[Option A]',
      },
      b: {
        title: '[PLACEHOLDER Option B]',
        subtitle: '[PLACEHOLDER subtitle]',
        keywords: ['[Keyword 1]', '[Keyword 2]'],
        fixes: [
          '[PLACEHOLDER: Fix 1 for TBT Option B]',
          '[PLACEHOLDER: Fix 2 for TBT Option B]',
          '[PLACEHOLDER: Fix 3 for TBT Option B]',
        ],
        score: '[??]',
        label: '[Option B]',
      },
    },
  },

  si: {
    index: 4,
    name: 'SI',
    fullName: 'Speed Index',
    weight: 10,
    color: '#ec4899',
    day: 5,
    floor: 'Floor 5',
    thresholds: ['3.4 sec', '5.8 sec'],
    formula: 'How quickly content is visually displayed',
    tags: [
      'Measures visual progression',
      'Lower is better',
      'Affected by render-blocking resources',
      'Complements FCP and LCP',
    ],
    businessInfo: [],
    options: {
      a: {
        title: '[PLACEHOLDER Option A]',
        subtitle: '[PLACEHOLDER subtitle]',
        keywords: ['[Keyword 1]', '[Keyword 2]'],
        fixes: [
          '[PLACEHOLDER: Fix 1 for SI Option A]',
          '[PLACEHOLDER: Fix 2 for SI Option A]',
          '[PLACEHOLDER: Fix 3 for SI Option A]',
        ],
        score: '[??]',
        label: '[Option A]',
      },
      b: {
        title: '[PLACEHOLDER Option B]',
        subtitle: '[PLACEHOLDER subtitle]',
        keywords: ['[Keyword 1]', '[Keyword 2]'],
        fixes: [
          '[PLACEHOLDER: Fix 1 for SI Option B]',
          '[PLACEHOLDER: Fix 2 for SI Option B]',
          '[PLACEHOLDER: Fix 3 for SI Option B]',
        ],
        score: '[??]',
        label: '[Option B]',
      },
    },
  },
}

// Export as array for iteration (maintains order by index)
export const METRICS_LIST: readonly MetricConfig[] = [
  METRICS.cls,
  METRICS.fcp,
  METRICS.lcp,
  METRICS.tbt,
  METRICS.si,
] as const

// ===========================================
// Helper Functions
// ===========================================

/**
 * Get metric by index (0-4)
 */
export function getMetricByIndex(index: number): MetricConfig | undefined {
  return METRICS_LIST[index]
}

/**
 * Get metric by name (case-insensitive)
 */
export function getMetricByName(name: string): MetricConfig | undefined {
  const key = name.toLowerCase() as MetricName
  return METRICS[key]
}

/**
 * Get option data for a specific metric and choice
 */
export function getMetricOption(
  metricIndex: number,
  choice: 'A' | 'B' | 'a' | 'b'
): MetricOption | undefined {
  const metric = getMetricByIndex(metricIndex)
  if (!metric) return undefined
  return metric.options[choice.toLowerCase() as 'a' | 'b']
}

/**
 * Get vote data structure for WinnerDisplay component
 * Returns format: { A: { title, fixes }, B: { title, fixes } }
 */
export function getVoteData(metricIndex: number) {
  const metric = getMetricByIndex(metricIndex)
  if (!metric) return undefined
  return {
    A: {
      title: metric.options.a.title,
      fixes: metric.options.a.fixes,
    },
    B: {
      title: metric.options.b.title,
      fixes: metric.options.b.fixes,
    },
  }
}

/**
 * Get score data structure for ApplicationDisplay component
 * Returns format: { A: { score, label }, B: { score, label } }
 */
export function getScoreData(metricIndex: number) {
  const metric = getMetricByIndex(metricIndex)
  if (!metric) return undefined
  return {
    A: {
      score: metric.options.a.score,
      label: metric.options.a.label,
    },
    B: {
      score: metric.options.b.score,
      label: metric.options.b.label,
    },
  }
}

/**
 * Get MetricIntro props for a metric
 */
export function getMetricIntroProps(metricIndex: number) {
  const metric = getMetricByIndex(metricIndex)
  if (!metric) return undefined
  return {
    h1: metric.name,
    h2: metric.fullName,
    weight: metric.weight,
    thresholds: metric.thresholds,
    h3: metric.formula,
    tags: metric.tags,
    businessInfo: metric.businessInfo,
  }
}

/**
 * Get Choice props for a metric
 */
export function getChoiceProps(metricIndex: number) {
  const metric = getMetricByIndex(metricIndex)
  if (!metric) return undefined
  return {
    optionA: {
      title: metric.options.a.title,
      subtitle: metric.options.a.subtitle,
      keywords: metric.options.a.keywords,
    },
    optionB: {
      title: metric.options.b.title,
      subtitle: metric.options.b.subtitle,
      keywords: metric.options.b.keywords,
    },
  }
}

/**
 * Get Vote props for a metric
 */
export function getVoteProps(metricIndex: number) {
  const metric = getMetricByIndex(metricIndex)
  if (!metric) return undefined
  return {
    titleA: metric.options.a.title,
    titleB: metric.options.b.title,
    voteIndex: metric.index,
  }
}

/**
 * Get ApplicationDisplay props for a metric
 */
export function getApplicationDisplayProps(metricIndex: number) {
  const metric = getMetricByIndex(metricIndex)
  if (!metric) return undefined
  return {
    voteIndex: metric.index,
    category: metric.name,
    floor: metric.floor,
  }
}

// ===========================================
// Backward Compatibility
// ===========================================

/**
 * Existing PERFORMANCE_METRICS format for backward compatibility
 * Components can gradually migrate to METRICS
 */
export const PERFORMANCE_METRICS = METRICS_LIST.map((m) => ({
  index: m.index,
  name: m.name,
  fullName: m.fullName,
  weight: m.weight,
  color: m.color,
})) as const
