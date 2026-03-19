<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
  >
    <div class="w-[34%] absolute right-[5%] top-[8.3%] aspect-[1960/1250] -rotate-0.7">
      <BlackMarketIframe
        :url="branchUrl"
        :delay="500"
        :scale="0.3"
      />
    </div>

    <!-- CLS -->
    <div
      class="absolute flex flex-col items-center text-center w-[15%] -translate-x-1/2"
      style="left: 9%; top: 20%"
    >
      <div class="font-title text-7xl text-white">CLS</div>
      <div class="text-red-400 font-body text-3xl">{{ formatValue('CLS', baseline.CLS) }}</div>
      <div
        v-click="1"
        :class="[optimized ? thresholdColor('CLS', optimized.CLS) : '', 'font-bold font-body text-3xl']"
      >
        {{ optimized ? formatValue('CLS', optimized.CLS) : '' }}
      </div>
    </div>

    <!-- FCP -->
    <div
      class="absolute flex flex-col items-center text-center w-[15%] -translate-x-1/2"
      style="left: 27%; top: 20%"
    >
      <div class="font-title text-7xl text-white text-shadow-md text-shadow-black">FCP</div>
      <div class="text-red-400 font-body text-3xl text-shadow-md text-shadow-black">{{ formatValue('FCP', baseline.FCP)
        }}</div>
      <div
        v-click="2"
        :class="[optimized ? thresholdColor('FCP', optimized.FCP) : '', 'font-bold font-body text-3xl text-shadow-md text-shadow-black']"
      >
        {{ optimized ? formatValue('FCP', optimized.FCP) : '' }}
      </div>
    </div>

    <!-- LCP -->
    <div
      class="absolute flex flex-col items-center text-center w-[15%] -translate-x-1/2"
      style="left: 44%; top: 20%"
    >
      <div class="font-title text-7xl text-white text-shadow-md text-shadow-black">LCP</div>
      <div class="text-red-400 font-body text-3xl">{{ formatValue('LCP', baseline.LCP) }}</div>
      <div
        v-click="3"
        :class="[optimized ? thresholdColor('LCP', optimized.LCP) : '', 'font-bold font-body text-3xl']"
      >
        {{ optimized ? formatValue('LCP', optimized.LCP) : '' }}
      </div>
    </div>

    <!-- TBT -->
    <div
      class="absolute flex flex-col items-center text-center w-[15%] -translate-x-1/2"
      style="left: 20%; top: 50%"
    >
      <div class="font-title text-7xl text-white">TBT</div>
      <div class="text-red-400 font-body text-3xl">{{ formatValue('TBT', baseline.TBT) }}</div>
      <div
        v-click="4"
        :class="[optimized ? thresholdColor('TBT', optimized.TBT) : '', 'font-bold font-body text-3xl']"
      >
        {{ optimized ? formatValue('TBT', optimized.TBT) : '' }}
      </div>
    </div>

    <!-- SI -->
    <div
      class="absolute flex flex-col items-center text-center w-[15%] -translate-x-1/2"
      style="left: 32%; top: 50%"
    >
      <div class="font-title text-7xl text-white">SI</div>
      <div class="text-red-400 font-body text-3xl">{{ formatValue('SI', baseline.SI) }}</div>
      <div
        v-click="5"
        :class="[optimized ? thresholdColor('SI', optimized.SI) : '', 'font-bold font-body text-3xl']"
      >
        {{ optimized ? formatValue('SI', optimized.SI) : '' }}
      </div>
    </div>

    <!-- Final Lighthouse score -->
    <div
      v-click="6"
      class="absolute left-[69%] top-[68%] -rotate-2 font-title text-white text-8xl"
    >
      {{ optimized?.perf }}
    </div>
  </div>
</template>
