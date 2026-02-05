<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'
import { getVoteData } from '../../../shared/metrics-data'

const props = defineProps<{
  voteIndex: number
}>()

const choice = computed(() => voteStore.getChoice(props.voteIndex))
const winner = computed(() => {
  const c = choice.value
  if (!c) return null
  const voteData = getVoteData(props.voteIndex)
  if (!voteData) return null
  return voteData[c as 'A' | 'B']
})
</script>

<template>
  <div
    v-if="choice && winner"
    class=" flex flex-col items-left h-full"
  >
    <div>The crew has voted for</div>
    <div class="font-bold font-title text-5xl ">{{ winner.title }}</div>

    <div class="absolute right-20 bottom-20">
      <VoteTower />
    </div>

  </div>
  <div
    v-else
    class="mt-4 p-6 border rounded-lg text-center opacity-50"
  >
    No vote recorded - go back to the vote slide
  </div>
</template>
