<script setup lang="ts">
import { computed } from 'vue'
import { METRICS, type MetricName } from '../../../shared/metrics-data'

const props = defineProps<{
  day: number
  metric: MetricName
}>()

const metricData = computed(() => METRICS[props.metric])
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center">
    <div class="text-2xl opacity-70 mb-4">Day {{ day }}</div>
    <div class="text-8xl font-bold font-title" :style="{ color: metricData.color }">
      {{ metricData.name }}
    </div>
    <div class="text-2xl opacity-70 mt-4">
      {{ metricData.fullName }}
    </div>
  </div>
</template>
