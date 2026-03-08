<script setup lang="ts">
const highPriority = `
<img
  src="promo-banner.jpg"
  fetchpriority="high"
  alt="Promo Banner"
/>`

const lazyLoading = `
<img
  src="product-gallery-5.jpg"
  loading="lazy"
  alt="Red Parrot"
>`

const nextGenFormats = `
<picture>
  <source type="image/avif"
    srcset="banner.avif" />
  <source type="image/webp"
    srcset="banner.webp" />
  <img src="banner.jpg"
    alt="Promo Banner" />
</picture>`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-right">
    <DetailSlide
      class="pl-10"
      metric="lcp"
      option="b"
    >

      <div class="text-4xl text-center font-bold mb-7">Load LCP first, lightest possible</div>

      <div class="text-left grid grid-cols-2 text-center items-top gap-x-6">
        <div v-click="1" class="flex flex-col items-top gap-2">
          <div class="text-3xl text-center font-bold">Prioritize it!</div>

          <CodeSnippet
            class="text-left px-20"
            language="html"
            :code="highPriority"
            size="tiny"
          />

          <CodeSnippet
            class="text-left px-20"
            language="html"
            :code="lazyLoading"
            size="tiny"
          />

        </div>
        <div v-click="2" class="flex flex-col items-top gap-2">
          <div class="text-3xl text-center font-bold">Shrink it!</div>

          <CodeSnippet
            class="text-left mt-5 px-10"
            language="html"
            :code="nextGenFormats"
            size="small"
          />

        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
