// ===========================================
// Données centralisées des métriques pour Lighthouse Pirates
// Source unique de vérité pour les 5 métriques de performance
// ===========================================

// ===========================================
// Type Definitions
// ===========================================

/**
 * A single choice option (A or B) for a metric
 */
export interface MetricOption {
  title: string; // clé i18n (ex. "metrics.cls.options.a.title")
  subtitle: string; // clé i18n
}

/**
 * Both options for a metric
 */
export interface MetricOptions {
  a: MetricOption;
  b: MetricOption;
}

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
  thresholdsMs: [number, number]; // [good, poor] in ms (or raw for CLS) — formatés via shared/i18n/format
  baseline: number; // baseline value in ms (or raw for CLS)
  formula: string; // clé i18n — description/formula
  tags: string[]; // clés i18n — key points (up to 4)
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
    thresholdsMs: [0.1, 0.25],
    baseline: 0.35,
    formula: "metrics.cls.formula",
    tags: ["metrics.cls.tags.0", "metrics.cls.tags.1"],
    options: {
      a: {
        title: "metrics.cls.options.a.title",
        subtitle: "metrics.cls.options.a.subtitle",
      },
      b: {
        title: "metrics.cls.options.b.title",
        subtitle: "metrics.cls.options.b.subtitle",
      },
    },
  },

  fcp: {
    index: 1,
    name: "FCP",
    fullName: "First Contentful Paint",
    weight: 10,
    thresholdsMs: [1800, 3000],
    baseline: 6000,
    formula: "metrics.fcp.formula",
    tags: ["metrics.fcp.tags.0", "metrics.fcp.tags.1"],
    options: {
      a: {
        title: "metrics.fcp.options.a.title",
        subtitle: "metrics.fcp.options.a.subtitle",
      },
      b: {
        title: "metrics.fcp.options.b.title",
        subtitle: "metrics.fcp.options.b.subtitle",
      },
    },
  },

  lcp: {
    index: 2,
    name: "LCP",
    fullName: "Largest Contentful Paint",
    weight: 25,
    thresholdsMs: [2500, 4000],
    baseline: 15000,
    formula: "metrics.lcp.formula",
    tags: ["metrics.lcp.tags.0", "metrics.lcp.tags.1"],
    options: {
      a: {
        title: "metrics.lcp.options.a.title",
        subtitle: "metrics.lcp.options.a.subtitle",
      },
      b: {
        title: "metrics.lcp.options.b.title",
        subtitle: "metrics.lcp.options.b.subtitle",
      },
    },
  },

  tbt: {
    index: 3,
    name: "TBT",
    fullName: "Total Blocking Time",
    weight: 30,
    thresholdsMs: [200, 600],
    baseline: 750,
    formula: "metrics.tbt.formula",
    tags: ["metrics.tbt.tags.0", "metrics.tbt.tags.1"],
    options: {
      a: {
        title: "metrics.tbt.options.a.title",
        subtitle: "metrics.tbt.options.a.subtitle",
      },
      b: {
        title: "metrics.tbt.options.b.title",
        subtitle: "metrics.tbt.options.b.subtitle",
      },
    },
  },

  si: {
    index: 4,
    name: "SI",
    fullName: "Speed Index",
    weight: 10,
    thresholdsMs: [3400, 5800],
    baseline: 6500,
    formula: "metrics.si.formula",
    tags: ["metrics.si.tags.0", "metrics.si.tags.1"],
    options: {
      a: {
        title: "metrics.si.options.a.title",
        subtitle: "metrics.si.options.a.subtitle",
      },
      b: {
        title: "metrics.si.options.b.title",
        subtitle: "metrics.si.options.b.subtitle",
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
