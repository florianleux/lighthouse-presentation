<script setup lang="ts">
const cssImage = `/* Preload scanner: NO */
.banner {
  background-image: url('promo-banner.jpg');
}
`

const jsImage = `// Preload scanner: NO
const img = document.createElement('img');
img.src = 'promo-banner.jpg';
document.body.appendChild(img);
`

const svgImage = `
<svg>
  <image href="promo-banner.jpg" />
</svg>
`

const injectedSrcImage = `<!-- Preload scanner: NO -->
<img id="banner">
<` + `script>
    document.getElementById('banner').src = 'promo-banner.jpg';
</` + `script>`

const htmlImage = `<!-- Preload scanner: YES -->
<img
  src="promo-banner.jpg"
  alt = "Promo banner"
/>`

</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/cls-detail-2.webp');"
  >
    <DetailSlide
      class="pl-10"
      metric="lcp"
      option="b"
    >
      <div class="text-xl font-bold text-center mb-3">Early discovery means early download</div>

      <div class="text-4xl text-center font-bold mb-7">Preload scanner must see the LCP</div>

      <div class="text-left grid grid-cols-2  text-center items-top gap-y-10 ">

        <CodeSnippet
          class="px-10"
          language="css"
          :code="cssImage"
          size="tiny"
        />

        <CodeSnippet
          class="px-10"
          language="js"
          :code="jsImage"
          size="tiny"
        />

        <CodeSnippet
          language="js"
          :code="injectedSrcImage"
          size="tiny"
        />

        <CodeSnippet
          class="px-10"
          language="html"
          :code="htmlImage"
          size="tiny"
        />
      </div>
    </DetailSlide>
  </div>
</template>
