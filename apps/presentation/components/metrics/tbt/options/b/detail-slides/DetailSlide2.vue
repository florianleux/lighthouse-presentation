<script setup lang="ts">
const badDom = `
<div class="grid-wrapper">
  <div class="product-container">
    <div class="card-wrapper">
      <div class="content-inner">
        <img src="hook.jpg">
      </div>
    </div>
  </div>
</div>
`

const goodDom = `
<div class="product-grid">
  <div class="product-card">
    <img src="hook.jpg">
  </div>
</div>
`
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/parchment-bottom-left.png');"
  >
    <DetailSlide
      class="pl-10"
      metric="tbt"
      option="b"
    >
      <div class="text-center text-2xl">Fewer nodes = faster calculations</div>

      <div class="text-4xl text-center font-bold my-6">Flatten the tree!</div>

      <div class="text-left grid grid-cols-2 text-center gap-10">
        <div>
          <CodeSnippet
            class="text-left px-5"
            language="html"
            :code="badDom"
            size="small"
          />
        </div>

        <div>
          <CodeSnippet
            class="text-left px-5"
            language="html"
            :code="goodDom"
            size="small"
          />
        </div>
      </div>
    </DetailSlide>
  </div>
</template>
