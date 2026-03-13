/**
 * Position/size styles for floor illustrations per metric and context.
 * Uses inline CSS properties instead of utility classes (avoids UnoCSS purge issues).
 * Each metric has a 'choice' and 'vote' entry with styles for options A and B.
 */

interface FloorPosition {
  a: Record<string, string>;
  b: Record<string, string>;
}

interface FloorPositions {
  choice: FloorPosition;
  /** Override choice positions when a derived option resolves to a specific source.
   *  Key format: "option:sourceMetric:sourceOption" e.g. "a:fcp:a" */
  choiceVariants?: Record<string, Record<string, string>>;
  vote: FloorPosition;
  building: FloorPosition;
  mobile: FloorPosition;
}

export const FLOOR_POSITIONS: Record<string, FloorPositions> = {
  cls: {
    choice: {
      a: { top: "59%", left: "13%", transform: "rotate(-13deg)", width: "24%" },
      b: {
        top: "57%",
        right: "11.5%",
        transform: "rotate(14deg)",
        width: "24%",
      },
    },
    vote: {
      a: { top: "8%", left: "1%", transform: "rotate(-22deg)", width: "10%" },
      b: { top: "7%", right: "3%", transform: "rotate(24deg)", width: "10%" },
    },
    building: {
      a: { bottom: "0%", left: "50%", height: "19.6%", width: "auto" },
      b: { bottom: "0%", left: "50%", height: "19.6%", width: "auto" },
    },
    mobile: {
      a: { top: "23%", left: "52%", width: "65%" },
      b: { top: "22%", left: "50%", width: "65%" },
    },
  },
  fcp: {
    choice: {
      a: { top: "62%", left: "13%", transform: "rotate(-14deg)", width: "24%" },
      b: { top: "70%", right: "10%", transform: "rotate(14deg)", width: "26%" },
    },
    vote: {
      a: {
        top: "10%",
        left: "0.5%",
        transform: "rotate(-23deg)",
        width: "12%",
      },
      b: {
        top: "10%",
        right: "1.5%",
        transform: "rotate(24deg)",
        width: "13%",
      },
    },
    building: {
      a: { bottom: "19.2%", left: "50%", height: "10.9%", width: "auto" },
      b: { bottom: "19.2%", left: "50%", height: "10.9%", width: "auto" },
    },
    mobile: {
      a: { top: "29%", left: "52%", width: "65%" },
      b: { top: "29%", left: "50%", width: "69%" },
    },
  },
  lcp: {
    choice: {
      a: { top: "68%", left: "18%", transform: "rotate(-13deg)", width: "15%" },
      b: { top: "58%", right: "14%", transform: "rotate(14deg)", width: "20%" },
    },
    // LCP option A is derived from FCP loser — position differs by title length
    choiceVariants: {
      // FCP:a = "TTFB" (short title) → floor can sit higher
      "a:fcp:a": {
        top: "52%",
        left: "13%",
        transform: "rotate(-13deg)",
        width: "23%",
      },
      // FCP:b = "The critical rendering path" (long title) → keep default lower position
      "a:fcp:b": {
        top: "66%",
        left: "17%",
        transform: "rotate(-13deg)",
        width: "17%",
      },
    },
    vote: {
      a: { top: "6%", left: "1.5%", transform: "rotate(-23deg)", width: "9%" },
      b: { top: "6%", right: "3%", transform: "rotate(24deg)", width: "10%" },
    },
    building: {
      a: { bottom: "29.9%", left: "50%", height: "22%", width: "auto" },
      b: { bottom: "29%", left: "50%", height: "23%", width: "auto" },
    },
    mobile: {
      a: { top: "20%", left: "52%", width: "55%" },
      b: { top: "22%", left: "50%", width: "60%" },
    },
  },
  tbt: {
    choice: {
      a: { top: "56%", left: "16%", transform: "rotate(-14deg)", width: "16%" },
      b: { top: "55%", right: "16%", transform: "rotate(14deg)", width: "16%" },
    },
    vote: {
      a: {
        top: "5.5%",
        left: "2.5%",
        transform: "rotate(-23deg)",
        width: "7%",
      },
      b: { top: "5%", right: "4%", transform: "rotate(24deg)", width: "7%" },
    },
    building: {
      a: { bottom: "51.8%", left: "50%", height: "31%", width: "auto" },
      b: { bottom: "51.8%", left: "50%", height: "31%", width: "auto" },
    },
    mobile: {
      a: { top: "19%", left: "50%", width: "38%" },
      b: { top: "19%", left: "50%", width: "40%" },
    },
  },
  si: {
    choice: {
      a: { top: "56%", left: "16%", transform: "rotate(-14deg)", width: "16%" },
      b: { top: "55%", right: "16%", transform: "rotate(14deg)", width: "16%" },
    },
    vote: {
      a: { top: "6%", left: "1.5%", transform: "rotate(-23deg)", width: "9%" },
      b: { top: "5%", right: "3%", transform: "rotate(24deg)", width: "9%" },
    },
    building: {
      a: { bottom: "82.7%", left: "50%", height: "18%", width: "auto" },
      b: { bottom: "82.6%", left: "50%", height: "18%", width: "auto" },
    },
    mobile: {
      a: { top: "19%", left: "50%", width: "60%" },
      b: { top: "19%", left: "50%", width: "60%" },
    },
  },
};
