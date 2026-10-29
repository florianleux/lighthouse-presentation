<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { sessionStore } from '../setup/main'

const props = withDefaults(defineProps<{
  url?: string
  // Mode local (hors ligne) : capture affichée à la place de l'iframe
  screenshot?: string
  scale?: number
  delay?: number
}>(), {
  url: 'https://blackmarket.florianleux.fr',
  screenshot: '/blackmarket/main.png',
  scale: 0.6,
  delay: 1000,
})

const shouldLoad = ref(false)
const container = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!container.value) return
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !shouldLoad.value) {
        setTimeout(() => {
          shouldLoad.value = true
        }, props.delay)
        observer?.disconnect()
      }
    },
    { threshold: 0.5 },
  )
  observer.observe(container.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

const scalePercent = 100 / props.scale
</script>

<template>
  <div
    ref="container"
    class="w-full h-full"
  >
    <img
      v-if="sessionStore.localMode"
      :src="screenshot"
      class="w-full h-full object-cover object-top"
      alt=""
    />
    <iframe
      v-else-if="shouldLoad"
      :src="url"
      class="w-full h-full border-0"
      :style="{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${scalePercent}%`,
        height: `${scalePercent}%`,
      }"
    />
  </div>
</template>
