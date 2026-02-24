<script setup lang="ts">

const goodCss = `
<head>
  <style>
    .header { background: #fff; }
    .product-grid { display: grid; }
    .hero { height: 400px; }
  </style>
  <link rel="stylesheet" href="styles.css"
        media="print" onload="this.media='all'">
</head>
`
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/parchment-top-left.png');"
  >
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="si"
      option="a"
    >
      <div class="text-center my-5 text-2xl">Deliver styles instantly for visible content</div>

      <div class="text-4xl text-center font-bold my-7">Inline critical CSS!</div>

      <div>
        <CodeSnippet
          class="text-left px-35"
          language="html"
          :code="goodCss"
          size="small"
        />
      </div>
    </DetailSlide>
  </div>
</template>
