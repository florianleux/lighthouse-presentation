<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNav } from '@slidev/client'
import { sessionStore, voteStore, publishSessionState } from '../setup/main'

const { go } = useNav()

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
const pollResults = computed(() => sessionStore.pollResults['knowledge-level'] || {
  cabin_boy: [],
  quartermaster: [],
  captain: []
})

const totalPollVotes = computed(() =>
  pollResults.value.cabin_boy.length +
  pollResults.value.quartermaster.length +
  pollResults.value.captain.length
)

const isPollDone = computed(() => sessionStore.pollPhase === 'ended')

const voteNames = ['PERF', 'A11Y', 'BEST PRACTICES', 'SEO']

// Join session controls
const selectedDuration = ref(5)
const isJoinSessionActive = computed(() => props.joinSessionRemaining > 0)

function startNewSession() {
  if (confirm('Start a new session? This will reset the crew and all votes.')) {
    sessionStore.startNewSession()
    // Publish session state so vote apps receive the new keynoteId
    publishSessionState(1, 'intro')
    emit('close')
    go(1)
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="slide">
      <div v-if="visible" class="side-panel-overlay" @click.self="$emit('close')">
        <div class="side-panel">
          <div class="panel-header">
            <h2>Admin Panel</h2>
            <button class="close-btn" @click="$emit('close')">×</button>
          </div>

          <div class="panel-content">
            <!-- New Session Section -->
            <div class="section">
              <button
                class="panel-btn danger full-width"
                @click="startNewSession"
              >
                New Session (Reset All)
              </button>
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
                  class="panel-btn primary"
                  :disabled="!keynoteId || isJoinSessionActive"
                  @click="emit('startJoinSession', selectedDuration)"
                >
                  {{ isJoinSessionActive ? `${joinSessionRemaining}s` : 'Start' }}
                </button>
              </div>
              <button
                class="panel-btn secondary full-width"
                :disabled="!keynoteId"
                @click="emit('sendHeartbeat')"
              >
                Send Heartbeat (sync all)
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

            <!-- Votes Section -->
            <div class="section">
              <label>Votes</label>
              <div class="vote-results">
                <!-- Poll row -->
                <div class="vote-row">
                  <span class="vote-index">POLL</span>
                  <span class="vote-counts">{{ totalPollVotes }} votes</span>
                  <span
                    class="vote-status"
                    :class="isPollDone ? 'done' : 'pending'"
                  >
                    {{ isPollDone ? 'DONE' : 'PENDING' }}
                  </span>
                </div>
                <!-- Vote rows -->
                <div
                  v-for="(results, index) in sessionStore.voteResults"
                  :key="index"
                  class="vote-row"
                >
                  <span class="vote-index">{{ voteNames[index] }}</span>
                  <span class="vote-counts">
                    A: {{ results.A.length }} | B: {{ results.B.length }}
                    <span v-if="voteStore.path[index]" class="vote-winner">→ {{ voteStore.path[index] }}</span>
                  </span>
                  <span
                    class="vote-status"
                    :class="voteStore.path[index] !== null ? 'done' : 'pending'"
                  >
                    {{ voteStore.path[index] !== null ? 'DONE' : 'PENDING' }}
                  </span>
                </div>
              </div>
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
.side-panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.side-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 500px;
  background: #1e293b;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
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
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
}

.close-btn:hover {
  color: white;
}

.panel-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
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
  font-size: 28px;
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
  display: grid;
  grid-template-columns: 120px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 13px;
}

.vote-status {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.vote-status.done {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.vote-status.pending {
  background: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
}

.vote-index {
  font-weight: 500;
  color: white;
}

.vote-counts {
  color: white;
}

.vote-winner {
  color: #22c55e;
  font-weight: 500;
  margin-left: 8px;
}

.join-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  align-items: center;
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

.panel-btn {
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.panel-btn.primary {
  background: #ffd700;
  color: #1e293b;
}

.panel-btn.primary:hover:not(:disabled) {
  background: #ffc700;
}

.panel-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.panel-btn.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.panel-btn.danger {
  background: #dc2626;
  color: white;
}

.panel-btn.danger:hover:not(:disabled) {
  background: #ef4444;
}

.panel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  flex-shrink: 0;
}

.panel-footer kbd {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: inherit;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease;
}

.slide-enter-active .side-panel,
.slide-leave-active .side-panel {
  transition: transform 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .side-panel,
.slide-leave-to .side-panel {
  transform: translateX(100%);
}
</style>
