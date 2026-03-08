<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="si"
      option="a"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">One optimized image dominates the viewport</div>

      <div v-click="1" class="text-4xl text-center font-bold my-6">Optimize hero as single LCP!</div>

      <div v-click="2" class="flex flex-col items-center text-center gap-10">
        <div class="text-lg bg-green-500 p-10">PLACEHOLDER SCHEMA HERO FULL SCREEN</div>
      </div>

    </DetailSlide>
  </DetailSlideLayered>
</template>
