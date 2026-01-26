import { ref } from 'vue'
import type { PirateAvatar, SkinTone } from '../../../../shared/types'
import { AVATAR_CONFIG } from '../../../../shared/constants'

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability
}

function generateRandomAvatar(skinTone: SkinTone): PirateAvatar {
  // Random accessories (0-4 regular items)
  const numAccessories = randomInt(0, AVATAR_CONFIG.ACCESSORY_COUNT)
  const regular: number[] = []
  const availableAccessories = [1, 2, 3, 4]
  for (let i = 0; i < numAccessories; i++) {
    const idx = randomInt(0, availableAccessories.length - 1)
    regular.push(availableAccessories.splice(idx, 1)[0])
  }

  // Eye patch (mutually exclusive: left OR right OR none)
  let eyePatch: 'left' | 'right' | null = null
  if (randomBoolean(0.3)) {
    eyePatch = randomBoolean() ? 'left' : 'right'
  }

  return {
    skinTone,
    mouth: randomInt(1, AVATAR_CONFIG.MOUTH_COUNT),
    eyes: {
      option: randomInt(1, AVATAR_CONFIG.EYE_OPTIONS),
      color: randomInt(1, AVATAR_CONFIG.EYE_COLORS),
    },
    nose: randomInt(1, AVATAR_CONFIG.NOSE_COUNT),
    accessories: { regular, eyePatch },
    hair: randomBoolean(0.8)
      ? {
          option: randomInt(1, AVATAR_CONFIG.HAIR_OPTIONS),
          color: randomInt(1, AVATAR_CONFIG.HAIR_COLORS),
        }
      : null,
    hat: randomBoolean(0.7)
      ? {
          option: randomInt(1, AVATAR_CONFIG.HAT_OPTIONS),
          color: randomInt(1, AVATAR_CONFIG.HAT_COLORS),
        }
      : null,
  }
}

export function useAvatar(initialSkinTone: SkinTone = 'mid') {
  const avatar = ref<PirateAvatar>(generateRandomAvatar(initialSkinTone))
  const isSpinning = ref(false)

  function randomize(skinTone?: SkinTone) {
    avatar.value = generateRandomAvatar(skinTone || avatar.value.skinTone)
  }

  // Slot machine effect: rapidly cycle through random avatars before settling
  async function spinAndRandomize(): Promise<void> {
    if (isSpinning.value) return

    isSpinning.value = true
    const currentSkinTone = avatar.value.skinTone
    const targetAvatar = generateRandomAvatar(currentSkinTone)

    // Spin phases: fast → medium → slow → settle
    const phases = [
      { iterations: 8, delay: 50 },   // Fast
      { iterations: 6, delay: 100 },  // Medium
      { iterations: 4, delay: 150 },  // Slow
      { iterations: 3, delay: 200 },  // Very slow
    ]

    for (const phase of phases) {
      for (let i = 0; i < phase.iterations; i++) {
        avatar.value = generateRandomAvatar(currentSkinTone)
        await new Promise(resolve => setTimeout(resolve, phase.delay))
      }
    }

    // Final settle on target
    avatar.value = targetAvatar
    isSpinning.value = false
  }

  // Change skin tone while keeping the same combination
  function setSkinTone(skinTone: SkinTone) {
    avatar.value = {
      ...avatar.value,
      skinTone,
    }
  }

  function serialize(): string {
    return JSON.stringify(avatar.value)
  }

  function deserialize(json: string): PirateAvatar {
    return JSON.parse(json)
  }

  function load(json: string) {
    avatar.value = deserialize(json)
  }

  return {
    avatar,
    isSpinning,
    randomize,
    spinAndRandomize,
    setSkinTone,
    serialize,
    deserialize,
    load,
  }
}
