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
      const parsed = JSON.parse(props.avatar)
      // Handle legacy avatars without gender field
      if (!parsed.gender) {
        parsed.gender = 'male'
      }
      return parsed
    } catch {
      // Return a default avatar if parsing fails
      return {
        gender: 'male',
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
    class="avatar-container relative rounded-2xl overflow-hidden"
    :style="size ? { width: size + 'px', height: size + 'px' } : {}"
  >
    <img
      v-for="layer in layers"
      :key="layer.name"
      :src="layer.path"
      :alt="layer.name"
      class="avatar-layer absolute top-0 left-0 w-full h-full object-contain"
      :style="{ zIndex: layer.zIndex }"
    />
  </div>
</template>

