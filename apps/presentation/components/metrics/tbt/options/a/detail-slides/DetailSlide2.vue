<script setup lang="ts">
const badObject = `
{
  "name": "Rusty Hook",
  "price": 29.99,
  "image": "/hook.webp",
  ...
  "manufacturer": "...",
  "internal_sku": "...",
  "supplier_notes": "...",
  // ... 136 more fields
}
`

const goodObject = `
{
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
      <div class="text-4xl text-center mb-10">Trim down the unused fields!</div>

      <div class="w-[108%] -ml-10 text-left grid grid-cols-2 text-center gap-0">
        <div v-click="1">
          <CodeSnippet
            class="text-left px-5"
            language="json"
            :code="badObject"
            size="medium"
          />
        </div>

        <div v-click="2">
          <CodeSnippet
            class="text-left px-5"
            language="json"
            :code="goodObject"
            size="medium"
          />
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
