<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore, VOTE_SLIDES } from '../setup/main'
import AvatarPreview from './AvatarPreview.vue'

const props = defineProps<{
  currentSlide: number
}>()

const crew = computed(() => sessionStore.crew)

// Show only on slide 1 or vote slides
const isVisible = computed(() => {
  return props.currentSlide === 1 || VOTE_SLIDES.includes(props.currentSlide)
})
</script>

<template>
  <div
    v-if="isVisible && crew.length > 0"
    class="crew-container"
  >
    <TransitionGroup name="pill">
      <div
        v-for="member in crew"
        :key="member.odientId"
        class="crew-member"
      >
        <div class="name-pill">{{ member.name }}</div>
        <AvatarPreview :avatar="member.avatar || ''" :size="60" />
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

.name-pill {
  padding: 1px 5px;
  background: black;
  border-radius: 20px;
  color: white;
  margin-bottom: -15px;
  z-index: 100;
  font-size: 10px;
  font-weight: 300;
  border: 1px solid white
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
