<script setup lang="ts">
const htmlBeforeCodeExample = `<img
  src="/banner.jpg"
  alt="Banner image"
>`
const htmlAfterCodeExample = `<img
  src="/banner.jpg"
  width="1200"
  height="630"
  class="w-full h-auto"
  alt="Banner image"
>`

const cssCodeExample = `
.w-full { width: 100%; }
.h-auto { height: auto; }
`
</script>



<template>
  <DetailSlide
    metric="cls"
    option="a"
  >
    <div class="items-center flex-grow justify-center flex  text-2xl gap-20">
      <div>
        Images don't have reserved space until loaded
      </div>
      <div>
        Starts at 0×0, then expands </div>
    </div>
    <div class="flex flex-col items-center mt-10 gap-15">
      <div>
        <div class="text-4xl font-bold">Specify dimensions</div>
      </div>
      <div class="flex items-center gap-20">
        <CodeSnippet
          language="html"
          :code="htmlBeforeCodeExample"
          size="small"
        />
        <div class="flex items-center gap-2">
          <CodeSnippet
            language="html"
            :code="htmlAfterCodeExample"
            size="small"
          />
          <CodeSnippet
            language="css"
            :code="cssCodeExample"
            size="small"
          />
        </div>

      </div>
    </div>
  </DetailSlide>
</template>
