<script setup lang="ts">
const htmlAfterCodeExample = `<img
  src="/banner.jpg"
  width="1200"
  height="630"
  class="w-full h-auto"
  alt="Banner image"
>`
</script>



<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="cls"
      option="a"
    >
      <div class="text-5xl text-center mb-20">
        No size specified: no space reserved.
      </div>

      <img
        src="/images/cls-before.gif"
        class="absolute left-[20%] top-[68%] -translate-1/2 rounded shadow-lg w-[25%]"
        alt="CLS before fix"
      />
      <img
        v-click="1"
        src="/images/cls-after.gif"
        class="absolute -right-[6%] top-[68%]  -translate-1/2 rounded shadow-lg w-[25%]"
        alt="CLS after fix"
      />

      <CodeSnippet
        v-click="1"
        class="absolute top-[68%] left-[50%] -translate-1/2"
        language="html"
        :code="htmlAfterCodeExample"
        size="medium"
      />
    </DetailSlide>
  </DetailSlideLayered>
</template>
