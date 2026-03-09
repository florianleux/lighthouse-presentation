<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const badFetch = `
// GET /api/products → 1000 items
[
  { "id": 1, "name": "Rusty Hook", ... },
  { "id": 2, "name": "Skull Bandana", ... },
  { "id": 3, "name": "Compass", ... },
  ...
  { "id": 1000, "name": "Parrot Perch", ... }
]
`

const goodFetch = `
// GET /api/products?limit=20 → 20 items
[
  { "id": 1, "name": "Rusty Hook", ... },
  { "id": 2, "name": "Skull Bandana", ... },
  ...
  { "id": 20, "name": "Treasure Map", ... }
]
`
</script>

<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="tbt"
      option="a"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">Every JSON you receive will be parsed</div>

      <div v-click="1" class="text-4xl text-center font-bold my-7">Paginate in the backend!</div>

      <div class="text-left grid grid-cols-2 text-center gap-10">
        <div v-click="2">
          <CodeSnippet
            class="text-left px-5"
            language="json"
            :code="badFetch"
            size="tiny"
          />
        </div>

        <div v-click="3">
          <CodeSnippet
            class="text-left px-5"
            language="json"
            :code="goodFetch"
            size="tiny"
          />
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
