<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore } from '../setup/main'

interface Zone {
  top: number
  left: number
  right: number
  bottom: number
}

const props = withDefaults(defineProps<{
  voteIndex: number
  avatarSize?: number
  neutralZone: Zone
  zoneA: Zone
  zoneB: Zone
}>(), {
  avatarSize: 35,
})

const crew = computed(() => sessionStore.crew)

const voteResults = computed(() => sessionStore.voteResults[props.voteIndex])

// Deterministic hash: maps a string + seed to a number in [0, 1)
function hashToUnit(str: string, seed: number): number {
  let hash = seed
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return (Math.abs(hash) % 10000) / 10000
}

// Compute scattered position within a zone (returns % of parent)
function getPositionInZone(participantId: string, index: number, total: number, zone: Zone) {
  const zoneW = (100 - zone.left - zone.right)
  const zoneH = (100 - zone.top - zone.bottom)
  const aspectRatio = zoneW / Math.max(zoneH, 1)
  const cols = Math.max(1, Math.ceil(Math.sqrt(total * aspectRatio)))
  const rows = Math.max(1, Math.ceil(total / cols))

  const cellW = zoneW / cols
  const cellH = zoneH / rows

  const col = index % cols
  const row = Math.floor(index / cols)

  const jitterX = 0.15 + hashToUnit(participantId, 1) * 0.7
  const jitterY = 0.15 + hashToUnit(participantId, 2) * 0.7

  const left = zone.left + col * cellW + jitterX * cellW
  const top = zone.top + row * cellH + jitterY * cellH

  return { left: `${left}%`, top: `${top}%` }
}

// For each crew member, compute which zone they belong to and their position
const avatarPositions = computed(() => {
  const results = voteResults.value
  const votedA = new Set(results?.A ?? [])
  const votedB = new Set(results?.B ?? [])

  // Split crew into 3 groups preserving stable indices within each group
  const neutralMembers: string[] = []
  const aMembers: string[] = []
  const bMembers: string[] = []

  for (const member of crew.value) {
    const id = member.participantId
    if (votedA.has(id)) aMembers.push(id)
    else if (votedB.has(id)) bMembers.push(id)
    else neutralMembers.push(id)
  }

  const positions = new Map<string, { left: string; top: string }>()

  neutralMembers.forEach((id, i) => {
    positions.set(id, getPositionInZone(id, i, neutralMembers.length, props.neutralZone))
  })
  aMembers.forEach((id, i) => {
    positions.set(id, getPositionInZone(id, i, aMembers.length, props.zoneA))
  })
  bMembers.forEach((id, i) => {
    positions.set(id, getPositionInZone(id, i, bMembers.length, props.zoneB))
  })

  return positions
})
</script>

<template>
  <div class="vote-crew-scatter">
    <TransitionGroup name="pill">
      <div
        v-for="(member, i) in crew"
        :key="member.participantId"
        class="crew-avatar animate-sway"
        :style="{
          ...avatarPositions.get(member.participantId),
          animationDelay: `${(i * 370) % 2000}ms`,
        }"
      >
        <AvatarPreview
          class="animate-bounce animate-duration-600"
          :style="{ animationDelay: `${(i * 530) % 1500}ms` }"
          :avatar="member.avatar || ''"
          :size="props.avatarSize"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.vote-crew-scatter {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.crew-avatar {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  transition: top 0.8s ease, left 0.8s ease;
}

.pill-enter-active {
  transition: all 0.3s ease;
}

.pill-leave-active {
  transition: all 0.2s ease;
}

.pill-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.pill-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}
</style>
