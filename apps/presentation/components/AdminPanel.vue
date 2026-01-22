<script setup lang="ts">
import { computed } from 'vue'
import { sessionStore, publishSessionState } from '../setup/main'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const keynoteId = computed(() => sessionStore.keynoteId)
const crewCount = computed(() => sessionStore.crew.length)
const activeCrewCount = computed(() => sessionStore.activeCrew.length)

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
    <Transition name="panel">
      <div v-if="visible" class="admin-overlay" @click.self="$emit('close')">
        <div class="admin-panel">
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
                class="action-btn primary"
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

            <!-- Actions Section -->
            <div class="section actions">
              <button
                class="action-btn danger"
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
.admin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.admin-panel {
  background: #1e293b;
  border-radius: 12px;
  width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

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

.actions {
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #ffd700;
  color: #1e293b;
}

.action-btn.primary:hover {
  background: #ffc700;
}

.action-btn.danger {
  background: #dc2626;
  color: white;
}

.action-btn.danger:hover:not(:disabled) {
  background: #ef4444;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

/* Transitions */
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.2s ease;
}

.panel-enter-active .admin-panel,
.panel-leave-active .admin-panel {
  transition: transform 0.2s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

.panel-enter-from .admin-panel {
  transform: scale(0.95);
}

.panel-leave-to .admin-panel {
  transform: scale(0.95);
}
</style>
