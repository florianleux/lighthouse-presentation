<script setup lang="ts">
import { computed } from 'vue'
import type { MetricConfig } from '../../../../shared/metrics-data'
import { getMetricByIndex, resolveDerivedOption } from '../../../../shared/metrics-data'
import { FLOOR_POSITIONS } from '../../../../shared/floor-positions'
import VoteOption from './VoteOption.vue'

const props = defineProps<{
  metric: MetricConfig
  voteWinners: Record<number, 'A' | 'B'>
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  vote: [choice: 'A' | 'B']
}>()

function resolveOption(option: 'a' | 'b') {
  const resolved = resolveDerivedOption(
    props.metric.index,
    option,
    (idx) => props.voteWinners[idx] ?? null,
  )
  const sourceMetric = getMetricByIndex(resolved.metricIndex)
  const sourceOption = sourceMetric?.options[resolved.option]
  return {
    title: sourceOption?.title ?? '',
    subtitle: sourceOption?.subtitle ?? '',
    metricName: resolved.metricName,
    option: resolved.option,
  }
}

const metricName = computed(() => props.metric.name.toLowerCase())

const options = computed(() => {
  const a = resolveOption('a')
  const b = resolveOption('b')
  return [
    {
      key: 'A' as const,
      position: 'top-[10%]',
      bg: '/vote/A.png',
      floor: `/floors/floor-${metricName.value}-a.png`,
      floorStyle: FLOOR_POSITIONS[metricName.value]?.mobile.a ?? {},
      title: a.title,
      subtitle: a.subtitle,
    },
    {
      key: 'B' as const,
      position: 'bottom-[10%]',
      bg: '/vote/B.png',
      floor: `/floors/floor-${metricName.value}-b.png`,
      floorStyle: FLOOR_POSITIONS[metricName.value]?.mobile.b ?? {},
      title: b.title,
      subtitle: b.subtitle,
    },
  ]
})

function handleVote(choice: 'A' | 'B') {
  if (!props.isSubmitting) {
    emit('vote', choice)
  }
}
</script>

<template>
  <div class="relative w-screen h-dvh overflow-hidden">
    <img
      src="/vote/Bg.png"
      alt=""
      class="absolute inset-0 w-full h-full object-cover z-0"
    />

    <VoteOption
      v-for="opt in options"
      :key="opt.key"
      :class="opt.position"
      :bg="opt.bg"
      :floor="opt.floor"
      :floor-style="opt.floorStyle"
      :title="opt.title"
      :subtitle="opt.subtitle"
      @click="handleVote(opt.key)"
    />

    <p
      v-if="isSubmitting"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-amber-300 z-2"
    >Sending...</p>

    <img
      src="/vote/light.png"
      alt=""
      class="absolute inset-0 w-full h-full object-cover mix-blend-plus-lighter opacity-41 z-999 pointer-events-none"
    />
  </div>
</template>

<style scoped>
.opacity-41 {
  opacity: 0.41;
}

.mix-blend-plus-lighter {
  mix-blend-mode: plus-lighter;
}
</style>
