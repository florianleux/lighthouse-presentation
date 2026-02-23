<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore } from '../setup/main'

const props = defineProps<{
  currentSlide: number
}>()

const crew = computed(() => sessionStore.crew)

// Slide numbers containing VoteSlide components (from slides.md)
const VOTE_SLIDE_NUMBERS = new Set([12, 19, 27, 34, 41])

// Show on slide 1 and vote slides only (not poll or other slides)
const isVisible = computed(() => {
  return props.currentSlide === 1 || VOTE_SLIDE_NUMBERS.has(props.currentSlide)
})
</script>

<template>
  <div
    v-if="isVisible && crew.length > 0"
    class="crew-container"
  >
    <TransitionGroup name="pill">
      <div
        v-for="(member, i) in crew"
        :key="member.participantId"
        class="crew-member animate-sway"
        :style="{ animationDelay: `${(i * 370) % 2000}ms` }"
      >
        <AvatarPreview
          class="animate-bounce animate-duration-600"
          :style="{ animationDelay: `${(i * 530) % 1500}ms` }"
          :avatar="member.avatar || ''"
          :size="40"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.crew-container {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  max-width: 80%;
  z-index: 100;
}

.crew-member {
  display: flex;
  flex-direction: column;
  align-items: center;
}


/* Animations */
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
