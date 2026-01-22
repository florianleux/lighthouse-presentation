<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
  keynoteId: string
  createdAt: number
  lastSlide: number
  currentSlide: number
}>()

defineEmits<{
  continueHere: []
  continueAtLast: []
  reset: []
}>()

const formattedDate = computed(() => {
  if (!props.createdAt) return ''
  return new Date(props.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
})

// Show two resume options when URL slide is earlier than last slide
const showTwoOptions = computed(() => props.currentSlide < props.lastSlide)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay">
        <div class="modal">
          <div class="modal-icon">&#9875;</div>
          <h2>Session Found</h2>
          <p>A previous presentation session was detected:</p>
          <code class="keynote-id">{{ keynoteId }}</code>

          <div class="session-info">
            <div class="info-row">
              <span class="info-label">Created:</span>
              <span class="info-value">{{ formattedDate }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Last slide:</span>
              <span class="info-value">{{ lastSlide }}</span>
            </div>
            <div v-if="showTwoOptions" class="info-row">
              <span class="info-label">Current URL:</span>
              <span class="info-value highlight">Slide {{ currentSlide }}</span>
            </div>
          </div>

          <div class="actions">
            <!-- Two options when URL slide < lastSlide -->
            <template v-if="showTwoOptions">
              <button @click="$emit('continueHere')" class="btn primary">
                Resume here (slide {{ currentSlide }})
              </button>
              <button @click="$emit('continueAtLast')" class="btn outline">
                Resume at last (slide {{ lastSlide }})
              </button>
            </template>
            <!-- Single option otherwise -->
            <template v-else>
              <button @click="$emit('continueAtLast')" class="btn primary">
                Continue Session
              </button>
            </template>
            <button @click="$emit('reset')" class="btn secondary">
              Start Fresh
            </button>
          </div>

          <p class="hint">
            "Start Fresh" will clear the crew and create a new session
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal {
  background: #1e293b;
  border-radius: 16px;
  padding: 32px;
  width: 400px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.modal h2 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #ffd700;
}

.modal p {
  margin: 0 0 16px;
  color: #94a3b8;
  font-size: 14px;
}

.keynote-id {
  display: block;
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  word-break: break-all;
}

.session-info {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.info-label {
  color: #94a3b8;
  font-size: 14px;
}

.info-value {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.info-value.highlight {
  color: #ffd700;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: #ffd700;
  color: #1e293b;
}

.btn.primary:hover {
  background: #ffc700;
  transform: scale(1.02);
}

.btn.outline {
  background: transparent;
  color: #ffd700;
  border: 2px solid #ffd700;
}

.btn.outline:hover {
  background: rgba(255, 215, 0, 0.1);
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.hint {
  margin-top: 16px;
  font-size: 12px;
  opacity: 0.5;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal {
  transform: scale(0.95);
}

.modal-leave-to .modal {
  transform: scale(0.95);
}
</style>
