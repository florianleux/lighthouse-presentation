<script setup lang="ts">
import { inject, computed } from 'vue'

const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const stickyPositionCodeExample = `.banner-container {
  position: sticky;
  bottom: 0;
  z-index: 9999;
}`
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/cls-detail-4.webp');"
  >
    <DetailSlide
      class="pl-10 pt-5"
      metric="cls"
      option="b"
    >
      <div
        v-click="1"
        :class="[clicks >= 2 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']"
      >
        Injection is more risky to cause shifts in the flow.
      </div>

      <div
        v-click="2"
        class="mt-5 text-5xl text-center font-bold"
      >Extract it!</div>

      <img
        v-click="1"
        src="/images/cls-banner-before.gif"
        class="absolute left-[27%] top-[62%] -translate-1/2 rounded shadow-lg h-[47%]"
        alt="Banner CLS before fix"
      />
      <img
        v-click="3"
        src="/images/cls-banner-after.gif"
        class="absolute right-[10%] top-[62%] -translate-1/2 rounded shadow-lg h-[47%]"
        alt="Banner CLS after fix"
      />

      <CodeSnippet
        v-click="2"
        class="absolute top-[72%] left-[52%] -translate-1/2"
        language="css"
        :code="stickyPositionCodeExample"
        size="small"
      />
    </DetailSlide>
  </div>
</template>
