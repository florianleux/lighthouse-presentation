<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore } from '../setup/main'

const crew = computed(() => sessionStore.crew)
</script>

<template>
  <div
    v-if="crew.length > 0"
    class="crew-container"
  >
    <TransitionGroup name="pill">
      <div
        v-for="member in crew"
        :key="member.odientId"
        class="crew-member"
      >
        <div class="name-pill">{{ member.name }}</div>
        <div class="avatar-square">{{ member.avatar || '👤' }}</div>
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

.avatar-square {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
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
