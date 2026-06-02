<script setup lang="ts">
const matchingMetricsCodeExample = `@font-face {
  ...
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
      <div class="text-4xl text-center mb-20">
        Chaque police a sa propre empreinte.
      </div>

      <img
        src="/images/cls-font-before.gif"
        class="absolute left-[20%] top-[60%] -translate-1/2 rounded shadow-lg w-[28%]"
        alt="CLS police avant correction"
      />
      <img
        v-click="1"
        src="/images/cls-font-after.gif"
        class="absolute -right-[12%] top-[60%] -translate-1/2 rounded shadow-lg w-[28%]"
        alt="CLS police après correction"
      />

      <CodeSnippet
        v-click="1"
        class="absolute top-[60%] left-[52%] -translate-1/2"
        language="css"
        :code="matchingMetricsCodeExample"
        size="medium"
      />
    </DetailSlide>
  </DetailSlideLayered>
</template>
