<script setup lang="ts">
import { computed } from 'vue'
import { useResolvedMetric } from '../composables/useResolvedMetric'
import { getMetricByIndex } from '../../../shared/metrics-data'
import { FLOOR_POSITIONS } from '../../../shared/floor-positions'

const props = defineProps<{
  metricIndex: number
}>()

const { getResolvedChoiceProps, resolveSlideSource } = useResolvedMetric()
const choiceProps = computed(() => getResolvedChoiceProps(props.metricIndex))

const metricName = computed(() => getMetricByIndex(props.metricIndex)?.name.toLowerCase() ?? '')
const floorA = computed(() => `/floors/floor-${metricName.value}-a.webp`)
const floorB = computed(() => `/floors/floor-${metricName.value}-b.webp`)

const posA = computed(() => {
  const positions = FLOOR_POSITIONS[metricName.value]
  if (!positions) return {}
  const variants = positions.choiceVariants
  if (variants) {
    const resolved = resolveSlideSource(metricName.value as any, 'a')
    const variantKey = `a:${resolved.metricName}:${resolved.option}`
    if (variants[variantKey]) return variants[variantKey]
  }
  return positions.choice.a
})

const posB = computed(() => {
  const positions = FLOOR_POSITIONS[metricName.value]
  if (!positions) return {}
  const variants = positions.choiceVariants
  if (variants) {
    const resolved = resolveSlideSource(metricName.value as any, 'b')
    const variantKey = `b:${resolved.metricName}:${resolved.option}`
    if (variants[variantKey]) return variants[variantKey]
  }
  return positions.choice.b
})
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
