<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  url?: string
  scale?: number
  delay?: number
}>(), {
  url: 'https://blackmarket.florianleux.fr',
  scale: 0.6,
  delay: 3000, // Delay in ms before loading iframe (default: 3s for transition)
})

// Use a key to force iframe refresh when entering the slide
const iframeKey = ref(Date.now())
const shouldLoad = ref(false)

// Delay initial load
onMounted(() => {
  setTimeout(() => {
    shouldLoad.value = true
  }, props.delay)

  // Try to watch slide changes if Slidev context is available
  import('@slidev/client').then(({ useNav }) => {
    try {
      const { currentSlideNo } = useNav()
      watch(currentSlideNo, () => {
        shouldLoad.value = false
        setTimeout(() => {
          iframeKey.value = Date.now()
          shouldLoad.value = true
        }, props.delay)
      })
    } catch {
      // useNav() failed - router not available
    }
  }).catch(() => {
    // Import failed
  })
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
