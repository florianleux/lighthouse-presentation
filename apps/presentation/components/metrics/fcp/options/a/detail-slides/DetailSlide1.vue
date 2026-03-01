<script setup lang="ts">
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/cls-detail-1.webp');"
  >
    <DetailSlide
      class="pl-10 pt-5"
      metric="fcp"
      option="a"
    >
      <div class="mt-5 flex flex-col items-center">
        <div>The starting point for all other metrics. </div>
        <div class="relative mt-10 w-full">

          <div class="flex rounded overflow-hidden h-8">
            <div
              class="font-bold   bg-green-500 bg-opacity-10 border-2 border-r-0 border-green-500 text-green-500 flex-1 flex items-center justify-center text-sm"
            >Good</div>
            <div
              class="font-bold bg-orange-500 bg-opacity-10 border-y-2 border-orange-500 text-orange-500 flex-1 flex items-center justify-center text-sm"
            >
              Average</div>
            <div
              class="font-bold bg-red-500 bg-opacity-10 border-2 border-l-0 border-red-500 text-red-500 flex-1 flex items-center justify-center text-sm"
            >
              Poor</div>
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
        <!-- TTFB breakdown timeline -->
        <div class="mt-10 w-full">
          <div class="grid grid-cols-7 gap-0.5">
            <div class="bg-yellow-300 text-yellow-900 text-xs px-2 py-2 rounded text-center font-semibold">Redirect</div>
            <div class="bg-yellow-400 text-yellow-900 text-xs px-2 py-2 rounded text-center font-semibold">HTTP Cache</div>
            <div class="bg-amber-400 text-amber-900 text-xs px-2 py-2 rounded text-center font-semibold">DNS</div>
            <div class="bg-amber-500 text-white text-xs px-2 py-2 rounded text-center font-semibold">TCP + TLS</div>
            <div class="bg-orange-400 text-white text-xs px-2 py-2 rounded text-center font-semibold">Request</div>
            <div class="bg-orange-500 text-white text-xs px-2 py-2 rounded text-center font-semibold">Server Processing</div>
            <div class="bg-orange-600 text-white text-xs px-2 py-2 rounded text-center font-semibold">Response</div>
          </div>
        </div>

      </div>


    </DetailSlide>
  </div>
</template>
