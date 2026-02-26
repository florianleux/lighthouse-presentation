<script setup lang="ts">
import { computed } from 'vue'
import { METRICS, type MetricName } from '../../../shared/metrics-data'
import LighthouseBuilding from './LighthouseBuilding.vue'

const props = defineProps<{
  day: number
  metric: MetricName
}>()

const metricData = computed(() => METRICS[props.metric])
</script>

<template>
  <div
    class="relative slide-bg text-shadow-md"
    style="background-image: url('/backgrounds/day-intro.png')"
  >
    <div class="absolute">
      <div class="text-4xl text-[#F9A8C2] ">Day {{ day }}/5</div>
      <div class="text-9xl mt-4 text-white font-bold font-title">
        {{ metricData.name }}
      </div>
      <div class="text-3xl text-white -mt-4">
        {{ metricData.fullName }}
      </div>
    </div>

    <!-- Lighthouse building showing progress -->
    <div class="absolute left-[84.5%] bottom-[18%] top-[4%] -translate-x-1/2 h-[78%] w-[50%]">
      <LighthouseBuilding />
    </div>
  </div>
</template>
