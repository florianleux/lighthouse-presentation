<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'

// Scores selon le choix A ou B pour chaque vote
const scoreData = {
  0: { A: 72, B: 78 }, // Performance
  1: { A: 82, B: 88 }, // Accessibility
  2: { A: 92, B: 89 }, // Best Practices
  3: { A: 91, B: 95 }  // SEO
}

const scores = computed(() => ({
  performance: voteStore.path[0] ? scoreData[0][voteStore.path[0] as 'A' | 'B'] : '??',
  accessibility: voteStore.path[1] ? scoreData[1][voteStore.path[1] as 'A' | 'B'] : '??',
  bestPractices: voteStore.path[2] ? scoreData[2][voteStore.path[2] as 'A' | 'B'] : '??',
  seo: voteStore.path[3] ? scoreData[3][voteStore.path[3] as 'A' | 'B'] : '??'
}))

const totalScore = computed(() => {
  const s = scores.value
  if (typeof s.performance === 'string') return '??'
  return (s.performance as number) + (s.accessibility as number) + (s.bestPractices as number) + (s.seo as number)
})
</script>

<template>
  <div class="grid grid-cols-2 gap-8 pt-4">
    <div class="flex justify-center items-center">
      <div class="text-9xl">🗼</div>
    </div>
    <div>
      <div class="text-xl font-bold mb-4">Votre chemin</div>
      <div class="flex gap-2 text-2xl mb-6">
        <span :class="voteStore.path[0] === 'A' ? 'text-blue-500' : 'text-amber-500'">{{ voteStore.path[0] || '?' }}</span>
        <span>→</span>
        <span :class="voteStore.path[1] === 'A' ? 'text-blue-500' : 'text-amber-500'">{{ voteStore.path[1] || '?' }}</span>
        <span>→</span>
        <span :class="voteStore.path[2] === 'A' ? 'text-blue-500' : 'text-amber-500'">{{ voteStore.path[2] || '?' }}</span>
        <span>→</span>
        <span :class="voteStore.path[3] === 'A' ? 'text-blue-500' : 'text-amber-500'">{{ voteStore.path[3] || '?' }}</span>
      </div>
      <div class="text-xl font-bold mb-4">Scores finaux <span class="text-base font-normal opacity-70">(total: {{ totalScore }})</span></div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="text-3xl font-bold" :class="typeof scores.performance === 'number' ? 'text-green-500' : 'text-gray-400'">{{ scores.performance }}</div>
          <div>Performance</div>
        </div>
        <div>
          <div class="text-3xl font-bold" :class="typeof scores.accessibility === 'number' ? 'text-green-500' : 'text-gray-400'">{{ scores.accessibility }}</div>
          <div>Accessibility</div>
        </div>
        <div>
          <div class="text-3xl font-bold" :class="typeof scores.bestPractices === 'number' ? 'text-green-500' : 'text-gray-400'">{{ scores.bestPractices }}</div>
          <div>Best Practices</div>
        </div>
        <div>
          <div class="text-3xl font-bold" :class="typeof scores.seo === 'number' ? 'text-green-500' : 'text-gray-400'">{{ scores.seo }}</div>
          <div>SEO</div>
        </div>
      </div>
    </div>
  </div>
</template>
