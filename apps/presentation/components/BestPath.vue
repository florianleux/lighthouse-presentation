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

const yourPath = computed(() => voteStore.path.map(p => p || '?').join(' → '))

const yourTotal = computed(() => {
  let total = 0
  for (let i = 0; i < 4; i++) {
    const choice = voteStore.path[i]
    if (choice) {
      total += scoreData[i as keyof typeof scoreData][choice as 'A' | 'B']
    } else {
      return '??'
    }
  }
  return total
})

// Chemin optimal : B → A → B → A = 78 + 82 + 89 + 91 = 340
// Ou B → B → A → B = 78 + 88 + 92 + 95 = 353
const optimalPath = 'B → B → A → B'
const optimalScore = 78 + 88 + 92 + 95 // = 353
</script>

<template>
  <div class="grid grid-cols-2 gap-8 pt-4">
    <div>
      <div class="font-bold mb-2">Votre chemin</div>
      <div class="p-4 border rounded text-xl">
        {{ yourPath }}
      </div>
      <div class="mt-2">Score total : {{ yourTotal }}</div>
    </div>
    <div>
      <div class="font-bold mb-2">Chemin optimal</div>
      <div class="p-4 border rounded bg-green-100 text-xl text-green-800">
        {{ optimalPath }}
      </div>
      <div class="mt-2">Score total : {{ optimalScore }}</div>
    </div>
  </div>
</template>
