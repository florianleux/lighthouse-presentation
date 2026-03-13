<script setup lang="ts">
const pictureWrapper = `<picture>
  ...
</picture>`

const sourceAvif = `<source
  type="image/avif"
  srcset="
    banner-400.avif  400w,
    banner-800.avif  800w,
    banner-1200.avif 1200w
  "
>`

const sourceWebp = `<source
  type="image/webp"
  srcset="
    banner-400.webp  400w,
    banner-800.webp  800w,
    banner-1200.webp 1200w
  "
>`

const imgFallback = `<img
  srcset="
    banner-400.png  400w,
    banner-800.png  800w,
    banner-1200.png 1200w
  "
  sizes="
    (max-width: 768px) 100vw,
    50vw
  "
  src="banner-800.png"
  alt="Promo Banner"
>`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-5"
      metric="si"
      option="b"
    >
      <div class="text-4xl text-center mb-20">Stop sending
        desktop images to mobile screens</div>

      <div
        v-click="1"
        class="grid w-[105%] -ml-2 grid-cols-7 -gap-5 items-start"
      >
        <CodeSnippet
          class="text-left px-2"
          language="html"
          :code="pictureWrapper"
          size="tiny"
        />

        <CodeSnippet
          v-click="2"
          class="text-left px-2 col-span-2"
          language="html"
          :code="sourceAvif"
          size="tiny"
        />

        <CodeSnippet
          v-click="3"
          class="text-left px-2 col-span-2"
          language="html"
          :code="sourceWebp"
          size="tiny"
        />

        <CodeSnippet
          v-click="4"
          class="text-left px-2 col-span-2"
          language="html"
          :code="imgFallback"
          size="tiny"
        />
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
