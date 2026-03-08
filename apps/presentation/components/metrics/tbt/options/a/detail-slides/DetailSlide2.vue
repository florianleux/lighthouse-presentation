<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

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
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="tbt"
      option="a"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Reading geometry after writing forces recalculation</div>

      <div v-click="1" class="text-4xl text-center font-bold my-10">Batch reads, then writes!</div>

      <div v-click="2" class="text-left grid grid-cols-2 text-center gap-10">
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
  </DetailSlideLayered>
</template>
