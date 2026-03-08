<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

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
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="tbt"
      option="b"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center my-5 transition-all duration-800']">Complex selectors slow style matching</div>

      <div v-click="1" class="text-4xl text-center font-bold my-7">Simplify!</div>

      <div v-click="2" class="text-left grid grid-cols-2 text-center gap-10">
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
  </DetailSlideLayered>
</template>
