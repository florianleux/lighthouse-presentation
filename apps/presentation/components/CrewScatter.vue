<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore } from '../setup/main'

const props = withDefaults(defineProps<{
  avatarSize?: number
}>(), {
  avatarSize: 40,
})

const crew = computed(() => sessionStore.crew)

// Deterministic hash: maps a string + seed to a number in [0, 1)
function hashToUnit(str: string, seed: number): number {
  let hash = seed
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return (Math.abs(hash) % 10000) / 10000
}

// Compute scattered position within the container (0-100%)
// Uses grid subdivision + jitter so avatars are distributed without overlap
function getPosition(participantId: string, index: number, total: number) {
  const aspectRatio = 2
  const cols = Math.max(1, Math.ceil(Math.sqrt(total * aspectRatio)))
  const rows = Math.max(1, Math.ceil(total / cols))

  const cellW = 100 / cols
  const cellH = 100 / rows

  const col = index % cols
  const row = Math.floor(index / cols)

  const jitterX = 0.15 + hashToUnit(participantId, 1) * 0.7
  const jitterY = 0.15 + hashToUnit(participantId, 2) * 0.7

  const left = col * cellW + jitterX * cellW
  const top = row * cellH + jitterY * cellH

  return { left: `${left}%`, top: `${top}%` }
}
</script>

<template>
  <div class="pointer-events-none">
    <TransitionGroup name="pill">
      <div
        v-for="(member, i) in crew"
        :key="member.participantId"
        class="absolute flex flex-col items-center animate-sway -translate-x-1/2 -translate-y-1/2"
        :style="{
          ...getPosition(member.participantId, i, crew.length),
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
.pill-enter-active {
  transition: all 0.3s ease;
}

.pill-leave-active {
  transition: all 0.2s ease;
}

.pill-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.pill-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
