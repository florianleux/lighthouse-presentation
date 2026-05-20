<script setup lang="ts">
</script>

<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-3 relative"
      metric="si"
      option="a"
    >
      <div class="text-5xl text-center mb-20">Compresser les fichiers texte !</div>


      <div
        v-click="1"
        class="mt-13 grid grid-cols-3 gap-x-2 items-start"
      >
        <!-- Column 1: None -->
        <div class="flex flex-col items-center gap-2">
          <div class="text-5xl text-center font-bold">Aucune</div>
          <div class="text-3xl text-center mt-4">500 KB</div>
        </div>

        <!-- Column 2: Gzip -->
        <div
          v-click="2"
          class="flex flex-col items-center gap-2"
        >
          <div class="text-5xl text-center font-bold">Gzip</div>
          <img
            src="/images/logo-gzip.png"
            alt="Gzip"
            class="h-16 object-contain"
          />
          <div class="text-3xl text-center mt-4">~175 KB <span class="text-green-400">(-65%)</span></div>
        </div>

        <!-- Column 3: Brotli -->
        <div
          v-click="3"
          class="relative flex flex-col items-center gap-2"
        >
          <div
            v-click="4"
            class="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl text-red-500 font-bold whitespace-nowrap"
          >Coût CPU</div>
          <div class="text-5xl text-center font-bold">Brotli</div>
          <img
            src="/images/logo-brotli.png"
            alt="Brotli"
            class="h-16 object-contain"
          />
          <div class="text-3xl text-center mt-4">~150 KB <span class="text-green-400">(-70%)</span></div>
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
