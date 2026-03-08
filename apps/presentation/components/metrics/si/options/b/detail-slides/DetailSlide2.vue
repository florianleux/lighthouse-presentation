<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const badFont = `
<link 
  href="fonts.googleapis.com/css2?
    family=New+Rocker"
  rel="stylesheet"
`

const goodFont = `
<link 
  href="fonts.googleapis.com/css2?
    family=New+Rocker&text=BlackMarket"
  rel="stylesheet"
>
`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="si"
      option="b"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Load only the characters you actually use</div>

      <div v-click="1" class="text-4xl text-center font-bold my-6">Subset custom fonts!</div>

      <div v-click="2" class="text-left grid grid-cols-2 text-center gap-10">
        <div>
          <CodeSnippet
            class="text-left px-5"
            language="html"
            :code="badFont"
            size="small"
          />
        </div>

        <div>
          <CodeSnippet
            class="text-left px-5"
            language="html"
            :code="goodFont"
            size="small"
          />
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
