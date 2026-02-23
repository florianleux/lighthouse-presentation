<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore } from '../setup/main'
import { computeSpiralPositions, applyJitter, type Zone } from '../utils/spiral-positions'

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

// Pre-compute spiral positions for each zone (stable, independent of member count)
const neutralSpiral = computed(() => computeSpiralPositions(props.neutralZone))
const aSpiral = computed(() => computeSpiralPositions(props.zoneA))
const bSpiral = computed(() => computeSpiralPositions(props.zoneB))

const avatarPositions = computed(() => {
  const results = voteResults.value
  const votedA = results?.A ?? []
  const votedB = results?.B ?? []
  const votedASet = new Set(votedA)
  const votedBSet = new Set(votedB)

  const positions = new Map<string, { left: string; top: string }>()

  // Neutral zone: use crew-wide index for 100% stable positioning.
  // When a member votes, their slot becomes empty — no other member moves.
  crew.value.forEach((member, crewIndex) => {
    const id = member.participantId
    if (!votedASet.has(id) && !votedBSet.has(id)) {
      positions.set(id, applyJitter(neutralSpiral.value[crewIndex % 120], id))
    }
  })

  // Zone A: fill from center in vote chronological order.
  // New arrivals always get the next outward slot — no existing member moves.
  votedA.forEach((id, voteIndex) => {
    positions.set(id, applyJitter(aSpiral.value[voteIndex % 120], id))
  })

  // Zone B: same as A
  votedB.forEach((id, voteIndex) => {
    positions.set(id, applyJitter(bSpiral.value[voteIndex % 120], id))
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
