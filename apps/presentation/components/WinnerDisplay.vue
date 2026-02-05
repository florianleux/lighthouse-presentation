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
    class="mt-4"
  >
    <div class="text-lg mb-4 flex flex-col items-center">
      <div>The crew has voted for</div>
      <div class="font-bold font-title text-5xl ">{{ winner.title }}</div>
    </div>
    <div
      class="p-6 border-2 rounded-lg"
      :class="choice === 'A' ? 'border-blue-500' : 'border-amber-500'"
    >
      <div class="text-xl font-bold mb-4">{{ winner.title }}</div>
      <ul class="space-y-2">
        <li
          v-for="fix in winner.fixes"
          :key="fix"
          class="flex items-start gap-2"
        >
          <span class="text-green-500">✓</span>
          <span>{{ fix }}</span>
        </li>
      </ul>
    </div>
  </div>
  <div
    v-else
    class="mt-4 p-6 border rounded-lg text-center opacity-50"
  >
    No vote recorded - go back to the vote slide
  </div>
</template>
