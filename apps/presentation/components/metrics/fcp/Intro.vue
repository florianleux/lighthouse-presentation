<!-- TODO: Review MetricIntro content (tags, thresholds, formula) -->
<script setup lang="ts">
import MetricIntro from '../../MetricIntro.vue'
</script>

<template>
  <MetricIntro metric="fcp">
    <template #bottom>
      <div
        v-click="6"
        class="mt-5 relative"
      >
        <div class="pb-2 grid grid-cols-2 gap-2 text-center text-xl">
          <span
            v-click="7"
            class="text-blue-500 font-title text-2xl"
          >TTFB</span>
          <span
            v-click="8"
            class="text-green-500 font-title text-2xl"
          >Rendering path</span>
        </div>
        <!-- Timeline bar -->
        <div class="-mt-1 h-2 bg-gray-300 rounded-full relative">
          <!-- TTFB section -->
          <div class="absolute left-0 w-1/2 h-full bg-blue-400 rounded-l-full"></div>
          <!-- Rendering path section -->
          <div class="absolute left-1/2 w-1/2 h-full bg-green-400 rounded-r-full"></div>
        </div>
        <!-- Markers -->
        <div class="grid grid-cols-6">

          <div class="text-md mt-1">Navigation</div>

          <div class="flex flex-col text-center mt-2">
            <!-- <div class="text-xs"> DNS - TCP - TLS </div>
            <div class="text-xs"> Request sent</div>
            <div class="text-xs"> Server</div>
            <div class="text-xs"> Transit </div> -->
          </div>
          <div class="flex flex-col items-center col-span-2">
            <span class="text-md mt-1">First byte</span>
          </div>
          <div class="flex flex-col text-center mt-2">
            <!-- <div class="text-xs"> Parsing </div>
            <div class="text-xs"> Render Tree</div>
            <div class="text-xs"> Layout</div>
            <div class="text-xs"> Paint </div> -->
          </div>
          <div class="text-right text-md mt-1">FCP</div>

        </div>
      </div>
    </template>
    <template #right>
      <img
        src="/images/fcp.gif"
        alt="FCP demo"
        class="absolute right-[10%] top-[12%] h-[75%] w-auto rounded shadow-md"
      />
    </template>
  </MetricIntro>
</template>
