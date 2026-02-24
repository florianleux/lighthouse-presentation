<script setup lang="ts">
const badSelector = `
.product-grid 
  > div.card 
   > div.content 
    > h3:nth-child(2) {
  color: #0d0d0d;
}
`

const goodSelector = `
.product-title {
  color: #0d0d0d;
}
`
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/parchment-top-left.png');"
  >
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="tbt"
      option="b"
    >
      <div class="text-center my-5 text-2xl">Complex selectors slow style matching</div>

      <div class="text-4xl text-center font-bold my-7">Simplify!</div>

      <div class="text-left grid grid-cols-2 text-center gap-10">
        <div>
          <CodeSnippet
            class="text-left px-5"
            language="css"
            :code="badSelector"
            size="small"
          />
        </div>

        <div>
          <CodeSnippet
            class="text-left px-5"
            language="css"
            :code="goodSelector"
            size="small"
          />
        </div>
      </div>
    </DetailSlide>
  </div>
</template>
