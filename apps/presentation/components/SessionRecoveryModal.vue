<script setup lang="ts">
import { computed } from 'vue'
import '../styles/modals.css'

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
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay modal-overlay--dark">
        <div class="modal-panel modal-panel--centered">
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
              <button @click="$emit('continueHere')" class="modal-btn primary full-width">
                Resume here (slide {{ currentSlide }})
              </button>
              <button @click="$emit('continueAtLast')" class="modal-btn outline full-width">
                Resume at last (slide {{ lastSlide }})
              </button>
            </template>
            <!-- Single option otherwise -->
            <template v-else>
              <button @click="$emit('continueAtLast')" class="modal-btn primary full-width">
                Continue Session
              </button>
            </template>
            <button @click="$emit('reset')" class="modal-btn secondary full-width">
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
.modal-overlay--dark {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 10000;
}

.modal-panel--centered {
  border-radius: 16px;
  padding: 32px;
  text-align: center;
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

h2 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #ffd700;
}

p {
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

.full-width {
  width: 100%;
  padding: 14px 24px;
  font-size: 16px;
}

.modal-btn.primary:hover {
  transform: scale(1.02);
}

.hint {
  margin-top: 16px;
  font-size: 12px;
  opacity: 0.5;
}
</style>
