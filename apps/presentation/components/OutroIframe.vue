<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'
import BlackMarketIframe from './BlackMarketIframe.vue'

// CLS = vote index 0, TBT = vote index 3
// Visual branches: {cls}-{tbt} → a-a, a-b, b-a, b-b
const branchUrl = computed(() => {
  const cls = (voteStore.getChoice(0) || 'A').toLowerCase()
  const tbt = (voteStore.getChoice(3) || 'A').toLowerCase()
  return `https://${cls}-${tbt}--blackmarket-lighthouse.netlify.app`
})
</script>

<template>
  <div class="slide-bg" style="background-image: url('/backgrounds/end-middle.webp')">
    <div class="w-[68%] absolute right-[16%] top-[16%] aspect-[1960/1250] -rotate-1">
      <BlackMarketIframe :url="branchUrl" :delay="500" />
    </div>
  </div>
</template>
