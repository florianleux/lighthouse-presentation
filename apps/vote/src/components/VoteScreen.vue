<script setup lang="ts">
import { computed } from 'vue'
import type { MetricConfig } from '../../../../shared/metrics-data'
import { getMetricByIndex, resolveDerivedOption } from '../../../../shared/metrics-data'
import { FLOOR_POSITIONS } from '../../../../shared/floor-positions'
import VoteOption from './VoteOption.vue'

const props = defineProps<{
  metric: MetricConfig
  voteWinners: Record<number, 'A' | 'B'>
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
      position: 'top-[5%]',
      bg: '/vote/A.webp',
      floor: `/floors/floor-${metricName.value}-a.webp`,
      floorStyle: FLOOR_POSITIONS[metricName.value]?.mobile.a ?? {},
      title: a.title,
      subtitle: a.subtitle,
    },
    {
      key: 'B' as const,
      position: 'bottom-[5%]',
      bg: '/vote/B.webp',
      floor: `/floors/floor-${metricName.value}-b.webp`,
      floorStyle: FLOOR_POSITIONS[metricName.value]?.mobile.b ?? {},
      title: b.title,
      subtitle: b.subtitle,
    },
  ]
})

function handleVote(choice: 'A' | 'B') {
  emit('vote', choice)
}
</script>

<template>
  <div class="relative w-screen h-dvh overflow-hidden">
    <img
      src="/vote/Bg.webp"
      alt=""
      fetchpriority="high"
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

    <img
      src="/vote/light.webp"
      alt=""
      class="absolute inset-0 w-full h-full object-cover mix-blend-plus-lighter opacity-41 z-999 pointer-events-none"
    />
  </div>
</template>
