<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'
import { useResolvedMetric } from '../composables/useResolvedMetric'
import LighthouseBuilding from './LighthouseBuilding.vue'

const props = defineProps<{
  voteIndex: number
}>()

const { getResolvedVoteData } = useResolvedMetric()

const choice = computed(() => voteStore.getChoice(props.voteIndex))
const winner = computed(() => {
  const c = choice.value
  if (!c) return null
  const voteData = getResolvedVoteData(props.voteIndex)
  if (!voteData) return null
  return voteData[c as 'A' | 'B']
})
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/metric-intro-bl.webp');"
  >
    <div
      v-if="choice && winner"
      class="flex flex-col items-left h-full pt-5 text-center"
    >
      <div class="absolute left-[31%] top-[20%] -translate-x-1/2">
        <div>The crew has voted for</div>
        <div class="font-bold font-title text-5xl">{{ winner.title }}</div>
      </div>

      <div class="absolute w-[25.5%] h-[73%] left-[79.6%] top-[10.4%] -translate-x-1/2">
        <LighthouseBuilding />
      </div>
    </div>
    <div
      v-else
      class="mt-4 p-6 border rounded-lg text-center opacity-50"
    >
      No vote recorded - go back to the vote slide
    </div>
  </div>
</template>
