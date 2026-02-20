<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'
import { METRICS_LIST } from '../../../shared/metrics-data'

// Floors from metrics data (CLS, FCP, LCP, TBT, SI)
const floors = METRICS_LIST.map(m => ({
  label: m.name,
  index: m.index,
}))

// Reversed for display (SI at top, CLS at bottom)
const floorsReversed = computed(() => [...floors].reverse())

function getChoice(index: number) {
  return voteStore.path[index] || '?'
}

function getColor(index: number) {
  const choice = voteStore.path[index]
  if (!choice) return 'bg-gray-700 text-gray-400'
  if (choice === 'A') return 'bg-blue-600 text-white'
  return 'bg-option-b text-white'
}
</script>

<template>
  <div class="h-full flex flex-col gap-1">
    <!-- Lanterne (si tous les votes sont faits) -->
    <div
      v-if="voteStore.path.every(p => p !== null)"
      class="w-12 h-6 shrink-0 bg-yellow-400 rounded-t-full flex items-center justify-center text-xs"
    >
      💡
    </div>

    <!-- Étages (SI en haut, CLS en bas) -->
    <div
      v-for="floor in floorsReversed"
      :key="floor.index"
      class="w-12 flex-1 flex flex-col items-center justify-center rounded text-xs font-bold transition-all duration-300"
      :class="getColor(floor.index)"
    >
      <span class="text-[10px] opacity-70">{{ floor.label }}</span>
      <span class="text-lg">{{ getChoice(floor.index) }}</span>
    </div>

    <!-- Fondation -->
    <div class="w-14 h-3 shrink-0 bg-gray-800 rounded-b -mx-1" />
  </div>
</template>
