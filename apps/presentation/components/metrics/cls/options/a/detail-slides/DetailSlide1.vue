<script setup lang="ts">
import { inject, computed } from 'vue'

const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const htmlAfterCodeExample = `<img
  src="/banner.jpg"
  width="1200"
  height="630"
  class="w-full h-auto"
  alt="Banner image"
>`
</script>



<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/cls-detail-1.webp');"
  >
    <DetailSlide
      class="pl-10 pt-5"
      metric="cls"
      option="a"
    >
      <div
        v-click="1"
        :class="[clicks >= 2 ? 'text-xl' : 'text-5xl', 'text-center transition-all duration-800']"
      >
        No size specified: no space reserved.
      </div>

      <div
        v-click="2"
        class="mt-5 text-5xl text-center font-bold"
      >Specify dimensions</div>

      <img
        v-click="1"
        src="/images/cls-before.gif"
        class="absolute left-[27%] top-[72%] -translate-1/2 rounded shadow-lg w-[17%]"
        alt="CLS before fix"
      />
      <img
        v-click="3"
        src="/images/cls-after.gif"
        class="absolute right-[10%] top-[72%]  -translate-1/2 rounded shadow-lg w-[17%]"
        alt="CLS after fix"
      />

      <CodeSnippet
        v-click="2"
        class="absolute top-[72%] left-[50%] -translate-1/2"
        language="html"
        :code="htmlAfterCodeExample"
        size="small"
      />
    </DetailSlide>
  </div>
</template>
