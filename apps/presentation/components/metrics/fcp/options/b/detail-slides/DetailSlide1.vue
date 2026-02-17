<script setup lang="ts">
const s = 'script'
const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BlackMarket</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4/dist/tailwind.css" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
  <link rel="stylesheet" href="/css/components.css">

  <${s} src="https://cdn.jsdelivr.net/npm/lodash@4.17/lodash.min.js"></${s}>
  <${s} src="https://cdn.jsdelivr.net/npm/axios@1.6/dist/axios.min.js"></${s}>
  <${s} src="/js/analytics.js"></${s}>
  <${s} src="/js/utils.js"></${s}>
</head>
<body>
  <header class="site-header">
    ...`
</script>

<template>
  <div class="slide-background">
    <DetailSlide
      metric="fcp"
      option="b"
    >
      <div class="grid grid-cols-8">
        <div class=" col-span-2">
          <div class="flex items-center gap-2">
            <span class="text-green-400 font-bold text-sm">Rendering</span>
            <div class="flex-1 border-t-2 border-dashed border-green-400 min-w-[20px]"></div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-blue-400 font-bold text-sm">Parsing</span>
            <div class="flex-1 border-t-2 border-dashed border-blue-400 min-w-[20px]"></div>
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
    </DetailSlide>
  </div>
</template>

<style scoped>
.slide-background {
  position: absolute;
  inset: 0;
  background-image: url('/backgrounds/parchment.png');
  background-size: 200% 200%;
  background-position: 100% 0%;
  padding: 2rem;
}
</style>
