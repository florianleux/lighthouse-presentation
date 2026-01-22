<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore } from '../setup/main'

const crewNames = computed(() => {
  return sessionStore.crew.map(member => member.name)
})

const crewCount = computed(() => sessionStore.crew.length)
</script>

<template>
  <div class="crew-display">
    <div class="crew-header">
      <span class="crew-icon">&#9875;</span>
      <span class="crew-count">{{ crewCount }} pirate{{ crewCount !== 1 ? 's' : '' }} à bord</span>
    </div>

    <TransitionGroup name="crew" tag="div" class="crew-list">
      <span
        v-for="name in crewNames"
        :key="name"
        class="crew-member"
      >
        {{ name }}
      </span>
    </TransitionGroup>

    <div v-if="crewCount === 0" class="crew-empty">
      En attente de l'équipage...
    </div>
  </div>
</template>

<style scoped>
.crew-display {
  margin-top: 24px;
  padding: 16px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.crew-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  opacity: 0.8;
}

.crew-icon {
  font-size: 18px;
}

.crew-count {
  color: #ffd700;
}

.crew-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.crew-member {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  font-size: 14px;
  color: #ffd700;
  font-weight: 500;
}

.crew-empty {
  font-size: 14px;
  opacity: 0.5;
  font-style: italic;
}

/* Animations */
.crew-enter-active {
  transition: all 0.3s ease-out;
}

.crew-leave-active {
  transition: all 0.2s ease-in;
}

.crew-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}

.crew-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
