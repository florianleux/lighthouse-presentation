<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const masonryCss = `
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: masonry;
  gap: 1rem;
}

/* Experimental — Firefox & Safari TP only */
`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="tbt"
      option="b"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Is the design worth the cost?</div>

      <div v-click="1" class="text-4xl text-center font-bold my-7">That might be an alternative!</div>

      <div v-click="2" class="grid grid-cols-2 gap-10 items-start">
        <div class="flex flex-col items-center justify-center">
          <div class="text-3xl font-bold mb-4">Challenge the design</div>
          <img src="/images/grid-screenshot.webp" class="w-full max-h-[280px] object-contain rounded-lg" alt="CSS Grid layout" />
        </div>

        <div>
          <CodeSnippet
            class="text-left px-5"
            language="css"
            :code="masonryCss"
            size="small"
          />
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
