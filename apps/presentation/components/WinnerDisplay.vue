<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'

const props = defineProps<{
  voteIndex: number
}>()

// Vote options data - format: "audit_name: patch description"
const voteData = {
  0: {
    A: {
      title: 'Images',
      fixes: [
        'LCP: Convert images to WebP',
        'LCP: Add loading="lazy" below-fold',
        'CLS: Add width/height attributes'
      ]
    },
    B: {
      title: 'Scripts',
      fixes: [
        'TBT: Remove heavy libraries (jQuery, Lodash, Moment)',
        'TBT: Remove third-party scripts',
        'TBT: Remove blocking inline script'
      ]
    }
  },
  1: {
    A: {
      title: 'Names & Labels',
      fixes: [
        'button-name: Replace divs with semantic buttons',
        'image-alt: Add alt text to images',
        'label: Add labels to form inputs'
      ]
    },
    B: {
      title: 'ARIA',
      fixes: [
        'aria-roles: Use valid ARIA roles',
        'aria-required-attr: Add required ARIA attributes',
        'aria-valid-attr-value: Fix invalid ARIA values'
      ]
    }
  },
  2: {
    A: {
      title: 'General',
      fixes: [
        'deprecations: Remove document.write()',
        'inspector-issues: Fix DevTools issues',
        'errors-in-console: Fix console errors'
      ]
    },
    B: {
      title: 'Trust & Safety',
      fixes: [
        'geolocation-on-start: Remove auto geolocation request',
        'notification-on-start: Remove auto notification request',
        'paste-preventing-inputs: Allow paste in inputs'
      ]
    }
  },
  3: {
    A: {
      title: 'Crawlability',
      fixes: [
        'is-crawlable: Remove noindex meta tag',
        'crawlable-anchors: Make navigation crawlable',
        'robots-txt: Fix robots.txt blocking'
      ]
    },
    B: {
      title: 'Content',
      fixes: [
        'document-title: Add unique page title',
        'meta-description: Add meta description',
        'link-text: Use descriptive link text'
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
