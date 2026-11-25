<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { sessionStore } from '../setup/main'

const props = withDefaults(defineProps<{
  url?: string
  // Mode local : capture affichée tant que le site n'est pas joignable
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

// Mode local : on ne passe à l'iframe que si le site répond (sinon elle resterait vide)
const isReachable = ref(false)

async function probe() {
  try {
    await fetch(props.url, { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(3000) })
    isReachable.value = true
  } catch {
    // Hors ligne : on garde la capture
  }
}

watch(() => sessionStore.localMode, (local) => {
  if (local) probe()
}, { immediate: true })

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
      v-if="shouldLoad && sessionStore.localMode && !isReachable"
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
