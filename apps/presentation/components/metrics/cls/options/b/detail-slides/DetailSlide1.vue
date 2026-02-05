<script setup lang="ts">
const codeExample = `<div
  id="adContainer"
  style="min-height: 250px; min-width: 300px;"
>
  <!-- Ad script injects here -->
</div>`
</script>

<template>
  <DetailSlide metric="cls" option="b">
    <div class="items-center flex-grow justify-center flex mt-5 text-2xl gap-12">
      <div>
        Not designed by us
      </div>
      <div>
        Asynchronous loading
      </div>
      <div>
        Possible dynamic content
      </div>
    </div>
    <div class="flex flex-col items-center gap-8">
      <div>
        <div class="text-4xl font-bold">Reserve space</div>
      </div>
      <div>
        <CodeSnippet
          language="html"
          :code="codeExample"
          size="medium"
        />
      </div>
    </div>
  </DetailSlide>
</template>
