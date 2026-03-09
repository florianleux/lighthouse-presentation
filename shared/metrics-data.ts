// ===========================================
// Centralized Metrics Data for Lighthouse Pirates
// Single source of truth for all 5 performance metrics
// ===========================================

// ===========================================
// Type Definitions
// ===========================================

/**
 * A single choice option (A or B) for a metric
 */
export interface MetricOption {
  title: string;
  subtitle: string;
}

/**
 * Both options for a metric
 */
export interface MetricOptions {
  a: MetricOption;
  b: MetricOption;
}

/**
 * Threshold values for metric scoring
 * Can be numbers (e.g., 0.1) or strings (e.g., '1.8 sec')
 */
export type ThresholdValue = number | string;

/**
 * Complete metric configuration
 */
export interface MetricConfig {
  // Core identification
  index: number;
  name: string; // 'CLS', 'FCP', 'LCP', 'TBT', 'SI'
  fullName: string;
  weight: number; // Percentage (25, 10, 25, 30, 10)

  // For MetricIntro component
  thresholds: [ThresholdValue, ThresholdValue]; // [good, poor] boundaries
  formula: string; // h3 prop - description/formula
  tags: string[]; // Key points (up to 4)
  // Vote options
  options: MetricOptions;
}

/**
 * Lowercase metric name keys for API access
 */
export type MetricName = "cls" | "fcp" | "lcp" | "tbt" | "si";

/**
 * The full metrics data structure supporting access like METRICS.fcp.options.a.title
 */
export type MetricsData = {
  [K in MetricName]: MetricConfig;
};

// ===========================================
// Metrics Configuration Data
// ===========================================

export const METRICS: MetricsData = {
  cls: {
    index: 0,
    name: "CLS",
    fullName: "Cumulative Layout Shift",
    weight: 25,
    thresholds: [0.1, 0.25],
    formula: "Unexpected movement during loading",
    tags: ["Trust killer", "Will impact SEO!"],
    options: {
      a: {
        title: "Content",
        subtitle: "Control what you own",
      },
      b: {
        title: "Ads",
        subtitle: "Tame the injected",
      },
    },
  },

  fcp: {
    index: 1,
    name: "FCP",
    fullName: "First Contentful Paint",
    weight: 10,
    thresholds: ["1.8 sec", "3.0 sec"],
    formula: "Text, image, SVG or canvas",
    tags: ["Is anything happening?", "Low FCP is reassuring"],
    options: {
      a: {
        title: "TTFB",
        subtitle: "Reduce the time of delivery",
      },
      b: {
        title: "The critical rendering path",
        subtitle: "Smooth the painting process",
      },
    },
  },

  lcp: {
    index: 2,
    name: "LCP",
    fullName: "Largest Contentful Paint",
    weight: 25,
    thresholds: ["2.5 sec", "4.0 sec"],
    formula: "Time to render largest element",
    tags: ["Core Web Vital: Impacts SEO!", "Measures perceived load speed"],
    options: {
      a: {
        title: "[PLACEHOLDER Option A]",
        subtitle: "[PLACEHOLDER subtitle]",
      },
      b: {
        title: "Focus on LCP",
        subtitle: "Save effort, target smart",
      },
    },
  },

  tbt: {
    index: 3,
    name: "TBT",
    fullName: "Total Blocking Time",
    weight: 30,
    thresholds: ["200 ms", "600 ms"],
    formula: "Sum of blocking time beyond 50ms",
    tags: [
      "JSON parsing",
      "Layout calculations",
    ],
    options: {
      a: {
        title: "Data Parsimony",
        subtitle: "Don't parse the unnecessary",
      },
      b: {
        title: "Design Sobriety",
        subtitle: "Fancyness has a cost",
      },
    },
  },

  si: {
    index: 4,
    name: "SI",
    fullName: "Speed Index",
    weight: 10,
    thresholds: ["3.4 sec", "5.8 sec"],
    formula: "How quickly content is visually displayed",
    tags: [
      "Total filling speed, not a moment",
      "Lab only, not measured in the field",
    ],
    options: {
      a: {
        title: "Leaner text",
        subtitle: "Compress and trim",
      },
      b: {
        title: "Smarter images",
        subtitle: "Tailored, compressed, intact",
      },
    },
  },
};

// ===========================================
// Derived Options (cross-metric option reuse)
// ===========================================

