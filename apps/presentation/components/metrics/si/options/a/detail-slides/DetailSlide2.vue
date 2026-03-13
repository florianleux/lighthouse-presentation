<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const subsetCode = `
<link
  href="fonts.googleapis.com/css2?
    family=Germania+One
    &text=BlackMarket"
  rel="stylesheet"
>
`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="si"
      option="a"
    >
      <div class="text-5xl text-center mb-15">Fonts are
        everywhere, compress them!</div>

      <div :class="[clicks >= 4 ? 'grid grid-cols-2 gap-x-0' : '', 'transition-all duration-800 items-start']">
        <!-- Fonts formats (full width → left column) -->
        <div :class="[clicks >= 4 ? 'mt-18' : '', 'grid grid-cols-3 gap-x-6 mt-2 items-start']">
          <!-- Column 1: TTF -->
          <div
            v-click="1"
            class="flex flex-col items-center gap-0"
          >
            <div class="text-2xl text-center opacity-70">1991</div>
            <div class="text-5xl text-center font-bold">TTF</div>
            <div class="text-xl text-center opacity-70">No compression</div>
            <div class="text-3xl text-center mt-5">~90 KB</div>
          </div>

          <!-- Column 2: WOFF -->
          <div
            v-click="2"
            class="flex flex-col items-center gap-0"
          >
            <div class="text-2xl text-center opacity-70">2010</div>
            <div class="text-5xl text-center font-bold">WOFF</div>
            <div class="text-xl text-center opacity-70">zlib (gzip)</div>
            <div class="text-3xl text-center mt-5">~50 KB</div>
          </div>

          <!-- Column 3: WOFF2 -->
          <div
            v-click="3"
            class="flex flex-col items-center gap-0"
          >
            <div class="text-2xl text-center opacity-70">2014</div>
            <div class="text-5xl text-center font-bold">WOFF2</div>
            <div class="text-xl text-center opacity-70">Brotli</div>
            <div class="text-3xl text-center mt-5">~35 KB</div>
          </div>
        </div>

        <!-- Subsetting (right column) -->
        <div class="flex flex-col items-center ml-15  gap-2">
          <div
            v-click="4"
            class="text-5xl font-title text-black"
          >BlackMarket</div>

          <CodeSnippet
            v-click="5"
            class="text-left px-4"
            language="html"
            :code="subsetCode"
            size="medium"
          />

          <div
            v-click="6"
            class="text-xl text-center mt-2"
          >~2-3 KB</div>
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
