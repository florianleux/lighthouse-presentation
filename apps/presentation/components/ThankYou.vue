<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore } from '../setup/main'

const crewNames = computed(() =>
  sessionStore.crew.map(m => m.name)
)
</script>

<template>
  <div
    class="relative slide-bg text-shadow-md overflow-hidden"
    style="background-image: url('/backgrounds/end-top-right.webp')"
  >
    <div class="absolute left-[77%] top-[30%] -translate-1/2 text-center z-10 pointer-events-none  w-[50%]">
      <div class="text-8xl text-white font-bold font-title">Thank you!</div>
    </div>

    <!-- Rolling credits -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-20">

      <div class="credits-scroll absolute flex flex-col items-center gap-3 text-white text-xl w-[50%]">
        <span class="text-3xl text-white font-title">Very special thanks to</span>
        <div class="grid grid-cols-3 gap-x-12 gap-y-2 text-center my-4">
          <span>Guigz</span>
          <span>Tom</span>
          <span>Kriyss</span>
          <span>Gui</span>
          <span>François</span>
          <span>Tony</span>
        </div>
        <span class="-mt-5 mb-8">Florian L</span>

        <template v-if="crewNames.length > 0">
          <span class="text-4xl text-white font-title">THE CREW</span>
          <span
            v-for="(name, i) in crewNames"
            :key="i"
          >{{ name }}</span>
          <!-- Duplicate for seamless loop -->
          <span
            v-for="(name, i) in crewNames"
            :key="'dup-' + i"
          >{{ name }}</span>
        </template>

      </div>
    </div>
  </div>
</template>

<style scoped>
.credits-scroll {
  top: 100%;
  animation: scroll-up 60s linear infinite;
}

@keyframes scroll-up {
  0% {
    top: 100%;
  }

  100% {
    top: -100%;
  }
}
</style>
