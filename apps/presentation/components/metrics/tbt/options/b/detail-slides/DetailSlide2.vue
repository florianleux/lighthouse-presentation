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
      class="pl-10 pt-5 relative"
      metric="tbt"
      option="b"
    >
      <span
        v-click="1"
        class="hidden"
      />

      <div class="grid grid-cols-[1fr_2fr] gap-6">
        <div class="flex items-start justify-center">
          <img
            src="/images/grid-screenshot.webp"
            class="w-full ml-10 -mt-5 max-h-[335px] object-contain rounded-sm -rotate-1 shadow-sm"
            alt="CSS Grid layout"
          />
        </div>

        <div class="flex flex-col">
          <div class="text-5xl text-center mb-6 -mt-2">Is the design
            worth the cost?</div>

          <div v-if="clicks >= 1">
            <CodeSnippet
              class="text-left px-5"
              language="css"
              :code="masonryCss"
              size="medium"
            />
          </div>
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
