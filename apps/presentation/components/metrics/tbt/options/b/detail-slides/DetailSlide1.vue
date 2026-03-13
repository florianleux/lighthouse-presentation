<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const masonryJs = `
items.forEach(item => {
  const top = heights[col];
  // read → forces layout recalculation
  heights[col] += item.offsetHeight;

  // write → invalidates layout
  item.style.top = top + 'px';
  item.style.left = (col * colWidth) + 'px';

  // next iteration: offsetHeight again
  // → forced reflow every loop!
});
`
</script>

<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="tbt"
      option="b"
    >
      <span v-click="1" class="hidden" />

      <div class="grid grid-cols-[1fr_2fr] gap-6">
        <div class="flex items-start justify-center">
          <img
            src="/images/masonry-screenshot.webp"
            class="w-full ml-20 max-h-[375px] object-contain rounded-sm -rotate-1 shadow-sm"
            alt="Masonry layout"
          />
        </div>

        <div class="flex flex-col">
          <div class="text-4xl text-center mb-20">Fancy layouts
            might require heavy JS!</div>

          <div v-if="clicks >= 1">
            <CodeSnippet
              class="text-left px-5"
              language="js"
              :code="masonryJs"
              size="tiny"
            />
          </div>
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
