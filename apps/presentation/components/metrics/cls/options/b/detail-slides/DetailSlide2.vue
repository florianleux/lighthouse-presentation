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
      <div class="text-4xl text-center mb-20">
        CLS happens mostly in the flow.
      </div>

      <img
        src="/images/cls-banner-before.gif"
        class="absolute left-[27%] top-[62%] -translate-1/2 rounded shadow-lg h-[47%]"
        alt="Banner CLS before fix"
      />
      <img
        v-click="1"
        src="/images/cls-banner-after.gif"
        class="absolute right-[10%] top-[62%] -translate-1/2 rounded shadow-lg h-[47%]"
        alt="Banner CLS after fix"
      />

      <CodeSnippet
        v-click="1"
        class="absolute top-[72%] left-[52%] -translate-1/2"
        language="css"
        :code="stickyPositionCodeExample"
        size="small"
      />
    </DetailSlide>
  </DetailSlideLayered>
</template>
