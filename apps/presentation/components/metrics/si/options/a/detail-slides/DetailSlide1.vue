<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const goodCss = `
<head>
  <style>
    .header { background: #fff; }
    .product-grid { display: grid; }
    .hero { height: 400px; }
  </style>
  <link rel="stylesheet" href="styles.css"
        media="print" onload="this.media='all'">
</head>
`
</script>

<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="si"
      option="a"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Deliver styles instantly for visible content</div>

      <div v-click="1" class="text-4xl text-center font-bold my-7">Inline critical CSS!</div>

      <div v-click="2">
        <CodeSnippet
          class="text-left px-35"
          language="html"
          :code="goodCss"
          size="small"
        />
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
