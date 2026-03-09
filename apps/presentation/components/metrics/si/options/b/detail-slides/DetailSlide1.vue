<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)
</script>

<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-3 relative"
      metric="si"
      option="b"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Same image, different formats.</div>

      <div v-click="1" class="text-4xl text-center font-bold mt-2 mb-10">Pick the right one.</div>

      <div v-click="2" class="grid grid-cols-4 gap-x-2 items-start">
        <!-- Column 1: JPG -->
        <div class="flex flex-col items-center gap-0">
          <div class="text-base text-center opacity-70">1992</div>
          <div class="text-3xl text-center font-bold">JPG</div>
          <div class="text-sm text-center opacity-70">Lossy</div>
          <div class="text-xl text-center mt-5">86 KB</div>
        </div>

        <!-- Column 2: PNG -->
        <div v-click="3" class="flex flex-col items-center gap-0">
          <div class="text-base text-center opacity-70">1996</div>
          <div class="text-3xl text-center font-bold">PNG</div>
          <div class="text-sm text-center opacity-70">Lossless</div>
          <div class="text-xl text-center mt-5">189 KB</div>
        </div>

        <!-- Column 3: WebP -->
        <div v-click="4" class="flex flex-col items-center gap-0">
          <div class="text-base text-center opacity-70">2010</div>
          <div class="text-3xl text-center font-bold">WebP</div>
          <div class="text-sm text-center opacity-70">Lossy / Lossless</div>
          <div class="text-xl text-center mt-5">24 KB</div>
        </div>

        <!-- Column 4: AVIF -->
        <div v-click="5" class="flex flex-col items-center gap-0">
          <div class="text-base text-center opacity-70">2019</div>
          <div class="text-3xl text-center font-bold">AVIF</div>
          <div class="text-sm text-center opacity-70">Lossy / Lossless</div>
          <div class="text-xl text-center mt-5">16 KB</div>
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
