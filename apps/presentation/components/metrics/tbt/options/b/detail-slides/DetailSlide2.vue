<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const badDom = `
<div class="grid-wrapper">
  <div class="product-container">
    <div class="card-wrapper">
      <div class="content-inner">
        <img src="hook.jpg">
      </div>
    </div>
  </div>
</div>
`

const goodDom = `
<div class="product-grid">
  <div class="product-card">
    <img src="hook.jpg">
  </div>
</div>
`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="tbt"
      option="b"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Fewer nodes = faster calculations</div>

      <div v-click="1" class="text-4xl text-center font-bold my-6">Flatten the tree!</div>

      <div v-click="2" class="text-left grid grid-cols-2 text-center gap-10">
        <div>
          <CodeSnippet
            class="text-left px-5"
            language="html"
            :code="badDom"
            size="small"
          />
        </div>

        <div>
          <CodeSnippet
            class="text-left px-5"
            language="html"
            :code="goodDom"
            size="small"
          />
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
