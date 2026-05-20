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
  alt="Bannière promo"
>`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-5"
      metric="si"
      option="b"
    >
      <div class="text-5xl text-center mb-10">Adapter les images au navigateur !</div>

      <div
        v-click="1"
        class="grid w-[105%] -ml-5 grid-cols-7 items-start"
      >
        <CodeSnippet
          class="text-left px-2"
          language="html"
          :code="pictureWrapper"
          size="small"
        />

        <CodeSnippet
          v-click="2"
          class="text-left px-2 col-span-2"
          language="html"
          :code="sourceAvif"
          size="small"
        />

        <CodeSnippet
          v-click="2"
          class="text-left px-2 col-span-2"
          language="html"
          :code="sourceWebp"
          size="small"
        />

        <CodeSnippet
          v-click="2"
          class="text-left col-span-2"
          language="html"
          :code="imgFallback"
          size="small"
        />
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
