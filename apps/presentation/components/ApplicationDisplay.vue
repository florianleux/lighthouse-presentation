<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'

const props = defineProps<{
  voteIndex: number
  category: string
  floor: string
}>()

// Scores selon le choix A ou B pour chaque vote
const scoreData = {
  0: { // Performance
    A: { score: 72, label: 'Images & Transfer' },
    B: { score: 78, label: 'Fonts & JS' }
  },
  1: { // Accessibility
    A: { score: 82, label: 'Visual' },
    B: { score: 88, label: 'Semantic' }
  },
  2: { // Best Practices
    A: { score: 92, label: 'Console & Security' },
    B: { score: 89, label: 'Modern Standards' }
  },
  3: { // SEO
    A: { score: 91, label: 'Meta & Structure' },
    B: { score: 95, label: 'Content & Links' }
  }
}

const choice = computed(() => voteStore.getChoice(props.voteIndex))

const result = computed(() => {
  const c = choice.value
  if (!c) return { score: '??', label: 'Non voté' }
  return scoreData[props.voteIndex as keyof typeof scoreData][c as 'A' | 'B']
})

// Calcul du path pour l'iframe
const iframePath = computed(() => {
  const path = voteStore.path.slice(0, props.voteIndex + 1)
  if (path.some(p => p === null)) return 'baseline'
  return path.join('').toLowerCase()
})

const iframeUrl = computed(() => `https://${iframePath.value}.blackmarket.com`)
</script>

<template>
  <div class="grid grid-cols-2 gap-4 h-full">
    <div class="border rounded p-4">
      <div class="text-center mb-2">
        BlackMarket
        <span class="text-sm opacity-50 ml-2">({{ iframePath }})</span>
      </div>
      <div class="h-64 bg-gray-100 flex items-center justify-center flex-col gap-2">
        <div class="text-sm opacity-50">iframe</div>
        <code class="text-xs">{{ iframeUrl }}</code>
      </div>
    </div>
    <div class="p-4">
      <div class="text-lg font-bold mb-4">Nouveau score {{ category }}</div>
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
        <div class="text-lg">Phare : {{ floor }}</div>
      </div>
    </div>
  </div>
</template>
