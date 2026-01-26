<script setup lang="ts">
import { computed } from 'vue'
import type { PirateAvatar } from '../../../../shared/types'
import { getAllLayerPaths } from '../utils/avatarPaths'

const props = withDefaults(defineProps<{
  avatar: PirateAvatar | string
  size?: number
}>(), {
  size: 200,
})

const parsedAvatar = computed<PirateAvatar>(() => {
  if (typeof props.avatar === 'string') {
    try {
      return JSON.parse(props.avatar)
    } catch {
      // Return a default avatar if parsing fails
      return {
        skinTone: 'mid',
        mouth: 1,
        eyes: { option: 1, color: 1 },
        nose: 1,
        accessories: { regular: [], eyePatch: null },
        hair: null,
        hat: null,
      }
    }
  }
  return props.avatar
})

const layers = computed(() => getAllLayerPaths(parsedAvatar.value))
</script>

<template>
  <div
    class="avatar-container"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <img
      v-for="layer in layers"
      :key="layer.name"
      :src="layer.path"
      :alt="layer.name"
      class="avatar-layer"
      :style="{ zIndex: layer.zIndex }"
    />
  </div>
</template>

<style scoped>
.avatar-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.avatar-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
