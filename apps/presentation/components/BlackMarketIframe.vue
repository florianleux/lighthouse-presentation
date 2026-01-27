<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNav } from '@slidev/client'

const props = withDefaults(defineProps<{
  url?: string
  scale?: number
}>(), {
  url: 'https://blackmarket.florianleux.fr',
  scale: 0.6,
})

const { currentSlideNo } = useNav()

// Use a key to force iframe refresh when entering the slide
const iframeKey = ref(Date.now())

// Refresh iframe each time the slide changes
watch(currentSlideNo, () => {
  iframeKey.value = Date.now()
})

const scalePercent = 100 / props.scale
</script>

<template>
  <iframe
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
