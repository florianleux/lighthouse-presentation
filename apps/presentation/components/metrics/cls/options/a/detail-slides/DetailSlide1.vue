<script setup lang="ts">
const htmlAfterCodeExample = `<img
  src="/banner.jpg"
  width="1200"
  height="630"
  class="w-full h-auto"
  alt="Image bannière"
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
        Aucune taille spécifiée : aucun espace réservé.
      </div>

      <img
        src="/images/cls-before.gif"
        class="absolute left-[20%] top-[68%] -translate-1/2 rounded shadow-lg w-[25%]"
        alt="CLS avant correction"
      />
      <img
        v-click="1"
        src="/images/cls-after.gif"
        class="absolute -right-[6%] top-[68%]  -translate-1/2 rounded shadow-lg w-[25%]"
        alt="CLS après correction"
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
