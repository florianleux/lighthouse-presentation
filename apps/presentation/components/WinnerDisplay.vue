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
      title: 'Images & Transfer',
      fixes: [
        'Convert images to WebP',
        'Add loading="lazy" below-fold',
        'Add width and height attributes',
        'Remove render-blocking CSS',
        'Enable gzip/brotli compression'
      ]
    },
    B: {
      title: 'Fonts & JavaScript',
      fixes: [
        'font-display: swap on all fonts',
        'Remove render-blocking fonts',
        'Add preconnect for external domains',
        'Remove lodash, moment, jQuery',
        'Remove blocking third-party scripts',
        'Remove 500ms inline script'
      ]
    }
  },
  1: {
    A: {
      title: 'Visual',
      fixes: [
        'Improve contrasts (4.5:1 ratio)',
        'Add visible focus indicators',
        'Labels on all inputs',
        'Accessible names on links/buttons',
        'Controls on auto-play media'
      ]
    },
    B: {
      title: 'Semantic',
      fixes: [
        'Replace clickable divs with buttons',
        'Add lang attribute to html',
        'Add skip link',
        'Fix keyboard traps',
        'Fix heading hierarchy (h1→h2→h3)'
      ]
    }
  },
  2: {
    A: {
      title: 'Console & Security',
      fixes: [
        'Remove console.log in production',
        'Add rel="noopener" on external links',
        'Remove document.write()',
        'Fix console errors',
        'Update vulnerable libraries'
      ]
    },
    B: {
      title: 'Modern Standards',
      fixes: [
        'Fix image display dimensions',
        'Verify doctype',
        'Remove aggressive permission requests',
        'Add passive listeners (scroll, touch)',
        'Hide source maps in production'
      ]
    }
  },
  3: {
    A: {
      title: 'Meta & Structure',
      fixes: [
        'Add unique title',
        'Add meta name="description"',
        'One h1 per page',
        'Verify viewport meta',
        'Add canonical URL'
      ]
    },
    B: {
      title: 'Content & Links',
      fixes: [
        'Descriptive link text (no "click here")',
        'Alt attributes on all images',
        'Remove meta noindex',
        'Crawlable navigation (real a href)',
        'Remove redirect chains'
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
