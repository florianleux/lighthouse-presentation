<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { voteStore } from '../setup/main'
import BlackMarketIframe from './BlackMarketIframe.vue'
import { METRICS_LIST } from '../../../shared/metrics-data'

// CLS = vote index 0, TBT = vote index 3
// Visual branches: {cls}-{tbt} → a-a, a-b, b-a, b-b
const branchUrl = computed(() => {
  const cls = (voteStore.getChoice(0) || 'A').toLowerCase()
  const tbt = (voteStore.getChoice(3) || 'A').toLowerCase()
  return `https://${cls}-${tbt}--blackmarket-lighthouse.netlify.app`
})

interface ScoreEntry {
  FCP: number
  LCP: number
  TBT: number
  CLS: number
  SI: number
  perf: number
}

const scores = ref<Record<string, ScoreEntry> | null>(null)

onMounted(async () => {
  const res = await fetch('/data/lighthouse-scores.json')
  scores.value = await res.json()
})

const votePath = computed(() => {
  const cls = voteStore.getChoice(0) || 'A'
  const fcp = voteStore.getChoice(1) || 'A'
  const lcp = voteStore.getChoice(2) || 'A'
  const tbt = voteStore.getChoice(3) || 'A'
  const si = voteStore.getChoice(4) || 'A'
  return `${cls}${fcp}${lcp}${tbt}${si}`
})

// Baseline from metrics-data.ts (single source of truth)
const baseline: ScoreEntry = {
  CLS: METRICS_LIST[0].baseline,
  FCP: METRICS_LIST[1].baseline,
  LCP: METRICS_LIST[2].baseline,
  TBT: METRICS_LIST[3].baseline,
  SI: METRICS_LIST[4].baseline,
  perf: 38,
}

const optimized = computed(() => scores.value?.[votePath.value] ?? null)

const metricKeys = ['CLS', 'FCP', 'LCP', 'TBT', 'SI'] as const

const revealedCount = ref(0)

function revealNext() {
  if (revealedCount.value <= metricKeys.length + 1) {
    revealedCount.value++
  }
}

const metricPositions = [
  { left: '15%', top: '15%' },
  { left: '26%', top: '15%' },
  { left: '37%', top: '15%' },
  { left: '20%', top: '45%' },
  { left: '32%', top: '45%' },
]

function formatValue(key: string, value: number): string {
  if (key === 'CLS') return value.toFixed(2)
  if (value >= 1000) return (value / 1000).toFixed(1) + ' s'
  return value + ' ms'
}
function thresholdColor(key: string, value: number): string {
  const metric = METRICS_LIST.find(m => m.name === key)
  if (!metric) return 'text-white'
  const [good, poor] = metric.thresholdsMs
  if (value <= good) return 'text-green-400'
  if (value <= poor) return 'text-orange-400'
  return 'text-red-400'
}
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/end-bottom-right.webp')"
    @click="revealNext"
  >
    <div class="w-[34%] absolute right-[5%] top-[8.3%] aspect-[1960/1250] -rotate-0.7">
      <BlackMarketIframe
        :url="branchUrl"
        :delay="500"
        :scale="0.3"
      />
    </div>

    <!-- Metric cards -->
    <div
      v-for="(key, i) in metricKeys"
      :key="key"
      class="absolute flex flex-col items-center text-center w-[15%] -translate-x-1/2"
      :style="{ left: metricPositions[i].left, top: metricPositions[i].top }"
    >
      <div class="font-title text-6xl text-white">{{ key }}</div>
      <div class="text-red-400 font-body text-2xl">{{ formatValue(key, baseline[key]) }}</div>
      <Transition name="fade">
        <div
          v-if="revealedCount > i && optimized"
          :class="[thresholdColor(key, optimized[key]), 'font-bold font-body text-2xl']"
        >
          {{ formatValue(key, optimized[key]) }}
        </div>
      </Transition>
    </div>

    <!-- Final Lighthouse score -->
    <Transition name="fade">
      <div
        v-if="revealedCount > metricKeys.length && optimized"
        class="absolute left-[69%] top-[68%] -rotate-2 font-title text-white text-8xl"
      >
        {{ optimized.perf }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active {
  transition: all 0.4s ease-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
