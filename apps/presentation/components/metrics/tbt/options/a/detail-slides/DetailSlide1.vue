<script setup lang="ts">
const badFetch = `
// GET /api/products → 1000 items
[
  { "id": 1, "name": "Hook",...},
  { "id": 2, "name": "Bandana",...},
  { "id": 3, "name": "Compass",...},
  ...
  { "id": 999, "name": "Parrot",...}
]
`

const goodFetch = `
// GET /api/products?limit=20
[
  { "id": 1, "name": "Hook",...},
  { "id": 2, "name": "Bandana",...},
  ...
  { "id": 11, "name": "Parrot",...}
  { "id": 12, "name": "Map",...}
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
      <div class="text-5xl text-center mb-15 mt-5">Paginate and filter on the backend</div>

      <div class="w-[104%] -ml-5 text-left grid grid-cols-2 text-center">
        <div v-click="1">
          <CodeSnippet
            class="text-left px-5"
            language="json"
            :code="badFetch"
            size="medium"
          />
        </div>

        <div v-click="2">
          <CodeSnippet
            class="text-left px-5"
            language="json"
            :code="goodFetch"
            size="medium"
          />
        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
