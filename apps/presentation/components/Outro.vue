<script setup lang="ts">
import LighthouseBuilding from './LighthouseBuilding.vue'
</script>

<template>
  <div
    class="relative slide-bg text-shadow-md"
    style="background-image: url('/backgrounds/end-bottom.webp')"
  >
    <div class="absolute">
      <div class="text-4xl text-[#F9A8C2]">End of day 5</div>
      <div class="text-5xl mt-4 text-white font-bold font-title">
        Lighthouse <br> complete!
      </div>

    </div>

    <div class="absolute left-[84.5%] bottom-[18%] top-[4%] -translate-x-1/2 h-[78%] w-[50%]">
      <LighthouseBuilding />
    </div>
  </div>
</template>
