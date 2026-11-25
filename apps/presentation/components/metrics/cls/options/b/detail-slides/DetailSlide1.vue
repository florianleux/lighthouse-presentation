<script setup lang="ts">
const codeExample = `.ad-container {
  min-height: 600px;
  min-width: 276px;
}`
</script>

<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="cls"
      option="b"
    >
      <div class="text-5xl text-center mb-20">
        {{ $t('slides.cls.b1.title') }}
      </div>

      <img
        src="/images/cls-ads-before.gif"
        class="absolute left-[21%] top-[65%] -translate-1/2 rounded shadow-lg w-[36%]"
        :alt="$t('slides.cls.b1.altBefore')"
      />
      <img
        v-click="1"
        src="/images/cls-ads-after.gif"
        class="absolute left-[83%] top-[65%] -translate-1/2 rounded shadow-lg w-[36%]"
        :alt="$t('slides.cls.b1.altAfter')"
      />

      <CodeSnippet
        v-click="1"
        class="absolute top-[72%] left-[52%] -translate-1/2"
        language="css"
        :code="codeExample"
        size="small"
      />
    </DetailSlide>
  </DetailSlideLayered>
</template>
