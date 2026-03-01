<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  url?: string
  scale?: number
  delay?: number
}>(), {
  url: 'https://blackmarket.florianleux.fr',
  scale: 0.6,
  delay: 3000,
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
  <div ref="container" class="w-full h-full">
    <iframe
      v-if="shouldLoad"
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
