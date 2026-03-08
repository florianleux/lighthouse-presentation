<script setup lang="ts">
import { inject, computed } from 'vue'

const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const matchingMetricsCodeExample = `@font-face {
  font-family: 'New Rocker Fallback';
  src: local('Comic Sans MS');
  size-adjust: 92.3%;
  ascent-override: 94.6%;
  descent-override: 28.3%;
  line-gap-override: 0%;
}
`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="cls"
      option="a"
    >
      <div
        v-click="1"
        :class="[clicks >= 2 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']"
      >
        Every font has its own footprint.
      </div>

      <div
        v-click="2"
        class="mt-5 text-4xl text-center font-bold"
      >Fill the gap</div>

      <img
        v-click="1"
        src="/images/cls-font-before.gif"
        class="absolute left-[21%] top-[68%] -translate-1/2 rounded shadow-lg w-[17%]"
        alt="Font CLS before fix"
      />
      <img
        v-click="3"
        src="/images/cls-font-after.gif"
        class="absolute right-[0%] top-[68%] -translate-1/2 rounded shadow-lg w-[17%]"
        alt="Font CLS after fix"
      />

      <CodeSnippet
        v-click="2"
        class="absolute top-[68%] left-[52%] -translate-1/2"
        language="css"
        :code="matchingMetricsCodeExample"
        size="small"
      />
    </DetailSlide>
  </DetailSlideLayered>
</template>
