<script setup lang="ts">
const stickyPositionCodeExample = `
.sticky-chat {
  position: sticky;
  top: 20px;
  height: 600px;
  width: 160px;
}
`

const facadeVideoCodeExample = `
<div class="youtube-facade">
  <img
    src="thumbnail.jpg"
    alt="Video thumbnail"
    width="1280"
    height="720"
  >
  ... svg for play button ...
</div>
`
</script>

<template>
  <DetailSlide
    metric="cls"
    option="b"
  >
    <div class="grid grid-cols-2 gap-10">
      <div class="flex flex-col items-center justify-top gap-6">
        <div class="text-center">
          Everything in the flow can cause shift
        </div>
        <div class="text-4xl text-center font-bold">Sticky and fixed elements</div>
        <CodeSnippet
          language="css"
          :code="stickyPositionCodeExample"
          size="small"
        />


      </div>
      <div class="flex flex-col items-cente justify-top gap-6">
        <div class="text-center">
          Static content loads faster
        </div>
        <div class="text-4xl text-center font-bold">Facade videos</div>
        <div class="px-10">
          <CodeSnippet
            language="html"
            :code="facadeVideoCodeExample"
            size="small"
          />
        </div>

      </div>

    </div>

  </DetailSlide>
</template>
