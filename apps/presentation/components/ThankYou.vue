<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNav } from '@slidev/client'
import { sessionStore, currentPhase, publishSessionState } from '../setup/main'

const { currentSlideNo } = useNav()

const crewNames = computed(() =>
  sessionStore.crew.map(m => m.name)
)

const slideEl = ref<HTMLElement | null>(null)

function isSlideVisible(): boolean {
  if (!slideEl.value) return false
  const rect = slideEl.value.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
}

watch(currentSlideNo, () => {
  setTimeout(() => {
    if (isSlideVisible() && currentPhase.value !== 'finished') {
      currentPhase.value = 'finished'
      publishSessionState()
    }
  }, 200)
})
</script>

<template>
  <div
    ref="slideEl"
    class="relative slide-bg text-shadow-md overflow-hidden"
    style="background-image: url('/backgrounds/end-top-right.webp')"
  >
    <div class="absolute left-[77%] top-[30%] -translate-1/2 text-center z-10 pointer-events-none  w-[50%]">
      <div class="text-8xl text-white font-bold font-title">Thank you!</div>
    </div>

    <!-- Rolling credits -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-20">

      <div class="credits-scroll absolute flex flex-col items-center gap-3 text-white text-xl w-[50%]">
        <span class="text-5xl text-white font-title">Very special thanks to</span>
        <div class="text-2xl grid grid-cols-3 gap-x-12 gap-y-2 text-center my-4">
          <span>Guigz</span>
          <span>Tom</span>
          <span>Kriyss</span>
          <span>Gui</span>
          <span>François</span>
          <span>Tony</span>
          <span>Floby</span>
          <span>Florian L</span>
        </div>

        <template v-if="crewNames.length > 0">
          <span class="text-5xl text-white font-title">THE CREW</span>
          <span
            v-for="(name, i) in crewNames"
            :key="i"
            class="text-2xl"
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
