<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'
import { PATCH_DATA, type PatchExplanation } from '../../../shared/patchData'

const props = defineProps<{
  voteIndex: number
  patchIndex: number
}>()

// Get the winning choice (A or B)
const choice = computed(() => voteStore.getChoice(props.voteIndex))

// Get the patch data for the winning option
const patch = computed<PatchExplanation | null>(() => {
  const c = choice.value
  if (!c) return null

  const voteData = PATCH_DATA[props.voteIndex]
  if (!voteData) return null

  return voteData[c as 'A' | 'B'].patches[props.patchIndex]
})

// Category names for display
const categoryNames = ['Performance', 'Accessibility', 'Best Practices', 'SEO']
const categoryName = computed(() => categoryNames[props.voteIndex])

// Impact badge colors
function getImpactClasses(impact: 'high' | 'medium' | 'low'): string {
  switch (impact) {
    case 'high':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'medium':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'low':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  }
}
</script>

<template>
  <div
    v-if="patch"
    class="h-full flex flex-col px-4"
  >
    <!-- Header -->
    <div class="mb-3">
      <div class="text-sm opacity-60 mb-1 flex items-center gap-2">
        <span>{{ categoryName }}</span>
        <span
          class="text-xs px-2 py-0.5 rounded-full border"
          :class="choice === 'A' ? 'border-blue-500 text-blue-400' : 'border-amber-500 text-amber-400'"
        >
          Option {{ choice }}
        </span>
        <span>Patch {{ patchIndex + 1 }}/3</span>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="flex gap-6 flex-1 min-h-0">
      <!-- Left Column: Text Content -->
      <div class="flex-1 flex flex-col">
        <h2 class="text-2xl font-bold mb-1">{{ patch.title }}</h2>
        <p class="text-base opacity-70 mb-4">{{ patch.summary }}</p>

        <!-- Why It Matters -->
        <div class="mb-4">
          <div class="text-sm font-semibold mb-2">Why it matters</div>
          <ul class="space-y-1">
            <li
              v-for="point in patch.whyMatters"
              :key="point"
              class="flex items-start gap-2 text-sm"
            >
              <span class="text-blue-400 mt-0.5">*</span>
              <span class="opacity-90">{{ point }}</span>
            </li>
          </ul>
        </div>

        <!-- Lighthouse Metrics Impact -->
        <div class="flex gap-2 flex-wrap">
          <div
            v-for="m in patch.metrics"
            :key="m.metric"
            class="px-2 py-1.5 border rounded-lg text-sm"
            :class="getImpactClasses(m.impact)"
          >
            <div class="flex items-center gap-1.5">
              <span class="font-bold">{{ m.metric }}</span>
              <span
                class="text-xs px-1.5 py-0.5 rounded-full border"
                :class="getImpactClasses(m.impact)"
              >
                {{ m.impact }}
              </span>
            </div>
            <div class="text-xs opacity-80 mt-0.5">{{ m.description }}</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Code Before/After Stacked -->
      <div class="w-1/2 flex flex-col gap-3">
        <!-- Before -->
        <div>
          <div class="text-sm font-semibold text-red-400 mb-1 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-red-500"></span>
            Before
          </div>
          <pre class="p-2 bg-red-900/10 border border-red-500/20 rounded text-xs"><code>{{ patch.before.code }}</code></pre>
        </div>
        <!-- After -->
        <div>
          <div class="text-sm font-semibold text-green-400 mb-1 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            After
          </div>
          <pre class="p-2 bg-green-900/10 border border-green-500/20 rounded text-xs"><code>{{ patch.after.code }}</code></pre>
        </div>
      </div>
    </div>
  </div>

  <!-- Fallback when no vote recorded -->
  <div
    v-else
    class="flex items-center justify-center h-full"
  >
    <div class="text-center opacity-50">
      <div class="text-xl mb-2">No vote recorded</div>
      <div class="text-sm">Go back to the vote slide to make a choice</div>
    </div>
  </div>
</template>
