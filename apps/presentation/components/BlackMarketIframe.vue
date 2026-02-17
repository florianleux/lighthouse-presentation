<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useNav } from '@slidev/client'

const props = withDefaults(defineProps<{
  url?: string
  scale?: number
  delay?: number
}>(), {
  url: 'https://blackmarket.florianleux.fr',
  scale: 0.6,
  delay: 3000, // Delay in ms before loading iframe (default: 3s for transition)
})

const { currentSlideNo } = useNav()

// Use a key to force iframe refresh when entering the slide
const iframeKey = ref(Date.now())
const shouldLoad = ref(false)

// Delay initial load
onMounted(() => {
  setTimeout(() => {
    shouldLoad.value = true
  }, props.delay)
})

// Refresh iframe each time the slide changes
watch(currentSlideNo, () => {
  shouldLoad.value = false
  setTimeout(() => {
    iframeKey.value = Date.now()
    shouldLoad.value = true
  }, props.delay)
})

const scalePercent = 100 / props.scale
</script>

<template>
  <iframe
    v-if="shouldLoad"
    :key="iframeKey"
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
