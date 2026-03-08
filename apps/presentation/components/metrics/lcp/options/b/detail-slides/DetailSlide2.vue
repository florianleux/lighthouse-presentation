<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const cssImage = `/* Preload scanner: NO */
.banner {
  background-image: url('promo-banner.jpg');
}`

const htmlImage = `<!-- Preload scanner: YES -->
<img
  src="promo-banner.jpg"
  alt="Promo Banner"
/>`

const highPriority = `<img
  src="promo-banner.jpg"
  fetchpriority="high"
  alt="Promo Banner"
/>`

const lazyLoading = `<img
  src="red-parrot.jpg"
  loading="lazy"
  alt="Red Parrot"
>`

const nextGenFormats = `<picture>
  <source type="image/avif"
    srcset="promo-banner.avif" />
  <source type="image/webp"
    srcset="promo-banner.webp" />
  <img src="promo-banner.jpg"
    alt="Promo Banner" />
</picture>`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="lcp"
      option="b"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Can't avoid an image as LCP?</div>
      <div v-click="1" class="text-4xl text-center font-bold mb-7">Optimize it!</div>

      <div class="grid grid-cols-3 gap-x-6 items-start">
        <!-- Column 1: Shrink it -->
        <div v-click="2" class="flex flex-col items-center gap-2">
          <div class="text-3xl text-center font-bold">Shrink it!</div>

          <CodeSnippet
            class="text-left px-4"
            language="html"
            :code="nextGenFormats"
            size="small"
          />
        </div>

        <!-- Column 2: Prioritize it -->
        <div v-click="3" class="flex flex-col items-center gap-2">
          <div class="text-3xl text-center font-bold">Prioritize it!</div>

          <CodeSnippet
            class="text-left px-4"
            language="html"
            :code="highPriority"
            size="tiny"
          />

          <CodeSnippet
            class="text-left px-4"
            language="html"
            :code="lazyLoading"
            size="tiny"
          />
        </div>

        <!-- Column 3: Make it discoverable -->
        <div v-click="4" class="flex flex-col items-center gap-2">
          <div class="text-3xl text-center font-bold">Make it discoverable</div>

          <CodeSnippet
            class="text-left px-4"
            language="css"
            :code="cssImage"
            size="tiny"
          />

          <CodeSnippet
            class="text-left px-4"
            language="html"
            :code="htmlImage"
            size="tiny"
          />
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
