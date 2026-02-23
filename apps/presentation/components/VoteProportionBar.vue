<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore } from '../setup/main'

const props = defineProps<{
  voteIndex: number
  labelA: string
  labelB: string
}>()

// Get vote counts from sessionStore
const countA = computed(() => sessionStore.voteResults[props.voteIndex]?.A.length ?? 0)
const countB = computed(() => sessionStore.voteResults[props.voteIndex]?.B.length ?? 0)
const totalVotes = computed(() => countA.value + countB.value)

// Calculate raw percentage for A (B is derived)
const rawPercentageA = computed(() => {
  if (totalVotes.value === 0) return 50
  return (countA.value / totalVotes.value) * 100
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
const percentageB = computed(() => 100 - percentageA.value)

const hasVotes = computed(() => totalVotes.value > 0)
</script>

<template>
  <div class="vote-proportion-bar mb-6">

    <!-- Bar container -->
    <div
      class="absolute top-[73.3%] right-[24.32%] left-[24.7%] bottom-[10.9%] overflow-hidden flex"
      :class="{ 'opacity-50': !hasVotes }"
    >
      <!-- Option A (Blue) -->
      <div
        class="flex items-center justify-center transition-all duration-500 ease-out"
        :class="hasVotes ? 'bg-option-a' : 'bg-gray-500'"
        :style="{ width: proportionA + '%' }"
      >
        <span
          v-if="proportionA > 15"
          class="text-white font-bold text-5xl"
        >
          A
        </span>
      </div>

      <!-- Option B (Amber) -->
      <div
        class="flex items-center justify-center transition-all duration-500 ease-out"
        :class="hasVotes ? 'bg-option-b' : 'bg-gray-600'"
        :style="{ width: proportionB + '%' }"
      >
        <span
          v-if="proportionB > 15"
          class="text-white font-bold text-5xl"
        >
          B
        </span>
      </div>
    </div>


    <div class=" absolute bottom-[10%] -translate-x-1/2 left-[11%] text-option-a text-center">
      <div class="font-title text-6xl">{{ hasVotes ? percentageA + '%' : '-' }}</div>
      <div
        v-if="hasVotes"
        class="-mt-2 text-xl"
      >{{ countA }} votes</div>
    </div>
    <div class="absolute bottom-[10%] right-[11%] translate-x-1/2 text-option-b text-center">
      <div class="font-title text-6xl">{{ hasVotes ? percentageB + '%' : '-' }}</div>
      <div
        v-if="hasVotes"
        class="-mt-2 text-xl"
      >{{ countB }} votes</div>
    </div>
  </div>

</template>
