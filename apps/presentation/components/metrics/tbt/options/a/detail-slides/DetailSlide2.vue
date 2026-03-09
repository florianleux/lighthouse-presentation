<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const badObject = `
// Every product carries 150+ fields
{
  "id": 1,
  "name": "Rusty Hook",
  "price": 29.99,
  "image": "/hook.webp",
  ...
  "manufacturer": "...",
  "warehouse_location": "...",
  "internal_sku": "...",
  "supplier_notes": "...",
  // ... 136 more fields
}
`

const goodObject = `
// Only what the card needs
{
  "id": 1,
  "name": "Rusty Hook",
  "price": 29.99,
  "image": "/hook.webp",
  "rating": 4.5,
  "reviews": 42,
  "badge": "Bestseller"
}
`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="tbt"
      option="a"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Entities have more attributes than what will be displayed</div>

      <div v-click="1" class="text-4xl text-center font-bold my-7">Trim the objects!</div>

      <div class="text-left grid grid-cols-2 text-center gap-10">
        <div v-click="2">
          <CodeSnippet
            class="text-left px-5"
            language="json"
            :code="badObject"
            size="tiny"
          />
        </div>

        <div v-click="3">
          <CodeSnippet
            class="text-left px-5"
            language="json"
            :code="goodObject"
            size="tiny"
          />
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
