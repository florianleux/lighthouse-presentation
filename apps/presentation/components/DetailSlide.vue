<script setup lang="ts">
import { computed } from 'vue'
import { METRICS, type MetricName } from '../../../shared/metrics-data'

const props = defineProps<{
  metric: MetricName
  option: 'a' | 'b'
}>()

const metricData = computed(() => METRICS[props.metric])
const optionData = computed(() => metricData.value.options[props.option])
</script>

<template>
  <div class="h-full flex flex-col gap-8">
    <div>
      <div class="text-4xl font-title">
        {{ optionData.title }}
      </div>
      <div class="text-left text-lg">
        {{ optionData.subtitle }}
      </div>
    </div>

    <div class="flex-grow">
      <slot />
    </div>
  </div>
</template>
