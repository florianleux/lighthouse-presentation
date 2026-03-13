<script setup lang="ts">
import { computed } from 'vue'
import { METRICS, type MetricName } from '../../../shared/metrics-data'

const props = defineProps<{
  metric: MetricName
}>()

const metricData = computed(() => METRICS[props.metric])

const formulaClick = 2
const thresholdClick = 3
const baselineClick = 4

// Baseline logo position on the threshold bar (%)
// Bar: 0–33% = Good, 33–66% = Average, 66–100% = Poor
const baselinePosition = computed(() => {
  const m = metricData.value
  const [good, poor] = m.thresholdsMs
  const v = m.baseline
  if (v <= good) return (v / good) * 33
  if (v <= poor) return 33 + ((v - good) / (poor - good)) * 33
  // Beyond poor: extend proportionally but cap at 97%
  return Math.min(97, 66 + ((v - poor) / (poor - good)) * 33)
})

const baselineLabel = computed(() => {
  const v = metricData.value.baseline
  if (metricData.value.name === 'CLS') return v.toFixed(2)
  if (v >= 1000) return (v / 1000).toFixed(1) + ' s'
  return v + ' ms'
})
</script>

<template :key="metricData.name">
  <div class="grid grid-cols-3 gap-8 h-full pt-6 pl-10 pr-5 pb-6">
    <div :class="[$slots.right ? 'col-span-2' : 'col-span-3', 'flex flex-col justify-between']">
      <div>
        <div class="flex justify-between items-baseline">
          <div>
            <span class="!m-0 text-7xl font-bold font-title">{{ metricData.name }}</span>
            <span class="ml-4 text-3xl italic">{{ metricData.fullName }}</span>
          </div>
          <div
            v-click="1"
            class="text-orange-black font-bold text-6xl"
          >{{ metricData.weight }}%</div>
        </div>

        <div
          v-click="formulaClick"
          class="mt-25 text-5xl font-bold text-center"
        >{{ metricData.formula }}</div>

        <div
          v-click="thresholdClick"
          class="relative mt-25"
        >
          <div class="flex rounded overflow-hidden h-8 mt-8">
            <div
              class="bg-green-500 border-1 border-r-0 border-green-800 font-bold text-green-900 text-bold flex-1 flex items-center justify-center text-2xl"
            >Good</div>
            <div
              class="bg-orange-500 border-y-1 border-orange-800 text-orange-900 font-bold flex-1 flex items-center justify-center text-2xl"
            >Average</div>
            <div
              class="bg-red-500 border-1 border-l-0 border-red-800 text-red-900 font-bold flex-1 flex items-center justify-center text-2xl"
            >Poor</div>
          </div>
          <span
            class="absolute text-black text-shadow- font-title font-bold text-3xl"
            style="left: 33%; top: 180%; transform: translate(-50%, -50%)"
          >{{ metricData.thresholds[0] }}</span>
          <span
            class="absolute text-black font-title font-bold text-3xl"
            style="left: 66%; top: 180%; transform: translate(-50%, -50%)"
          >{{ metricData.thresholds[1] }}</span>

          <!-- Baseline logo marker -->
          <div
            p
            v-click="baselineClick"
            class="absolute flex flex-col items-center"
            :style="{
              left: baselinePosition + '%',
              top: '-20%',
              transform: 'translate(-50%, -50%)',
            }"
          >

            <span class="text-3xl font-bold font-title mt-2 whitespace-nowrap">{{ baselineLabel }}</span>
            <img
              src="/images/bm-logo.png"
              alt="BM"
              class="h-7 w-7 drop-shadow-md"
            >
          </div>
        </div>


      </div>


    </div>

    <div
      v-if="$slots.right"
      v-click="2"
      class="col-span-1 flex items-center justify-center"
    >
      <slot name="right" />
    </div>
  </div>
</template>
