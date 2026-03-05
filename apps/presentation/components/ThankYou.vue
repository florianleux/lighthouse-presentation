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
    style="background-image: url('/backgrounds/end-top.png')"
  >
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
      <div class="text-9xl text-white font-bold font-title">Thank you!</div>
    </div>

    <!-- Rolling credits -->
    <div
      v-if="crewNames.length > 0"
      class="absolute inset-0 overflow-hidden pointer-events-none z-20"
    >

      <div class="credits-scroll absolute w-full flex flex-col items-center gap-3 text-white text-xl">
        <span class="text-4xl text-white font-title">THE CREW
        </span>
        <span
          v-for="(name, i) in crewNames"
          :key="i"
        >{{ name }}</span>
        <!-- Duplicate for seamless loop -->
        <span
          v-for="(name, i) in crewNames"
          :key="'dup-' + i"
        >{{ name }}</span>
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
