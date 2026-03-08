<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

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
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="lcp"
      option="b"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Early discovery means early download</div>

      <div v-click="1" class="text-4xl text-center font-bold mb-7">Preload scanner must see the LCP</div>

      <div class="text-left grid grid-cols-2  text-center items-top gap-y-10 ">

        <div v-click="2" class="contents">
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
        </div>

        <div v-click="3" class="contents">
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
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
