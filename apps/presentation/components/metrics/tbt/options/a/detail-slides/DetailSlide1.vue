<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const badInit = `
// Runs 800ms blocking everything
function initBlackMarket() {
  loadProducts();           // 300ms
  initCategoryFilters();    // 200ms
  loadRecommendations();    // 200ms
  trackPageAnalytics();     // 100ms
}
`

const goodInit = `
async function initBlackMarket() {
  loadProducts();
  await scheduler.yield();

  initCategoryFilters();
  await scheduler.yield();

  requestIdleCallback(() => {
    loadRecommendations();
    trackPageAnalytics();
  });
}
`
</script>

<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="tbt"
      option="a"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Monolithic init blocks the main thread</div>

      <div v-click="1" class="text-4xl text-center font-bold my-7">Yield between tasks!</div>

      <div v-click="2" class="text-left grid grid-cols-2 text-center gap-10">
        <div>
          <CodeSnippet
            class="text-left px-5"
            language="js"
            :code="badInit"
            size="tiny"
          />
        </div>

        <div>
          <CodeSnippet
            class="text-left px-5"
            language="js"
            :code="goodInit"
            size="tiny"
          />
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
