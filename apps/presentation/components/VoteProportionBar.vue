<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore } from '../setup/main'

const props = withDefaults(defineProps<{
  voteIndex: number
  labelA: string
  labelB: string
  height?: 'sm' | 'md' | 'lg'
}>(), {
  height: 'md'
})

// Get vote counts from sessionStore
const countA = computed(() => sessionStore.voteResults[props.voteIndex]?.A.length ?? 0)
const countB = computed(() => sessionStore.voteResults[props.voteIndex]?.B.length ?? 0)
const totalVotes = computed(() => countA.value + countB.value)

// Calculate raw percentages
const rawPercentageA = computed(() => {
  if (totalVotes.value === 0) return 50
  return (countA.value / totalVotes.value) * 100
})

const rawPercentageB = computed(() => {
  if (totalVotes.value === 0) return 50
  return (countB.value / totalVotes.value) * 100
})

// Proportions for bar widths (with minimum width for visibility)
const MIN_WIDTH = 5
const proportionA = computed(() => {
  if (totalVotes.value === 0) return 50
  if (countA.value === 0) return 0
  if (countB.value === 0) return 100
  return Math.max(MIN_WIDTH, Math.min(100 - MIN_WIDTH, rawPercentageA.value))
})

const proportionB = computed(() => 100 - proportionA.value)

// Display percentages (rounded)
const percentageA = computed(() => Math.round(rawPercentageA.value))
const percentageB = computed(() => Math.round(rawPercentageB.value))

// Height class mapping
const heightClass = computed(() => {
  switch (props.height) {
    case 'sm': return 'h-4'
    case 'lg': return 'h-10'
    default: return 'h-6'
  }
})

const hasVotes = computed(() => totalVotes.value > 0)
</script>

<template>
  <div class="vote-proportion-bar mb-6">
    <!-- Labels row -->
    <div class="flex justify-between mb-2 text-sm font-semibold">
      <span class="text-blue-500">A - {{ labelA }}</span>
      <span class="text-amber-500">B - {{ labelB }}</span>
    </div>

    <!-- Bar container -->
    <div
      class="relative w-full rounded-full overflow-hidden flex"
      :class="[heightClass, { 'opacity-50': !hasVotes }]"
    >
      <!-- Option A (Blue) -->
      <div
        class="flex items-center justify-center transition-all duration-500 ease-out"
        :class="hasVotes ? 'bg-blue-500' : 'bg-gray-500'"
        :style="{ width: proportionA + '%' }"
      >
        <span
          v-if="proportionA > 15 && height !== 'sm'"
          class="text-white font-bold text-sm"
        >
          A
        </span>
      </div>

      <!-- Option B (Amber) -->
      <div
        class="flex items-center justify-center transition-all duration-500 ease-out"
        :class="hasVotes ? 'bg-amber-500' : 'bg-gray-600'"
        :style="{ width: proportionB + '%' }"
      >
        <span
          v-if="proportionB > 15 && height !== 'sm'"
          class="text-white font-bold text-sm"
        >
          B
        </span>
      </div>
    </div>

    <!-- Stats row: counts and percentages -->
    <div class="flex justify-between mt-2 text-sm">
      <div class="text-blue-500 font-medium">
        {{ countA }} votes <span class="text-blue-400">({{ percentageA }}%)</span>
      </div>
      <div class="text-amber-500 font-medium">
        <span class="text-amber-400">({{ percentageB }}%)</span> {{ countB }} votes
      </div>
    </div>
  </div>
</template>

<style scoped>
.vote-proportion-bar div[style*="width"] {
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
