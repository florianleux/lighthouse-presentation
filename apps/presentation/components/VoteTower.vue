<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { voteStore, VOTE_SLIDES } from '../setup/main'

const { currentSlideNo } = useNav()

// Slides où on cache la tour : intro (1-10) + slides de vote
const HIDDEN_SLIDES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...VOTE_SLIDES]

const isVisible = computed(() => !HIDDEN_SLIDES.includes(currentSlideNo.value))

// Labels pour chaque étage (du bas vers le haut)
const floors = [
  { label: 'Perf', index: 0 },
  { label: 'A11y', index: 1 },
  { label: 'BP', index: 2 },
  { label: 'SEO', index: 3 }
]

// Inversé pour afficher du haut vers le bas (SEO en haut)
const floorsReversed = computed(() => [...floors].reverse())

function getChoice(index: number) {
  return voteStore.path[index] || '?'
}

function getColor(index: number) {
  const choice = voteStore.path[index]
  if (!choice) return 'bg-gray-700 text-gray-400'
  if (choice === 'A') return 'bg-blue-600 text-white'
  return 'bg-amber-500 text-white'
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-1"
    >
      <!-- Lanterne (si tous les votes sont faits) -->
      <div
        v-if="voteStore.path.every(p => p !== null)"
        class="w-12 h-6 bg-yellow-400 rounded-t-full flex items-center justify-center text-xs"
      >
        💡
      </div>

      <!-- Étages (SEO en haut, Perf en bas) -->
      <div
        v-for="floor in floorsReversed"
        :key="floor.index"
        class="w-12 h-10 flex flex-col items-center justify-center rounded text-xs font-bold transition-all duration-300"
        :class="getColor(floor.index)"
      >
        <span class="text-[10px] opacity-70">{{ floor.label }}</span>
        <span class="text-lg">{{ getChoice(floor.index) }}</span>
      </div>

      <!-- Fondation -->
      <div class="w-14 h-3 bg-gray-800 rounded-b -mx-1" />
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
