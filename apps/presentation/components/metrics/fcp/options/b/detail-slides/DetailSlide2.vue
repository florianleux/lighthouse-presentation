<script setup lang="ts">
const lodashCode = `
_.drop([1, 2, 3]);
// => [2, 3]
`
const noLodashCode = `
[1, 2, 3].slice(1);
// => [2, 3]
`
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

</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="fcp"
      option="b"
    >
      <div class="grid grid-cols-3 -ml-10 mt-6 text-center items-top gap-6">
        <div class="flex flex-col items-top gap-5">
          <div class="text-4xl font-bold">Remettre en question !</div>

          <div class="text-left px-4">
            <CodeSnippet
              language="js"
              :code="lodashCode"
              size="tiny"
            />
            <CodeSnippet
              class="mt-5"
              language="js"
              :code="noLodashCode"
              size="tiny"
            />
          </div>
        </div>
        <div
          v-click="1"
          class="flex flex-col items-top gap-5"
        >
          <div class="text-4xl font-bold">Purger !</div>

          <div class="text-left px-4">
            <CodeSnippet
              language="html"
              :code="purgeHtmlCode"
              size="tiny"
            />
            <CodeSnippet
              class="mt-5"
              language="css"
              :code="purgeCssCode"
              size="tiny"
            />
          </div>
        </div>
        <div
          v-click="2"
          class="flex flex-col items-center gap-5"
        >
          <div class="text-4xl font-bold">Minifier !</div>
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
