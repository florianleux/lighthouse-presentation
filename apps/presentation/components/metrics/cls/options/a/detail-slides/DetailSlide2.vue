<script setup lang="ts">
const optionalFallbackCodeExample = `@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2');
  font-display: optional;
}
`

const matchingMetricsCodeExample = `@font-face {
  font-family: 'Adjusted Fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 95%;
  descent-override: 22%;
  line-gap-override: 0%;
}
`
const preloadCodeExample = `<link
  rel="preload"
  href="/fonts/custom.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
`

</script>

<template>
  <DetailSlide
    metric="cls"
    option="a"
  >
    <div class="items-center flex-grow justify-center flex mt-5 text-2xl gap-20">
      <div>
        Flash of unstyled text (FOUT)
      </div>
      <div>
        Flash of invisble text (FOIT) </div>
    </div>
    <div class="flex flex-col items-center mt-10 gap-10">
      <div class="grid grid-cols-3 items-center gap-10">
        <div class="flex flex-col items-center">
          <div class="text-4xl text-center font-bold">Optional fallback</div>

        </div>
        <div class="flex flex-col items-center">
          <div class="text-4xl text-center font-bold">Matching metrics</div>

        </div>
        <div class="flex flex-col items-center">
          <div class="text-4xl text-center  font-bold">Preload</div>

        </div>
      </div>
      <div class="grid grid-cols-3 gap-10">
        <CodeSnippet
          language="css"
          :code="optionalFallbackCodeExample"
          size="tiny"
        />
        <CodeSnippet
          language="css"
          :code="matchingMetricsCodeExample"
          size="tiny"
        />
        <CodeSnippet
          language="html"
          :code="preloadCodeExample"
          size="tiny"
        />
      </div>
    </div>
  </DetailSlide>
</template>
