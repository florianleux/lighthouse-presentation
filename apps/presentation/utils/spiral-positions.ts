export interface Zone {
  top: number
  left: number
  right: number
  bottom: number
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)) // ≈ 2.39996 radians
const MAX_SLOTS = 120

/**
 * Pre-compute positions in a Fermat/sunflower spiral pattern.
 * Fills from the geometric center outward, ensuring even distribution.
 * Position of slot N is always the same regardless of how many slots are occupied.
 */
export function computeSpiralPositions(zone: Zone, maxSlots = MAX_SLOTS): { left: number; top: number }[] {
  const zoneW = 100 - zone.left - zone.right
  const zoneH = 100 - zone.top - zone.bottom
  const cx = zone.left + zoneW / 2
  const cy = zone.top + zoneH / 2
  const rx = (zoneW / 2) * 0.9
  const ry = (zoneH / 2) * 0.9

  const positions: { left: number; top: number }[] = []

  for (let i = 0; i < maxSlots; i++) {
    const r = Math.sqrt(i / maxSlots)
    const theta = i * GOLDEN_ANGLE

    positions.push({
      left: cx + r * rx * Math.cos(theta),
      top: cy + r * ry * Math.sin(theta),
    })
  }

  return positions
}

/** Deterministic hash: maps a string + seed to a number in [0, 1) */
export function hashToUnit(str: string, seed: number): number {
  let hash = seed
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return (Math.abs(hash) % 10000) / 10000
}

/** Apply small deterministic jitter to make positioning look organic */
export function applyJitter(
  pos: { left: number; top: number },
  participantId: string,
  amount = 1.5,
): { left: string; top: string } {
  const jx = (hashToUnit(participantId, 1) - 0.5) * amount
  const jy = (hashToUnit(participantId, 2) - 0.5) * amount
  return {
    left: `${pos.left + jx}%`,
    top: `${pos.top + jy}%`,
  }
}
