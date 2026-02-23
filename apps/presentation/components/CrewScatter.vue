<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore } from '../setup/main'
import { computeSpiralPositions, applyJitter } from '../utils/spiral-positions'

const props = withDefaults(defineProps<{
  avatarSize?: number
}>(), {
  avatarSize: 40,
})

const crew = computed(() => sessionStore.crew)

// Pre-compute spiral positions for the full container (stable, no reshuffling on join)
const spiral = computeSpiralPositions({ top: 0, left: 0, right: 0, bottom: 0 })
</script>

<template>
  <div class="pointer-events-none">
    <TransitionGroup name="pill">
      <div
        v-for="(member, i) in crew"
        :key="member.participantId"
        class="absolute flex flex-col items-center animate-sway -translate-x-1/2 -translate-y-1/2"
        :style="{
          ...applyJitter(spiral[i % 120], member.participantId),
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
