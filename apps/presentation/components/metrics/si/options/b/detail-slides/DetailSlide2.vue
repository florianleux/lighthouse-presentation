<script setup lang="ts">
const badFont = `
<link 
  href="fonts.googleapis.com/css2?
    family=New+Rocker"
  rel="stylesheet"
`

const goodFont = `
<link 
  href="fonts.googleapis.com/css2?
    family=New+Rocker&text=BlackMarket"
  rel="stylesheet"
>
`
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/parchment-bottom-left.png');"
  >
    <DetailSlide
      class="pl-10"
      metric="si"
      option="b"
    >
      <div class="text-center text-2xl">Load only the characters you actually use</div>

      <div class="text-4xl text-center font-bold my-6">Subset custom fonts!</div>

      <div class="text-left grid grid-cols-2 text-center gap-10">
        <div>
          <CodeSnippet
            class="text-left px-5"
            language="html"
            :code="badFont"
            size="small"
          />
        </div>

        <div>
          <CodeSnippet
            class="text-left px-5"
            language="html"
            :code="goodFont"
            size="small"
          />
        </div>
      </div>
    </DetailSlide>
  </div>
</template>
