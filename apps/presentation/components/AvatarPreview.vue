<script setup lang="ts">
import { computed } from 'vue'
import type { PirateAvatar, SkinTone } from '../../../shared/types'

const props = withDefaults(defineProps<{
  avatar: PirateAvatar | string
  size?: number
}>(), {
  size: 60,
})

const BASE_PATH = '/avatars/male'

function getFacePath(skinTone: SkinTone): string {
  return `${BASE_PATH}/${skinTone}_tone/face.png`
}

function getMouthPath(skinTone: SkinTone, option: number): string {
  return `${BASE_PATH}/${skinTone}_tone/mouth/mouth_${option}.png`
}

function getEyesPath(skinTone: SkinTone, option: number, color: number): string {
  return `${BASE_PATH}/${skinTone}_tone/eyes/option_${option}/color_${color}.png`
}

function getNosePath(skinTone: SkinTone, option: number): string {
  return `${BASE_PATH}/${skinTone}_tone/nose/nose_${option}.png`
}

function getAccessoryPath(skinTone: SkinTone, option: number): string {
  return `${BASE_PATH}/${skinTone}_tone/accessories/accessory_${option}.png`
}

function getEyePatchPath(skinTone: SkinTone, side: 'left' | 'right'): string {
  return `${BASE_PATH}/${skinTone}_tone/accessories/eye_patch_${side}.png`
}

function getHairPath(option: number, color: number): string {
  return `${BASE_PATH}/hair/option_${option}/color_${color}.png`
}

function getHatPath(option: number, color: number): string {
  return `${BASE_PATH}/hats/option_${option}/color_${color}.png`
}

interface AvatarLayer {
  name: string
  path: string
  zIndex: number
}

function getAllLayerPaths(avatar: PirateAvatar): AvatarLayer[] {
  const { skinTone } = avatar
  const layers: AvatarLayer[] = []

  layers.push({ name: 'face', path: getFacePath(skinTone), zIndex: 1 })
  layers.push({ name: 'mouth', path: getMouthPath(skinTone, avatar.mouth), zIndex: 2 })
  layers.push({ name: 'eyes', path: getEyesPath(skinTone, avatar.eyes.option, avatar.eyes.color), zIndex: 3 })

  let accessoryZIndex = 4
  for (const accessoryOption of avatar.accessories.regular) {
    layers.push({
      name: `accessory_${accessoryOption}`,
      path: getAccessoryPath(skinTone, accessoryOption),
      zIndex: accessoryZIndex++,
    })
  }
  if (avatar.accessories.eyePatch) {
    layers.push({
      name: `eye_patch_${avatar.accessories.eyePatch}`,
      path: getEyePatchPath(skinTone, avatar.accessories.eyePatch),
      zIndex: accessoryZIndex++,
    })
  }

  layers.push({ name: 'nose', path: getNosePath(skinTone, avatar.nose), zIndex: 10 })

  if (avatar.hair) {
    layers.push({ name: 'hair', path: getHairPath(avatar.hair.option, avatar.hair.color), zIndex: 11 })
  }

  if (avatar.hat) {
    layers.push({ name: 'hat', path: getHatPath(avatar.hat.option, avatar.hat.color), zIndex: 12 })
  }

  return layers.sort((a, b) => a.zIndex - b.zIndex)
}

const parsedAvatar = computed<PirateAvatar | null>(() => {
  if (typeof props.avatar === 'string') {
    try {
      return JSON.parse(props.avatar)
    } catch {
      return null
    }
  }
  return props.avatar
})

const layers = computed(() => parsedAvatar.value ? getAllLayerPaths(parsedAvatar.value) : [])
const isValidAvatar = computed(() => parsedAvatar.value !== null && layers.value.length > 0)
</script>

<template>
  <div
    v-if="isValidAvatar"
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
  <div v-else class="avatar-fallback" :style="{ width: size + 'px', height: size + 'px', fontSize: (size * 0.6) + 'px' }">
    👤
  </div>
</template>

<style scoped>
.avatar-container {
  position: relative;
  background: transparent;
  /* Multiple drop-shadows create a solid outline following the PNG shape */
  filter:
    drop-shadow(1px 0 0 white)
    drop-shadow(-1px 0 0 white)
    drop-shadow(0 1px 0 white)
    drop-shadow(0 -1px 0 white)
    drop-shadow(1px 1px 0 white)
    drop-shadow(-1px -1px 0 white)
    drop-shadow(1px -1px 0 white)
    drop-shadow(-1px 1px 0 white);
}

.avatar-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: transparent;
}

.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
