<script setup lang="ts">
const badLayout = `
// Forces 100 layout calculations
productCards.forEach(card => {
  card.style.height = tallestCard.offsetHeight + 'px';
});
`

const goodLayout = `
const height = tallestCard.offsetHeight; // Read once

productCards.forEach(card => {
  card.style.height = height + 'px'; // Write all
});
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
      option="a"
    >
      <div class="text-center text-2xl">Reading geometry after writing forces recalculation</div>

      <div class="text-4xl text-center font-bold my-10">Batch reads, then writes!</div>

      <div class="text-left grid grid-cols-2 text-center gap-10">
        <div>
          <CodeSnippet
            class="text-left px-5"
            language="js"
            :code="badLayout"
            size="tiny"
          />
        </div>

        <div>
          <CodeSnippet
            class="text-left px-5"
            language="js"
            :code="goodLayout"
            size="tiny"
          />
        </div>
      </div>
    </DetailSlide>
  </div>
</template>
