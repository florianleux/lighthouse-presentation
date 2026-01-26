import type { PirateAvatar, SkinTone } from '../../../../shared/types'

const BASE_PATH = '/avatars/male'

export function getFacePath(skinTone: SkinTone): string {
  return `${BASE_PATH}/${skinTone}_tone/face.png`
}

export function getMouthPath(skinTone: SkinTone, option: number): string {
  return `${BASE_PATH}/${skinTone}_tone/mouth/mouth_${option}.png`
}

export function getEyesPath(skinTone: SkinTone, option: number, color: number): string {
  return `${BASE_PATH}/${skinTone}_tone/eyes/option_${option}/color_${color}.png`
}

export function getNosePath(skinTone: SkinTone, option: number): string {
  return `${BASE_PATH}/${skinTone}_tone/nose/nose_${option}.png`
}

export function getAccessoryPath(skinTone: SkinTone, option: number): string {
  return `${BASE_PATH}/${skinTone}_tone/accessories/accessory_${option}.png`
}

export function getEyePatchPath(skinTone: SkinTone, side: 'left' | 'right'): string {
  return `${BASE_PATH}/${skinTone}_tone/accessories/eye_patch_${side}.png`
}

export function getHairPath(option: number, color: number): string {
  return `${BASE_PATH}/hair/option_${option}/color_${color}.png`
}

export function getHatPath(option: number, color: number): string {
  return `${BASE_PATH}/hats/option_${option}/color_${color}.png`
}

export interface AvatarLayer {
  name: string
  path: string
  zIndex: number
}

export function getAllLayerPaths(avatar: PirateAvatar): AvatarLayer[] {
  const { skinTone } = avatar
  const layers: AvatarLayer[] = []

  // 1. Face (z-index: 1)
  layers.push({
    name: 'face',
    path: getFacePath(skinTone),
    zIndex: 1,
  })

  // 2. Mouth (z-index: 2)
  layers.push({
    name: 'mouth',
    path: getMouthPath(skinTone, avatar.mouth),
    zIndex: 2,
  })

  // 3. Eyes (z-index: 3)
  layers.push({
    name: 'eyes',
    path: getEyesPath(skinTone, avatar.eyes.option, avatar.eyes.color),
    zIndex: 3,
  })

  // 4. Accessories (z-index: 4-9)
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

  // 5. Nose (z-index: 10)
  layers.push({
    name: 'nose',
    path: getNosePath(skinTone, avatar.nose),
    zIndex: 10,
  })

  // 6. Hair (z-index: 11)
  if (avatar.hair) {
    layers.push({
      name: 'hair',
      path: getHairPath(avatar.hair.option, avatar.hair.color),
      zIndex: 11,
    })
  }

  // 7. Hat (z-index: 12)
  if (avatar.hat) {
    layers.push({
      name: 'hat',
      path: getHatPath(avatar.hat.option, avatar.hat.color),
      zIndex: 12,
    })
  }

  return layers.sort((a, b) => a.zIndex - b.zIndex)
}
