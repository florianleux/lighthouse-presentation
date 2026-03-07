<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'
import { voteStore } from '../setup/main'
import type { MetricName } from '../../../shared/metrics-data'
import { useResolvedMetric } from '../composables/useResolvedMetric'

const props = defineProps<{
  metric: MetricName
  slideIndex: number
}>()

const metricIndexMap: Record<MetricName, number> = {
  cls: 0,
  fcp: 1,
  lcp: 2,
  tbt: 3,
  si: 4,
}

const { resolveSlideSource } = useResolvedMetric()

const winner = computed(() => voteStore.getChoice(metricIndexMap[props.metric]))

const DetailComponent = computed<Component | null>(() => {
  if (!winner.value) return null
  const option = winner.value.toLowerCase() as 'a' | 'b'
  const source = resolveSlideSource(props.metric, option)

  return defineAsyncComponent({
    loader: () =>
      import(`./metrics/${source.metricName}/options/${source.option}/detail-slides/DetailSlide${props.slideIndex}.vue`),
    onError: () => null,
  })
})
</script>

<template>
  <component
    v-if="DetailComponent"
    :is="DetailComponent"
    :key="`${metric}-${winner}-${slideIndex}`"
  />
</template>
