<script setup lang="ts">
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
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/parchment-top-left.png');"
  >
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="tbt"
      option="a"
    >
      <div class="text-center mb-5 text-2xl">Monolithic init blocks the main thread</div>

      <div class="text-4xl text-center font-bold my-7">Yield between tasks!</div>

      <div class="text-left grid grid-cols-2 text-center gap-10">
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
  </div>
</template>
