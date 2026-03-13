<script setup lang="ts">
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

</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="lcp"
      option="b"
    >
      <div class="text-4xl text-center mb-20">Can't avoid an image as LCP?</div>

      <div class="grid grid-cols-2 gap-x-6 items-start">
        <!-- Column 1: Prioritize it -->
        <div v-click="1" class="flex flex-col items-center gap-2">
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

        <!-- Column 2: Make it discoverable -->
        <div v-click="2" class="flex flex-col items-center gap-2">
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
