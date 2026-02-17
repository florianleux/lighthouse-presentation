<script setup lang="ts">
const s = 'script'
const htmlCode = `
...
<head>
  <meta charset="UTF-8">
  <title>BlackMarket</title>

  <link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4/dist/tailwind.css" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">

  <${s} src="https://cdn.jsdelivr.net/npm/lodash@4.17/lodash.min.js"></${s}>
  <${s} src="/js/analytics.js"></${s}>
</head>
<body>
  <header class="site-header">
    ...`
</script>

<template>
  <div
    class="slide-bg-quadrant"
    style="background-image: url('/backgrounds/parchment.png'); background-position: 0% 0%;"
  >
    <DetailSlide
      class="pl-10 pt-5"
      metric="fcp"
      option="b"
    >
      <div class="gap-5 flex flex-col items-center">
        <div class="text-2xl">The browser needs both DOM and CSSOM to render the page
        </div>

        <div class="grid grid-cols-8">
          <div class=" col-span-2 relative">
            <div class="absolute left-0 right-0 items-center  mt-10">
              <span class=" font-bold">Render</span>
              <div class="flex-1 border-t-2 border-dashed border-black min-w-[20px]"></div>
            </div>
            <div class="absolute left-0 right-0 top-[50%] items-center ">
              <span class="font-bold">HTML Parser</span>
              <div class="flex-1 border-t-2 border-dashed border-black min-w-[20px]"></div>
              <span class="italic text-sm">Builds the DOM</span>
            </div>
            <div class="absolute left-0 right-0 top-[80%] items-center ">
              <span class="font-bold">Preload scanner</span>
              <div class="flex-1 border-t-2 border-dashed border-black min-w-[20px]"></div>
              <span class="italic text-sm ">Triggers the downloads</span>
            </div>
          </div>

          <div class="col-span-6">
            <CodeSnippet
              :code="htmlCode"
              language="html"
              size="tiny"
            />
          </div>
        </div>
      </div>
    </DetailSlide>
  </div>
</template>
