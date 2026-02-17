<script setup lang="ts">
import { computed, defineAsyncComponent, watch, onMounted, type Component } from 'vue'
import { voteStore } from '../setup/main'
import type { MetricName } from '../../../shared/metrics-data'

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

const winner = computed(() => voteStore.getChoice(metricIndexMap[props.metric]))

// Set CSS variable for dynamic horizontal transition direction
// Option A: left-to-right = direction 1 (content enters from right)
// Option B: right-to-left = direction -1 (content enters from left)
const updateSlideDirection = () => {
  if (props.slideIndex >= 3) {
    const option = winner.value?.toLowerCase()
    const direction = option === 'a' ? '1' : '-1'
    document.documentElement.style.setProperty('--slide-direction', direction)
  }
}

watch(winner, updateSlideDirection, { immediate: true })
onMounted(updateSlideDirection)

const DetailComponent = computed<Component | null>(() => {
  if (!winner.value) return null
  const option = winner.value.toLowerCase() as 'a' | 'b'

  return defineAsyncComponent({
    loader: () =>
      import(`./metrics/${props.metric}/options/${option}/detail-slides/DetailSlide${props.slideIndex}.vue`),
    onError: () => null,
  })
})
</script>

<template>
  <component v-if="DetailComponent" :is="DetailComponent" />
</template>
