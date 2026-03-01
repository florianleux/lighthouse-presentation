<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  url?: string
  scale?: number
  delay?: number
}>(), {
  url: 'https://blackmarket.florianleux.fr',
  scale: 0.6,
  delay: 3000, // Delay in ms before loading iframe (default: 3s for transition)
})

const shouldLoad = ref(false)

// Delay initial load to let slide transition finish
onMounted(() => {
  setTimeout(() => {
    shouldLoad.value = true
  }, props.delay)
})

const scalePercent = 100 / props.scale
</script>

<template>
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
</template>
