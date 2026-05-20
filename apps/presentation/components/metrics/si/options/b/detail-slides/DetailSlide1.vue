<script setup lang="ts">
</script>

<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-3 relative"
      metric="si"
      option="b"
    >
      <div class="text-5xl text-center mb-20">Même image, formats différents.</div>

      <div
        v-click="1"
        class="grid grid-cols-4 gap-x-2 items-start"
      >
        <!-- Column 1: JPG -->
        <div class="flex flex-col items-center gap-0">
          <div class="text-2xl text-center opacity-70">1992</div>
          <div class="text-5xl text-center font-bold">JPG</div>
          <div class="text-2xl text-center opacity-70">Avec perte</div>
          <div class="text-3xl text-center mt-5">86 KB</div>
        </div>

        <!-- Column 2: PNG -->
        <div
          v-click="1"
          class="flex flex-col items-center gap-0"
        >
          <div class="text-2xl text-center opacity-70">1996</div>
          <div class="text-5xl text-center font-bold">PNG</div>
          <div class="text-2xl text-center opacity-70">Sans perte</div>
          <div class="text-3xl text-center mt-5">189 KB</div>
        </div>

        <!-- Column 3: WebP -->
        <div
          v-click="2"
          class="flex flex-col items-center gap-0"
        >
          <div class="text-2xl text-center opacity-70">2010</div>
          <div class="text-5xl text-center font-bold">WebP</div>
          <div class="text-2xl text-center opacity-70">Avec / Sans perte</div>
          <div class="text-3xl text-center mt-5">24 KB</div>
        </div>

        <!-- Column 4: AVIF -->
        <div
          v-click="2"
          class="flex flex-col items-center gap-0"
        >
          <div class="text-2xl text-center opacity-70">2019</div>
          <div class="text-5xl text-center font-bold">AVIF</div>
          <div class="text-2xl text-center opacity-70">Avec / Sans perte</div>
          <div class="text-3xl text-center mt-5">16 KB</div>
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
