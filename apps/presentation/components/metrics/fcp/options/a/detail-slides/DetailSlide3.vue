<script setup lang="ts">
</script>

<template>
  <DetailSlideLayered quadrant="bottom-right">
    <DetailSlide
      class="pl-10"
      metric="fcp"
      option="a"
    >
      <!-- Web pages label -->
      <div v-click="2" class="absolute left-[53%] top-[20%] -translate-x-1/2 text-center">
        <div class="text-3xl font-bold font-title">Web pages</div>
      </div>

      <!-- Cocktails (center group) -->
      <img
        v-click="1"
        src="/images/ttfb/cocktail-1.webp"
        class="absolute left-[38%] top-[35%] -translate-1/2 h-[21%] rotate-[2deg]"
      />
      <img
        v-click="1"
        src="/images/ttfb/cocktail-2.webp"
        class="absolute left-[58%] top-[35%] -translate-1/2 h-[21%] rotate-[-1deg]"
      />
      <img
        v-click="1"
        src="/images/ttfb/cocktail-3.webp"
        class="absolute left-[48%] top-[35%] -translate-1/2 h-[21%] rotate-[-3deg]"
      />
      <img
        v-click="1"
        src="/images/ttfb/cocktail-4.webp"
        class="absolute left-[68%] top-[35%] -translate-1/2 h-[21%] rotate-[1deg]"
      />

      <!-- Glasses -->
      <img
        v-click="3"
        src="/images/ttfb/glass-1.webp"
        class="absolute left-[15%] top-[60%] -translate-1/2 h-[25%] rotate-[-2deg]"
      />
      <img
        v-click="3"
        src="/images/ttfb/glass-2.webp"
        class="absolute left-[25%] top-[60%] -translate-1/2 h-[25%] rotate-[3deg]"
      />
      <div v-click="4" class="absolute left-[20%] top-[72%] -translate-x-1/2 text-center">
        <div class="text-3xl font-bold font-title">1 year (immutable)</div>
        <div class="text-lg opacity-80">Fonts, images, static assets</div>
      </div>

      <!-- Alcohols -->
      <img
        v-click="5"
        src="/images/ttfb/rum.webp"
        class="absolute left-[50%] top-[60%] -translate-1/2 h-[23%] rotate-[3deg]"
      />
      <img
        v-click="5"
        src="/images/ttfb/tequila.webp"
        class="absolute left-[60%] top-[60%] -translate-1/2 h-[23%] rotate-[-1deg]"
      />
      <div v-click="6" class="absolute left-[55%] top-[72%] -translate-x-1/2 text-center">
        <div class="text-3xl font-bold font-title">1 month</div>
        <div class="text-lg opacity-80">JS/CSS bundles, HTML pages</div>
      </div>

      <!-- Fruits -->
      <img
        v-click="7"
        src="/images/ttfb/banana.webp"
        class="absolute left-[79%] top-[60%] -translate-1/2 h-[21%] rotate-[1deg]"
      />
      <img
        v-click="7"
        src="/images/ttfb/cherries.webp"
        class="absolute left-[88%] top-[60%] -translate-1/2 h-[25%] rotate-[-2deg]"
      />
      <div v-click="8" class="absolute w-80% left-[85%] top-[72%] -translate-x-1/2 text-center">
        <div class="text-3xl font-bold font-title">Minutes to hours</div>
        <div class="text-lg opacity-80">API responses</div>
      </div>

    </DetailSlide>
  </DetailSlideLayered>
</template>
