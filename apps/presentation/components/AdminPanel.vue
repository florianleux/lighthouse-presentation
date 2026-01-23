<script setup lang="ts">
import { computed, ref } from 'vue'
import { sessionStore, publishSessionState } from '../setup/main'
import '../styles/modals.css'

const props = defineProps<{
  visible: boolean
  joinSessionRemaining: number
}>()

const emit = defineEmits<{
  close: []
  startJoinSession: [duration: number]
  sendHeartbeat: []
}>()

const keynoteId = computed(() => sessionStore.keynoteId)
const crewCount = computed(() => sessionStore.crew.length)
const activeCrewCount = computed(() => sessionStore.activeCrew.length)

// Join session controls
const selectedDuration = ref(5)
const isJoinSessionActive = computed(() => props.joinSessionRemaining > 0)

function initKeynote() {
  sessionStore.initKeynote()
  // Publish session state so vote apps receive the keynoteId
  publishSessionState(1, 'intro')
}

function startNewSession() {
  if (confirm('Start a new session? This will reset the crew and all votes.')) {
    sessionStore.startNewSession()
    // Publish session state so vote apps receive the new keynoteId
    publishSessionState(1, 'intro')
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-panel">
          <div class="panel-header">
            <h2>Admin Panel</h2>
            <button class="close-btn" @click="$emit('close')">x</button>
          </div>

          <div class="panel-content">
            <!-- Keynote ID Section -->
            <div class="section">
              <label>Keynote ID</label>
              <div class="value">
                <code v-if="keynoteId">{{ keynoteId }}</code>
                <span v-else class="none">Not initialized</span>
              </div>
              <button
                v-if="!keynoteId"
                class="modal-btn primary full-width"
                @click="initKeynote"
              >
                Initialize Keynote
              </button>
            </div>

            <!-- Crew Section -->
            <div class="section">
              <label>Crew</label>
              <div class="stats">
                <div class="stat">
                  <span class="stat-value">{{ crewCount }}</span>
                  <span class="stat-label">Total</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ activeCrewCount }}</span>
                  <span class="stat-label">Active</span>
                </div>
              </div>
            </div>

            <!-- Vote Results Section -->
            <div class="section">
              <label>Vote Results</label>
              <div class="vote-results">
                <div
                  v-for="(results, index) in sessionStore.voteResults"
                  :key="index"
                  class="vote-row"
                >
                  <span class="vote-index">Vote {{ Number(index) + 1 }}</span>
                  <span class="vote-counts">
                    A: {{ results.A.length }} | B: {{ results.B.length }}
                  </span>
                  <span v-if="results.winner" class="vote-winner">
                    Winner: {{ results.winner }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Join Session Section -->
            <div class="section">
              <label>Join Session</label>
              <div class="join-controls">
                <input
                  v-model.number="selectedDuration"
                  type="number"
                  min="1"
                  max="60"
                  :disabled="isJoinSessionActive"
                  class="duration-input"
                />
                <span class="duration-unit">min</span>
                <button
                  class="modal-btn primary"
                  :disabled="!keynoteId || isJoinSessionActive"
                  @click="emit('startJoinSession', selectedDuration)"
                >
                  {{ isJoinSessionActive ? `${joinSessionRemaining}s` : 'Start' }}
                </button>
              </div>
              <button
                class="modal-btn secondary full-width"
                :disabled="!keynoteId"
                @click="emit('sendHeartbeat')"
              >
                Send Heartbeat (sync all)
              </button>
            </div>

            <!-- Actions Section -->
            <div class="section actions">
              <button
                class="modal-btn danger full-width"
                :disabled="!keynoteId"
                @click="startNewSession"
              >
                New Session (Reset All)
              </button>
            </div>
          </div>

          <div class="panel-footer">
            Press <kbd>K</kbd> to close
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
  color: #ffd700;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
}

.close-btn:hover {
  color: white;
}

.panel-content {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 120px);
}

.section {
  margin-bottom: 24px;
}

.section:last-child {
  margin-bottom: 0;
}

.section label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 8px;
}

.value {
  margin-bottom: 12px;
}

.value code {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  display: block;
  word-break: break-all;
}

.value .none {
  color: #64748b;
  font-style: italic;
}

.stats {
  display: flex;
  gap: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: white;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

.vote-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vote-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 14px;
}

.vote-index {
  font-weight: 500;
  color: #94a3b8;
  min-width: 60px;
}

.vote-counts {
  color: white;
}

.vote-winner {
  color: #22c55e;
  font-weight: 500;
  margin-left: auto;
}

.join-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.duration-input {
  width: 60px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  text-align: center;
}

.duration-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.duration-unit {
  color: #94a3b8;
  font-size: 14px;
}

.modal-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-btn.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.actions {
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.full-width {
  width: 100%;
}

.panel-footer {
  padding: 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: #64748b;
  text-align: center;
}

.panel-footer kbd {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: inherit;
}
</style>
