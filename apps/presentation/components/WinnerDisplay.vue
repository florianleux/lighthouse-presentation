<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'

const props = defineProps<{
  voteIndex: number
}>()

// Vote options data
const voteData = {
  0: {
    A: {
      title: 'Images',
      fixes: [
        'Convert images to WebP',
        'Add loading="lazy" below-fold',
        'Add width/height attributes'
      ]
    },
    B: {
      title: 'Scripts',
      fixes: [
        'Remove heavy libraries (jQuery, Lodash, Moment)',
        'Remove third-party scripts',
        'Remove blocking inline script'
      ]
    }
  },
  1: {
    A: {
      title: 'Visual Cues',
      fixes: [
        'Improve contrasts (4.5:1 ratio)',
        'Add visible focus indicators',
        'Labels on all inputs'
      ]
    },
    B: {
      title: 'Semantic HTML',
      fixes: [
        'Replace clickable divs with buttons',
        'Add lang attribute to html',
        'Fix heading hierarchy (h1→h2→h3)'
      ]
    }
  },
  2: {
    A: {
      title: 'Console',
      fixes: [
        'Remove console.log in production',
        'Remove document.write()',
        'Fix console errors'
      ]
    },
    B: {
      title: 'Browser APIs',
      fixes: [
        'Remove aggressive permission requests',
        'Add passive listeners (scroll, touch)',
        'Hide source maps in production'
      ]
    }
  },
  3: {
    A: {
      title: 'Meta Tags',
      fixes: [
        'Add unique title',
        'Add meta description',
        'One h1 per page'
      ]
    },
    B: {
      title: 'Content',
      fixes: [
        'Descriptive link text',
        'Alt attributes on images',
        'Crawlable navigation'
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
