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
      <div class=" flex flex-col items-center ">
        <div class=" w-[70%] relative ">
          <div class="flex rounded mx-auto overflow-hidden h-8">
            <div
              class="bg-green-500 border-1 border-r-0 border-green-800 font-bold text-green-900 flex-1 flex items-center justify-center text-md"
            >Good</div>
            <div
              class="bg-orange-500 border-y-1 border-orange-800 text-orange-900 font-bold flex-1 flex items-center justify-center text-md"
            >Average</div>
            <div
              class="bg-red-500 border-1 border-l-0 border-red-800 text-red-900 font-bold flex-1 flex items-center justify-center text-md"
            >Poor</div>
          </div>
          <span
            class="absolute text-black font-title font-bold text-xl"
            style="left: 33%; top: 150%; transform: translate(-50%, -50%)"
          >800ms</span>
          <span
            class="absolute text-black font-title font-bold text-xl"
            style="left: 66%; top: 150%; transform: translate(-50%, -50%)"
          >1800ms</span>
        </div>

        <div class="text-4xl mt-15">The starting point for all other metrics. </div>

        <!-- TTFB breakdown timeline
        <div class="mt-20 w-[90%]">
          <div class="grid grid-cols-7 gap-0.5">
            <div class="bg-yellow-300 text-yellow-900 text-xs px-2 py-2 rounded text-center font-semibold">Redirect
            </div>
            <div class="bg-yellow-400 text-yellow-900 text-xs px-2 py-2 rounded text-center font-semibold">HTTP Cache
            </div>
            <div class="bg-amber-400 text-amber-900 text-xs px-2 py-2 rounded text-center font-semibold">DNS</div>
            <div class="bg-amber-500 text-white text-xs px-2 py-2 rounded text-center font-semibold">TCP + TLS</div>
            <div class="bg-orange-400 text-white text-xs px-2 py-2 rounded text-center font-semibold">Request</div>
            <div class="bg-orange-500 text-white text-xs px-2 py-2 rounded text-center font-semibold">Server Processing
            </div>
            <div class="bg-orange-600 text-white text-xs px-2 py-2 rounded text-center font-semibold">Response</div>
          </div>
        </div>
        -->

      </div>

      <!-- Client island (left) -->
      <img
        src="/images/ttfb/island-client.png"
        class="absolute left-[20%] top-[75%] -translate-1/2 h-[35%]"
      />
      <img
        src="/images/ttfb/pirate.png"
        class="absolute left-[20%] top-[68%] -translate-1/2 h-[25%]"
      />

      <!-- Server island (right) -->
      <img
        src="/images/ttfb/island-server.png"
        class="absolute left-[80%] top-[75%] -translate-1/2 h-[35%]"
      />
      <img
        src="/images/ttfb/server.png"
        class="absolute left-[80%] top-[68%] -translate-1/2 h-[25%]"
      />

    </DetailSlide>
  </div>
</template>
