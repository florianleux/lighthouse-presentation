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
      <div
        class="text-5xl text-center mb-20"
        v-html="$t('slides.cls.b2.title')"
      />

      <img
        src="/images/cls-banner-before.gif"
        class="absolute left-[20%] top-[54%] -translate-1/2 rounded shadow-lg h-[67%]"
        :alt="$t('slides.cls.b2.altBefore')"
      />
      <img
        v-click="1"
        src="/images/cls-banner-after.gif"
        class="absolute right-[0%] top-[54%] -translate-1/2 rounded shadow-lg h-[67%]"
        :alt="$t('slides.cls.b2.altAfter')"
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
