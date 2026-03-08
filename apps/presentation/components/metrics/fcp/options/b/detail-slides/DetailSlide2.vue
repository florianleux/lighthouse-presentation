<script setup lang="ts">
const purgeHtmlCode = `
<div class="text-red-500 p-4">
  BlackMarket
</div>
`
const purgeCssCode = `
/* ~193 used / ~15,000+ available
   ~3.5 MB → ~6 KB (99.8% purged) */
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
      <div class=" grid grid-cols-2 mt-6  text-center items-top gap-10">
        <div class="flex flex-col items-top gap-8">
          <div class="text-xl font-bold">Too long</div>
          <div class="text-4xl font-bold">Purge it!</div>

          <div class="text-left px-15">
            <CodeSnippet
              language="html"
              :code="purgeHtmlCode"
              size="tiny"
            />
            <CodeSnippet
              class="mt-5 "
              language="css"
              :code="purgeCssCode"
              size="tiny"
            />
          </div>

        </div>
        <div v-click="1" class="flex flex-col items-center gap-8">
          <div class="text-xl font-bold">Too heavy</div>
          <div class="text-4xl font-bold">Minify it!</div>
          <div class="text-left">
            <CodeSnippet
              language="css"
              :code="minifyCodeBefore"
              size="tiny"
            />
            <CodeSnippet
              class="mt-5"
              language="css"
              :code="minifyCodeAfter"
              size="tiny"
            />
          </div>
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
