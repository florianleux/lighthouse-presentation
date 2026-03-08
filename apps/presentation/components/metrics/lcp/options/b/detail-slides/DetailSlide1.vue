<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)
</script>

<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="lcp"
      option="b"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">LCP changes with
        screen size</div>
      <div
        v-click="1"
        class="text-4xl text-center font-bold "
      >Google judges mobile, users experience both</div>

      <div v-click="2">
        <img
          src="/images/lcp-desktop.webp"
          alt="LCP Desktop"
          class="absolute left-[13%] bottom-[13%] h-[40%] w-auto"
        />
        <div class="absolute left-[21%] bottom-[22%] w-[30%] h-[15%] bg-[#39FF14]/40 border-2 border-[#39FF14]" />
      </div>

      <div v-click="3">
        <img
          src="/images/lcp-mobile.webp"
          alt="LCP Mobile"
          class="absolute right-[19%] bottom-[8%] h-[45%] w-auto"
        />
        <div class="absolute right-[19.2%] bottom-[7%] w-[11%] h-[9%] bg-[#39FF14]/40 border-2 border-[#39FF14]" />
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
