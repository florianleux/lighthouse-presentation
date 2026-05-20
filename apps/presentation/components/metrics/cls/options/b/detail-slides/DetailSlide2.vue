<script setup lang="ts">
const stickyPositionCodeExample = `.banner-container {
  position: sticky;
  bottom: 0;
  z-index: 9999;
}`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="cls"
      option="b"
    >
      <div class="text-5xl text-center mb-20">
        Le CLS a lieu<br>dans le flux.
      </div>

      <img
        src="/images/cls-banner-before.gif"
        class="absolute left-[20%] top-[54%] -translate-1/2 rounded shadow-lg h-[67%]"
        alt="CLS bannière avant correction"
      />
      <img
        v-click="1"
        src="/images/cls-banner-after.gif"
        class="absolute right-[0%] top-[54%] -translate-1/2 rounded shadow-lg h-[67%]"
        alt="CLS bannière après correction"
      />

      <CodeSnippet
        v-click="1"
        class="absolute top-[65%] left-[52%] -translate-1/2"
        language="css"
        :code="stickyPositionCodeExample"
        size="large"
      />
    </DetailSlide>
  </DetailSlideLayered>
</template>
