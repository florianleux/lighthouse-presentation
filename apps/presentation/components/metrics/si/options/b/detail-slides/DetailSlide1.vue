<script setup lang="ts">
const badCompression = `
# No compression configured
# 500KB HTML sent uncompressed
`

const goodCompression = `
brotli on;
brotli_types text/html text/css application/javascript;

# HTML: 500KB → 150KB (70% reduction)
# CSS: 200KB → 60KB
# JS: 300KB → 90KB
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
      option="b"
    >
      <div class="text-center my-5 text-xl">Compress HTML, CSS, and JavaScript transfers</div>

      <div class="text-4xl text-center font-bold my-7">Enable text compression!</div>


      <CodeSnippet
        class="text-left px-35"
        language="nginx"
        :code="goodCompression"
        size="small"
      />


    </DetailSlide>
  </div>
</template>
