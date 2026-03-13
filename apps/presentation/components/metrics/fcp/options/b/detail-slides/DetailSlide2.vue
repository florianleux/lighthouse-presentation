<script setup lang="ts">
const purgeHtmlCode = `
<div class="text-red-500 p-4">
  BlackMarket
</div>
`
const purgeCssCode = `
.text-red-500 { color: red; }
.p-4 { padding: 1rem; }
`
const minifyCodeBefore = `
/* This is my beautiful button */
.button {
    background-color: blue;
    padding: 10px;
}
`
const minifyCodeAfter = `
.button{background-color:blue;padding:10px}
`
const preloadCode = `
<link rel="preload"
      href="/css/critical.css"
      as="style" />
`

</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="fcp"
      option="b"
    >
      <div class=" grid grid-cols-2 -ml-10 mt-6  text-center items-top gap-10">
        <div class="flex flex-col items-top gap-8">
          <div class="text-4xl font-bold">Purge it!</div>

          <div class="text-left px-10">
            <CodeSnippet
              language="html"
              :code="purgeHtmlCode"
              size="medium"
            />
            <CodeSnippet
              class="mt-5 "
              language="css"
              :code="purgeCssCode"
              size="medium"
            />
          </div>

        </div>
        <div
          v-click="1"
          class="flex flex-col items-center gap-8"
        >
          <div class="text-4xl font-bold">Minify it!</div>
          <div class="text-left">
            <CodeSnippet
              language="css"
              :code="minifyCodeBefore"
              size="medium"
            />
            <CodeSnippet
              class="mt-5"
              language="css"
              :code="minifyCodeAfter"
              size="medium"
            />
          </div>
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