/**
 * Maps a metric option to the loser of a previous vote.
 * Key format: "metricName:option" (e.g., "lcp:b")
 * Value: sourceMetricIndex of the vote whose loser provides the content
 */
export const DERIVED_OPTIONS: Record<string, { sourceMetricIndex: number }> = {
  "lcp:a": { sourceMetricIndex: 1 }, // LCP option A = FCP loser
};

/**
 * Resolves a potentially derived option to its actual source.
 * If the option is derived (e.g., LCP:A → FCP loser), returns the source metric/option.
 * Otherwise returns the original metric/option unchanged.
 *
 * @param getWinner - callback to retrieve vote winner ('A'|'B'|null) by metric index
 */
export function resolveDerivedOption(
  metricIndex: number,
  option: "a" | "b",
  getWinner: (metricIndex: number) => string | null,
): { metricIndex: number; metricName: MetricName; option: "a" | "b" } {
  const metric = getMetricByIndex(metricIndex);
  if (!metric) return { metricIndex, metricName: "cls", option };

  const metricName = metric.name.toLowerCase() as MetricName;
  const key = `${metricName}:${option}`;
  const derived = DERIVED_OPTIONS[key];

  if (!derived) return { metricIndex, metricName, option };

  const sourceWinner = getWinner(derived.sourceMetricIndex);
  if (!sourceWinner) return { metricIndex, metricName, option };

  const loserOption = sourceWinner === "A" ? "b" : "a";
  const sourceMetric = getMetricByIndex(derived.sourceMetricIndex);
  if (!sourceMetric) return { metricIndex, metricName, option };

  const sourceMetricName = sourceMetric.name.toLowerCase() as MetricName;

  return {
    metricIndex: derived.sourceMetricIndex,
    metricName: sourceMetricName,
    option: loserOption,
  };
}

/**
 * Returns all derived option keys affected by a given source metric index.
 * e.g., getAffectedDerivedKeys(1) → ['lcp:a'] (FCP result affects LCP option A)
 */
export function getAffectedDerivedKeys(sourceMetricIndex: number): string[] {
  return Object.entries(DERIVED_OPTIONS)
    .filter(([, config]) => config.sourceMetricIndex === sourceMetricIndex)
    .map(([key]) => key);
}

// Export as array for iteration (maintains order by index)
export const METRICS_LIST: readonly MetricConfig[] = [
  METRICS.cls,
  METRICS.fcp,
  METRICS.lcp,
  METRICS.tbt,
  METRICS.si,
] as const;

// ===========================================
// Helper Functions
// ===========================================

/**
 * Get metric by index (0-4)
 */
export function getMetricByIndex(index: number): MetricConfig | undefined {
  return METRICS_LIST[index];
}

/**
 * Get metric by name (case-insensitive)
 */
export function getMetricByName(name: string): MetricConfig | undefined {
  const key = name.toLowerCase() as MetricName;
  return METRICS[key];
}

/**
 * Get option data for a specific metric and choice
 */
export function getMetricOption(
  metricIndex: number,
  choice: "A" | "B" | "a" | "b",
): MetricOption | undefined {
  const metric = getMetricByIndex(metricIndex);
  if (!metric) return undefined;
  return metric.options[choice.toLowerCase() as "a" | "b"];
}

/**
 * Get vote data structure for WinnerDisplay component
 * Returns format: { A: { title }, B: { title } }
 */
export function getVoteData(metricIndex: number) {
  const metric = getMetricByIndex(metricIndex);
  if (!metric) return undefined;
  return {
    A: {
      title: metric.options.a.title,
    },
    B: {
      title: metric.options.b.title,
    },
  };
}

/**
 * Get Choice props for a metric
 */
export function getChoiceProps(metricIndex: number) {
  const metric = getMetricByIndex(metricIndex);
  if (!metric) return undefined;
  return {
    optionA: {
      title: metric.options.a.title,
      subtitle: metric.options.a.subtitle,
    },
    optionB: {
      title: metric.options.b.title,
      subtitle: metric.options.b.subtitle,
    },
  };
}

/**
 * Get Vote props for a metric
 */
export function getVoteProps(metricIndex: number) {
  const metric = getMetricByIndex(metricIndex);
  if (!metric) return undefined;
  return {
    titleA: metric.options.a.title,
    titleB: metric.options.b.title,
    voteIndex: metric.index,
  };
}
