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
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/parchment-bottom-right.png');"
  >
    <DetailSlide
      class="pr-14"
      metric="lcp"
      option="b"
    >

      <div class="text-4xl text-center font-bold mb-7">Load LCP first, everything else later</div>

      <div class="text-left grid grid-cols-2  text-center items-top gap-y-10 ">
        <div class="flex flex-col items-top gap-6">
          <div class="text-3xl text-center font-bold">Put it on top</div>

          <CodeSnippet
            class="text-left px-15 mt-3"
            language="html"
            :code="highPriority"
            size="medium"
          />

        </div>
        <div class="flex flex-col items-top gap-6">
          <div class="text-3xl text-center font-bold">
            Put the other down
            <div class="text-lg -mt-2 text-[#FF2626]">
              (be careful!)
            </div>
          </div>

          <CodeSnippet
            class="text-left px-10 -mt-2"
            language="html"
            :code="lazyLoading"
            size="medium"
          />

        </div>
      </div>
    </DetailSlide>
  </div>
</template>
