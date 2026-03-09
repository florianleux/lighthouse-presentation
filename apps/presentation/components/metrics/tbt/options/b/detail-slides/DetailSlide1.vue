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
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Fancy layouts might require heavy JS!</div>

      <div v-click="1" class="text-4xl text-center font-bold my-7">Synchronous layout calculations block the main thread</div>

      <div v-click="2" class="grid grid-cols-2 gap-10 items-start">
        <div class="flex items-center justify-center">
          <!-- Screenshot placeholder -->
          <div class="w-full h-[300px] bg-[#39FF14] rounded-lg flex items-center justify-center">
            <span class="text-black text-2xl font-bold">📸 Masonry screenshot</span>
          </div>
        </div>

        <div>
          <CodeSnippet
            class="text-left px-5"
            language="js"
            :code="masonryJs"
            size="tiny"
          />
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
