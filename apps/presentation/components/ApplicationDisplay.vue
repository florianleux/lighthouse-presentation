<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'
import { getScoreData } from '../../../shared/metrics-data'

const props = defineProps<{
  voteIndex: number
  category: string
  floor: string
}>()

const choice = computed(() => voteStore.getChoice(props.voteIndex))

const result = computed(() => {
  const c = choice.value
  if (!c) return { score: '??', label: 'Non voté' }
  const scoreData = getScoreData(props.voteIndex)
  if (!scoreData) return { score: '??', label: 'Non voté' }
  return scoreData[c as 'A' | 'B']
})

// Single URL - no more branch system
const iframeUrl = computed(() => 'https://blackmarket.com')
</script>

<template>
  <div class="grid grid-cols-2 gap-4 h-full">
    <div class="border rounded p-4">
      <div class="text-center mb-2">
        BlackMarket
      </div>
      <div class="h-64 bg-gray-100 flex items-center justify-center flex-col gap-2">
        <div class="text-sm opacity-50">iframe</div>
        <code class="text-xs">{{ iframeUrl }}</code>
      </div>
    </div>
    <div class="p-4">
      <div class="text-lg font-bold mb-4">{{ category }} improvement</div>
      <div
        class="text-5xl font-bold"
        :class="choice ? 'text-green-500' : 'text-gray-400'"
      >
        {{ result.score }}
      </div>
      <div v-if="choice" class="mt-2 text-sm opacity-70">
        Option {{ choice }} : {{ result.label }}
      </div>
      <div class="mt-8">
        <div class="text-lg">Lighthouse : {{ floor }}</div>
      </div>
    </div>
  </div>
</template>
