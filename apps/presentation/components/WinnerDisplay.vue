<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'

const props = defineProps<{
  voteIndex: number
}>()

// Vote options data for 4 Performance metrics (CLS, LCP, FCP, TBT)
// Note: These are placeholder thought exercises treating BlackMarket as a real app
const voteData = {
  0: { // CLS - Cumulative Layout Shift
    A: {
      title: '[PLACEHOLDER Option A]',
      fixes: [
        '[PLACEHOLDER: Fix 1]',
        '[PLACEHOLDER: Fix 2]',
        '[PLACEHOLDER: Fix 3]'
      ]
    },
    B: {
      title: '[PLACEHOLDER Option B]',
      fixes: [
        '[PLACEHOLDER: Fix 1]',
        '[PLACEHOLDER: Fix 2]',
        '[PLACEHOLDER: Fix 3]'
      ]
    }
  },
  1: { // LCP - Largest Contentful Paint
    A: {
      title: '[PLACEHOLDER Option A]',
      fixes: [
        '[PLACEHOLDER: Fix 1]',
        '[PLACEHOLDER: Fix 2]',
        '[PLACEHOLDER: Fix 3]'
      ]
    },
    B: {
      title: '[PLACEHOLDER Option B]',
      fixes: [
        '[PLACEHOLDER: Fix 1]',
        '[PLACEHOLDER: Fix 2]',
        '[PLACEHOLDER: Fix 3]'
      ]
    }
  },
  2: { // FCP - First Contentful Paint
    A: {
      title: '[PLACEHOLDER Option A]',
      fixes: [
        '[PLACEHOLDER: Fix 1]',
        '[PLACEHOLDER: Fix 2]',
        '[PLACEHOLDER: Fix 3]'
      ]
    },
    B: {
      title: '[PLACEHOLDER Option B]',
      fixes: [
        '[PLACEHOLDER: Fix 1]',
        '[PLACEHOLDER: Fix 2]',
        '[PLACEHOLDER: Fix 3]'
      ]
    }
  },
  3: { // TBT - Total Blocking Time
    A: {
      title: '[PLACEHOLDER Option A]',
      fixes: [
        '[PLACEHOLDER: Fix 1]',
        '[PLACEHOLDER: Fix 2]',
        '[PLACEHOLDER: Fix 3]'
      ]
    },
    B: {
      title: '[PLACEHOLDER Option B]',
      fixes: [
        '[PLACEHOLDER: Fix 1]',
        '[PLACEHOLDER: Fix 2]',
        '[PLACEHOLDER: Fix 3]'
      ]
    }
  }
}

const choice = computed(() => voteStore.getChoice(props.voteIndex))
const winner = computed(() => {
  const c = choice.value
  if (!c) return null
  return voteData[props.voteIndex as keyof typeof voteData][c as 'A' | 'B']
})
</script>

<template>
  <div v-if="choice && winner" class="mt-4">
    <div class="text-2xl mb-4">
      The crew chose: <span class="font-bold" :class="choice === 'A' ? 'text-blue-500' : 'text-amber-500'">Option {{ choice }}</span>
    </div>
    <div class="p-6 border-2 rounded-lg" :class="choice === 'A' ? 'border-blue-500' : 'border-amber-500'">
      <div class="text-xl font-bold mb-4">{{ winner.title }}</div>
      <ul class="space-y-2">
        <li v-for="fix in winner.fixes" :key="fix" class="flex items-start gap-2">
          <span class="text-green-500">✓</span>
          <span>{{ fix }}</span>
        </li>
      </ul>
    </div>
  </div>
  <div v-else class="mt-4 p-6 border rounded-lg text-center opacity-50">
    No vote recorded - go back to the vote slide
  </div>
</template>
