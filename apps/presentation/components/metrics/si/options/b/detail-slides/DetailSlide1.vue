<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const badCompression = `
# No compression configured
# 500KB HTML sent uncompressed
`

const goodCompression = `
brotli on;
brotli_types text/html text/css application/javascript;

# HTML: 500KB → 150KB (70% reduction)
# CSS: 200KB → 60KB
# JS: 300KB → 90KB
`
</script>

<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="si"
      option="b"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Compress HTML, CSS, and JavaScript transfers</div>

      <div v-click="1" class="text-4xl text-center font-bold my-7">Enable text compression!</div>

      <CodeSnippet
        v-click="2"
        class="text-left px-35"
        language="nginx"
        :code="goodCompression"
        size="small"
      />


    </DetailSlide>
  </DetailSlideLayered>
</template>
