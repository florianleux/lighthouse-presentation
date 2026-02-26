<script setup lang="ts">
import { computed } from 'vue'
import { useResolvedMetric } from '../composables/useResolvedMetric'
import { getMetricByIndex } from '../../../shared/metrics-data'
import { FLOOR_POSITIONS } from '../../../shared/floor-positions'

const props = defineProps<{
  metricIndex: number
}>()

const { getResolvedChoiceProps } = useResolvedMetric()
const choiceProps = computed(() => getResolvedChoiceProps(props.metricIndex))

const metricName = computed(() => getMetricByIndex(props.metricIndex)?.name.toLowerCase() ?? '')
const floorA = computed(() => `/floors/floor-${metricName.value}-a.png`)
const floorB = computed(() => `/floors/floor-${metricName.value}-b.png`)
const posA = computed(() => FLOOR_POSITIONS[metricName.value]?.choice.a ?? {})
const posB = computed(() => FLOOR_POSITIONS[metricName.value]?.choice.b ?? {})
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/metric-intro-tr.webp');"
  >
    <Choice
      v-if="choiceProps"
      :option-a="choiceProps.optionA"
      :option-b="choiceProps.optionB"
    />

    <img
      :src="floorA"
      class="absolute"
      :style="posA"
      alt=""
    />
    <img
      :src="floorB"
      class="absolute"
      :style="posB"
      alt=""
    />
  </div>
</template>
