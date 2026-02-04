<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'

const props = defineProps<{
  voteIndex: number
  category: string
  floor: string
}>()

// Placeholder scores for 4 Performance metrics (CLS, LCP, FCP, TBT)
// Note: These are "invented" scores for thought exercise purposes
const scoreData = {
  0: { // CLS - Cumulative Layout Shift
    A: { score: '[??]', label: '[Option A]' },
    B: { score: '[??]', label: '[Option B]' }
  },
  1: { // LCP - Largest Contentful Paint
    A: { score: '[??]', label: '[Option A]' },
    B: { score: '[??]', label: '[Option B]' }
  },
  2: { // FCP - First Contentful Paint
    A: { score: '[??]', label: '[Option A]' },
    B: { score: '[??]', label: '[Option B]' }
  },
  3: { // TBT - Total Blocking Time
    A: { score: '[??]', label: '[Option A]' },
    B: { score: '[??]', label: '[Option B]' }
  }
}

const choice = computed(() => voteStore.getChoice(props.voteIndex))

const result = computed(() => {
  const c = choice.value
  if (!c) return { score: '??', label: 'Non voté' }
  return scoreData[props.voteIndex as keyof typeof scoreData][c as 'A' | 'B']
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
