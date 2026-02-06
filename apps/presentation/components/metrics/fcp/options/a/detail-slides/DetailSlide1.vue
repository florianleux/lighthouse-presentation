<script setup lang="ts">
</script>

<template>
  <DetailSlide
    metric="fcp"
    option="a"
  >
    <div class="-mt-5 flex flex-col items-center">
      <div>The starting point for all other metrics. </div>
      <div class="relative mt-2 w-full">

        <div class="flex rounded overflow-hidden h-8">
          <div
            class="bg-white border-1 border-r-0 border-green-500 text-green-500 flex-1 flex items-center justify-center text-sm"
          >Good</div>
          <div
            class="bg-white border-y-1 border-orange-500 text-orange-500 flex-1 flex items-center justify-center text-sm"
          >Average</div>
          <div
            class="bg-white border-1 border-l-0 border-red-500 text-red-500 flex-1 flex items-center justify-center text-sm"
          >Poor</div>
        </div>
        <span
          class="absolute text-green-500 font-bold text-sm"
          style="left: 33%; top: 50%; transform: translate(-50%, -50%)"
        >800ms</span>
        <span
          class="absolute text-sm text-red-500 font-bold"
          style="left: 66%; top: 50%; transform: translate(-50%, -50%)"
        >1800ms</span>
      </div>
      <!-- <div class="mt-5 flex flex-col text-2xl items-center gap-5">
        Minimize transit distance.
      </div> -->
      <div class="mt-15 grid grid-cols-2 items-center justify-center gap-15">
        <div class="flex flex-col items-center text-center gap-10">
          <div class="font-bold  text-center ">Avoid extra round trips</div>
          <div class="text-4xl font-bold">HSTS - URLs Consistency</div>
          <div class="text-lg bg-green-500 p-10"> PLACEHOLDER SCHEMA</div>
        </div>
        <div class="flex flex-col items-center gap-10">
          <div class="font-bold text-center ">Shorten transit distance</div>
          <div class="text-4xl font-bold">Use a CDN</div>
          <div class="text-lg bg-green-500 p-10"> PLACEHOLDER SCHEMA</div>
        </div>
      </div>
    </div>


  </DetailSlide>
</template>
