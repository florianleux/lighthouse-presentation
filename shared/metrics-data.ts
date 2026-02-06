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
      },
      b: {
        title: 'Third-party content',
        subtitle: 'Tame the unpredictable',
        keywords: ['Ads', 'Embeds'],
      },
    },
  },

  fcp: {
    index: 1,
    name: 'FCP',
    fullName: 'First Contentful Paint',
    weight: 10,
    thresholds: ['1.8 sec', '3.0 sec'],
    formula: 'Text, image, SVG or canvas',
    tags: ['All about perception', 'Low FCP is reassuring'],
    businessInfo: [],
    options: {
      a: {
        title: 'TTFB',
        subtitle: 'Reduce the time of delivery',
        keywords: ['Shorten distances', 'Minimize lost time'],
      },
      b: {
        title: 'The critical rendering path',
        subtitle: 'Smooth the painting process',
        keywords: ['Rendering blockers', 'Parsing blockers'],
      },
    },
  },

  lcp: {
    index: 2,
    name: 'LCP',
    fullName: 'Largest Contentful Paint',
    weight: 25,
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
      },
      b: {
        title: '[PLACEHOLDER Option B]',
        subtitle: '[PLACEHOLDER subtitle]',
        keywords: ['[Keyword 1]', '[Keyword 2]'],
      },
    },
  },

  tbt: {
    index: 3,
    name: 'TBT',
    fullName: 'Total Blocking Time',
    weight: 30,
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
      },
      b: {
        title: '[PLACEHOLDER Option B]',
        subtitle: '[PLACEHOLDER subtitle]',
        keywords: ['[Keyword 1]', '[Keyword 2]'],
      },
    },
  },

  si: {
    index: 4,
    name: 'SI',
    fullName: 'Speed Index',
    weight: 10,
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
      },
      b: {
        title: '[PLACEHOLDER Option B]',
        subtitle: '[PLACEHOLDER subtitle]',
        keywords: ['[Keyword 1]', '[Keyword 2]'],
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
 * Returns format: { A: { title }, B: { title } }
 */
export function getVoteData(metricIndex: number) {
  const metric = getMetricByIndex(metricIndex)
  if (!metric) return undefined
  return {
    A: {
      title: metric.options.a.title,
    },
    B: {
      title: metric.options.b.title,
    },
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
