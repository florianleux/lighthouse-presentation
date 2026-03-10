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
      option="a"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">A lot of web
        resources are text files.
      </div>

      <div
        v-click="1"
        class="text-4xl text-center font-bold mt-2 mb-10"
      >Compress them (smartly).</div>

      <div
        v-click="2"
        class="mt-13 grid grid-cols-3 gap-x-2 items-start"
      >
        <!-- Column 1: None -->
        <div class="flex flex-col items-center gap-2">
          <div class="text-3xl text-center font-bold">None</div>
          <div class="text-xl text-center mt-4">500 KB</div>
        </div>

        <!-- Column 2: Gzip -->
        <div
          v-click="3"
          class="flex flex-col items-center gap-2"
        >
          <div class="text-3xl text-center font-bold">Gzip</div>
          <img
            src="/images/logo-gzip.png"
            alt="Gzip"
            class="h-16 object-contain"
          />
          <div class="text-xl text-center mt-4">~175 KB <span class="text-green-400">(-65%)</span></div>
        </div>

        <!-- Column 3: Brotli -->
        <div
          v-click="4"
          class="relative flex flex-col items-center gap-2"
        >
          <div
            v-click="5"
            class="absolute -top-5 left-1/2 -translate-x-1/2 text-sm text-red-500 font-bold whitespace-nowrap"
          >CPU cost</div>
          <div class="text-3xl text-center font-bold">Brotli</div>
          <img
            src="/images/logo-brotli.png"
            alt="Brotli"
            class="h-16 object-contain"
          />
          <div class="text-xl text-center mt-4">~150 KB <span class="text-green-400">(-70%)</span></div>
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
