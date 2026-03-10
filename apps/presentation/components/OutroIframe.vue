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
  if (revealedCount.value <= metricKeys.length) {
    revealedCount.value++
  }
}

function formatValue(key: string, value: number): string {
  if (key === 'CLS') return value.toFixed(2)
  if (value >= 1000) return (value / 1000).toFixed(1) + ' s'
  return value + ' ms'
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

    <!-- Metrics comparison -->
    <div
      class="absolute left-[4%] top-[15%] flex flex-col gap-3 text-white"
    >
      <div
        v-for="(key, i) in metricKeys"
        :key="key"
        class="flex items-center gap-4 text-lg"
      >
        <span class="w-12 font-bold font-title">{{ key }}</span>
        <span class="w-28 text-right font-body">{{ formatValue(key, baseline[key]) }}</span>

        <Transition name="fade">
          <span v-if="revealedCount > i && optimized" class="flex items-center gap-2">
            <span class="opacity-50">→</span>
            <span class="font-bold font-body">{{ formatValue(key, optimized[key]) }}</span>
          </span>
        </Transition>
      </div>

      <!-- Performance score -->
      <div class="flex items-center gap-4 text-xl mt-2 border-t border-white/20 pt-2">
        <span class="w-12 font-bold font-title">Perf</span>
        <span class="w-28 text-right font-body">{{ baseline.perf }}</span>

        <Transition name="fade">
          <span v-if="revealedCount > metricKeys.length && optimized" class="flex items-center gap-2">
            <span class="opacity-50">→</span>
            <span class="font-bold font-body text-2xl">{{ optimized.perf }}</span>
          </span>
        </Transition>
      </div>
    </div>
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
