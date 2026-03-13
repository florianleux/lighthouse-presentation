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
      <div class="text-4xl text-center mb-20">
        No placeholder: layout shift at injection.
      </div>

      <img
        src="/images/cls-ads-before.gif"
        class="absolute left-[20%] top-[72%] -translate-1/2 rounded shadow-lg w-[30%]"
        alt="Ads CLS before fix"
      />
      <img
        v-click="1"
        src="/images/cls-ads-after.gif"
        class="absolute right-[-7%] top-[72%] -translate-1/2 rounded shadow-lg w-[28%]"
        alt="Ads CLS after fix"
      />

      <CodeSnippet
        v-click="1"
        class="absolute top-[72%] left-[50%] -translate-1/2"
        language="css"
        :code="codeExample"
        size="small"
      />
    </DetailSlide>
  </DetailSlideLayered>
</template>
