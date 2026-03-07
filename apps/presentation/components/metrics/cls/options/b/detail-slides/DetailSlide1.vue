<script setup lang="ts">
import { inject, computed } from 'vue'

const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const codeExample = `.ad-container {
  min-height: 600px;
  min-width: 276px;
}`
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/cls-detail-3.webp');"
  >
    <DetailSlide
      class="pt-5 pl-5"
      metric="cls"
      option="b"
    >
      <div
        v-click="1"
        :class="[clicks >= 2 ? 'text-xl' : 'text-5xl', 'text-center transition-all duration-800']"
      >
        No placeholder: layout shift at injection.
      </div>

      <div
        v-click="2"
        class="mt-5 text-5xl text-center font-bold"
      >Reserve space</div>

      <img
        v-click="1"
        src="/images/cls-ads-before.gif"
        class="absolute left-[20%] top-[72%] -translate-1/2 rounded shadow-lg w-[30%]"
        alt="Ads CLS before fix"
      />
      <img
        v-click="3"
        src="/images/cls-ads-after.gif"
        class="absolute right-[-7%] top-[72%] -translate-1/2 rounded shadow-lg w-[28%]"
        alt="Ads CLS after fix"
      />

      <CodeSnippet
        v-click="2"
        class="absolute top-[72%] left-[50%] -translate-1/2"
        language="css"
        :code="codeExample"
        size="small"
      />
    </DetailSlide>
  </div>
</template>
