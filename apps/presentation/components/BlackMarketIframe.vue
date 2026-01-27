<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  url?: string
  scale?: number
}>(), {
  url: 'https://blackmarket.florianleux.fr',
  scale: 0.6,
})

// Use a key to force iframe refresh on mount
const iframeKey = ref(Date.now())

onMounted(() => {
  // Refresh iframe each time component mounts (slide enters)
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
