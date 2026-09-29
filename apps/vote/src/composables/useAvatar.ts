import { ref } from 'vue'
import type { Gender, PirateAvatar, SkinTone } from '../../../../shared/types'
import { AVATAR_CONFIG } from '../../../../shared/constants'
import { accessoryCount, getPoolUrls, range } from '../utils/avatarPaths'
import { preloadImage } from '../utils/preloadImage'

const DEFAULT_GENDER: Gender = 'male'
const DEFAULT_SKIN_TONE: SkinTone = 'light'
// Attente maximale du pool avant un spin : au-delà, on tourne quand même.
const SPIN_MAX_WAIT_MS = 3000

const preloadedPools = new Map<string, Promise<void>>()

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Précharge (une seule fois) tous les calques d'un genre + carnation : un spin
// tire ~21 avatars en 2 s et, à froid, les visages s'affichent à moitié
// composés. Sans argument : le pool de l'avatar par défaut.
export function preloadAvatarPool(gender = DEFAULT_GENDER, skinTone = DEFAULT_SKIN_TONE): Promise<void> {
  const key = `${gender}/${skinTone}`
  let pool = preloadedPools.get(key)
  if (!pool) {
    pool = Promise.all(getPoolUrls(gender, skinTone).map(preloadImage)).then(() => {})
    preloadedPools.set(key, pool)
  }
  return pool
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability
}

function generateRandomAvatar(gender: Gender, skinTone: SkinTone): PirateAvatar {
  // Random accessories (0-3 for female, 0-4 for male)
  const maxAccessories = accessoryCount(gender)
  const numAccessories = randomInt(0, maxAccessories)
  const regular: number[] = []
  const availableAccessories = range(maxAccessories)
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
    gender,
    skinTone,
    mouth: randomInt(1, AVATAR_CONFIG.MOUTH_COUNT),
    eyes: {
      option: randomInt(1, AVATAR_CONFIG.EYE_OPTIONS),
      color: randomInt(1, AVATAR_CONFIG.EYE_COLORS),
    },
    nose: randomInt(1, AVATAR_CONFIG.NOSE_COUNT),
    accessories: { regular, eyePatch },
    hair: randomBoolean(0.75) // 1/4 chance of bald (same as each hair type)
      ? {
          option: randomInt(1, AVATAR_CONFIG.HAIR_OPTIONS),
          color: randomInt(1, AVATAR_CONFIG.HAIR_COLORS),
        }
      : null,
    hat: randomBoolean(2 / 3) // 1/3 chance of no hat (same weight as each hat type)
      ? {
          option: randomInt(1, AVATAR_CONFIG.HAT_OPTIONS),
          color: randomInt(1, AVATAR_CONFIG.HAT_COLORS),
        }
      : null,
  }
}

export function useAvatar(initialGender: Gender = DEFAULT_GENDER, initialSkinTone: SkinTone = DEFAULT_SKIN_TONE) {
  const avatar = ref<PirateAvatar>(generateRandomAvatar(initialGender, initialSkinTone))
  const isSpinning = ref(false)

  function randomize(gender?: Gender, skinTone?: SkinTone) {
    avatar.value = generateRandomAvatar(gender || avatar.value.gender, skinTone || avatar.value.skinTone)
  }

  // Slot machine effect: rapidly cycle through random avatars before settling
  async function spinAndRandomize(): Promise<void> {
    if (isSpinning.value) return

    isSpinning.value = true
    const currentGender = avatar.value.gender
    const currentSkinTone = avatar.value.skinTone
    const targetAvatar = generateRandomAvatar(currentGender, currentSkinTone)
    await Promise.race([preloadAvatarPool(currentGender, currentSkinTone), sleep(SPIN_MAX_WAIT_MS)])

    // Spin phases: fast → medium → slow → settle
    const phases = [
      { iterations: 8, delay: 50 },   // Fast
      { iterations: 6, delay: 100 },  // Medium
      { iterations: 4, delay: 150 },  // Slow
      { iterations: 3, delay: 200 },  // Very slow
    ]

    for (const phase of phases) {
      for (let i = 0; i < phase.iterations; i++) {
        avatar.value = generateRandomAvatar(currentGender, currentSkinTone)
        await sleep(phase.delay)
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
    preloadAvatarPool(avatar.value.gender, skinTone)
  }

  // Change gender while keeping the same combination
  // If switching to female and accessory 4 is present, remove it
  function setGender(gender: Gender) {
    const current = avatar.value
    let accessories = { ...current.accessories }

    // Female doesn't have accessory 4, so remove it if present
    if (gender === 'female' && accessories.regular.includes(4)) {
      accessories = {
        ...accessories,
        regular: accessories.regular.filter(a => a !== 4),
      }
    }

    avatar.value = {
      ...current,
      gender,
      accessories,
    }
    preloadAvatarPool(gender, current.skinTone)
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
    setGender,
    serialize,
    deserialize,
    load,
  }
}
