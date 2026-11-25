<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useNav } from '@slidev/client'
import { sessionStore, firestore } from '../setup/main'
import { createFakeCrewMembers } from '../composables/useFirestore'
import type { Lang } from '../../../shared/i18n/types'

const { go } = useNav()

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const keynoteId = computed(() => sessionStore.keynoteId)
const crewCount = computed(() => sessionStore.crew.length)
const isGenerating = ref(false)
// Mode de la prochaine session : appliqué au clic sur « Nouvelle session »
const nextLocalMode = ref(sessionStore.localMode)
// Langue de la prochaine session (slides + app de vote) : appliquée au même moment
const nextLang = ref<Lang>(sessionStore.lang)
const fakeCrewCount = ref(25)

async function generateFakeParticipants() {
  if (isGenerating.value) return
  isGenerating.value = true
  try {
    if (sessionStore.localMode) {
      createFakeCrewMembers(fakeCrewCount.value).forEach(m => sessionStore.addCrewMember(m))
      return
    }
    await firestore.generateFakeParticipants(fakeCrewCount.value, 5000)
  } catch (err) {
    console.error('[AdminPanel] Failed to generate fake participants:', err)
  } finally {
    isGenerating.value = false
  }
}
const activeCrewCount = computed(() => sessionStore.activeCrew.length)
const isFirestoreConnected = computed(() => firestore.isConnected.value)

async function startNewSession() {
  if (confirm('Démarrer une nouvelle session ? Cela réinitialisera l\'équipage et tous les votes.')) {
    // Close panel first to avoid reactivity issues
    emit('close')

    // Wait for panel to close before resetting
    await nextTick()

    // Reset session (await Firestore doc creation before navigating)
    await sessionStore.startNewSession(nextLocalMode.value, nextLang.value)

    // Navigate to slide 1 (this will trigger publishSessionState via the watch in global-top)
    go(1)
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="slide">
      <div v-if="visible" class="side-panel-overlay" @click.self="$emit('close')">
        <aside class="side-panel">
          <!-- Header -->
          <header class="panel-header">
            <div>
              <h2>Administration</h2>
              <div class="header-status">
                <span class="badge" :class="sessionStore.localMode ? 'badge-local' : 'badge-classic'">
                  {{ sessionStore.localMode ? 'Local' : 'Classique' }}
                </span>
                <span class="badge badge-classic">{{ sessionStore.lang.toUpperCase() }}</span>
                <!-- Local : aucune connexion attendue, donc pas de voyant -->
                <span v-if="sessionStore.localMode" class="status-text">Aucune connexion requise</span>
                <template v-else>
                  <span class="status-dot" :class="isFirestoreConnected ? 'ok' : 'ko'" />
                  <span class="status-text">
                    {{ isFirestoreConnected ? 'App de vote connectée' : 'App de vote déconnectée' }}
                  </span>
                </template>
              </div>
            </div>
            <button class="close-btn" aria-label="Fermer" @click="$emit('close')">×</button>
          </header>

          <div class="panel-content">
            <!-- Nouvelle session -->
            <section class="card card-danger">
              <h3 class="card-title">Nouvelle session</h3>
              <div class="segmented" role="radiogroup" aria-label="Mode de la session">
                <label class="segment" :class="{ active: !nextLocalMode }">
                  <input
                    type="radio"
                    name="vote-mode"
                    :checked="!nextLocalMode"
                    @change="nextLocalMode = false"
                  />
                  <span class="segment-title">Classique</span>
                  <span class="segment-desc">Vote sur l'app, minuteur</span>
                </label>
                <label class="segment" :class="{ active: nextLocalMode }">
                  <input
                    type="radio"
                    name="vote-mode"
                    :checked="nextLocalMode"
                    @change="nextLocalMode = true"
                  />
                  <span class="segment-title">Local</span>
                  <span class="segment-desc">Main levée, sans réseau</span>
                </label>
              </div>
              <div class="segmented" role="radiogroup" aria-label="Langue de la session">
                <label class="segment" :class="{ active: nextLang === 'fr' }">
                  <input
                    type="radio"
                    name="session-lang"
                    :checked="nextLang === 'fr'"
                    @change="nextLang = 'fr'"
                  />
                  <span class="segment-title">Français</span>
                  <span class="segment-desc">Slides et app de vote en FR</span>
                </label>
                <label class="segment" :class="{ active: nextLang === 'en' }">
                  <input
                    type="radio"
                    name="session-lang"
                    :checked="nextLang === 'en'"
                    @change="nextLang = 'en'"
                  />
                  <span class="segment-title">English</span>
                  <span class="segment-desc">Slides et app de vote en EN</span>
                </label>
              </div>
              <button class="btn btn-danger full-width" @click="startNewSession">
                Réinitialiser et démarrer en {{ nextLocalMode ? 'Local' : 'Classique' }} · {{ nextLang.toUpperCase() }}
              </button>
              <p class="hint">Efface l'équipage et tous les votes.</p>
              <div class="session-id" :title="keynoteId ?? ''">{{ keynoteId ?? 'Aucune session' }}</div>
            </section>
            <!-- Équipage -->
            <section class="card">
              <h3 class="card-title">Équipage</h3>
              <div class="stats">
                <div class="stat">
                  <span class="stat-value">{{ crewCount }}</span>
                  <span class="stat-label">Membres</span>
                </div>
                <div v-if="!sessionStore.localMode" class="stat">
                  <span class="stat-value">{{ activeCrewCount }}</span>
                  <span class="stat-label">Connectés</span>
                </div>
              </div>
              <div class="inline-form">
                <input
                  v-model.number="fakeCrewCount"
                  type="number"
                  min="1"
                  max="500"
                  class="number-input"
                  aria-label="Nombre de bots"
                />
                <button
                  class="btn btn-secondary grow"
                  :disabled="isGenerating || (!isFirestoreConnected && !sessionStore.localMode)"
                  @click="generateFakeParticipants"
                >
                  {{ isGenerating ? 'Génération…' : '+ Ajouter des bots' }}
                </button>
              </div>
            </section>

          </div>

          <footer class="panel-footer">
            <kbd>K</kbd> ou <kbd>Échap</kbd> pour fermer
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.side-panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(2px);
  z-index: 9999;
}

.side-panel {
  --bg: #232e47;
  --card: #2c3955;
  --border: rgba(255, 255, 255, 0.1);
  --text: #f1f5f9;
  --muted: #a5b1c7;
  --subtle: #7d8aa5;
  --accent: #ffd700;
  --accent-soft: rgba(255, 215, 0, 0.1);
  --ok: #22c55e;
  --ko: #ef4444;
  --soft: rgba(255, 255, 255, 0.07);
  --a: #3b82f6;
  --b: #f59e0b;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 440px;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 14px;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.4);
  color-scheme: dark;
}

/* Header */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.panel-header h2 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}

.header-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.badge-classic {
  background: rgba(59, 130, 246, 0.18);
  color: #93c5fd;
}

.badge-local {
  background: var(--accent-soft);
  color: var(--accent);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.ok {
  background: var(--ok);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}

.status-dot.ko {
  background: var(--ko);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.status-text {
  font-size: 12px;
  color: var(--muted);
}

.close-btn {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.close-btn:hover {
  background: var(--soft);
  color: var(--text);
}

/* Content */
.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.card-danger {
  border-color: rgba(239, 68, 68, 0.35);
}

.card-title {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
}

/* Crew */
.stats {
  display: flex;
  gap: 32px;
  margin-bottom: 14px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 12px;
  color: var(--subtle);
}

.inline-form {
  display: flex;
  gap: 8px;
}

.number-input {
  width: 72px;
  padding: 0 10px;
  height: 38px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 14px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.number-input:focus {
  outline: none;
  border-color: var(--accent);
}

/* Buttons */
.btn {
  height: 38px;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--soft);
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #ef4444;
}

.grow {
  flex: 1;
}

.full-width {
  width: 100%;
}

/* New session */
.segmented {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.segment {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.segment:hover {
  border-color: rgba(255, 255, 255, 0.25);
}

.segment.active {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.segment input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.segment-title {
  font-weight: 600;
}

.segment.active .segment-title {
  color: var(--accent);
}

.segment-desc {
  font-size: 12px;
  color: var(--subtle);
}

.hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--subtle);
  text-align: center;
}

.session-id {
  margin-top: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  color: var(--subtle);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Footer */
.panel-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--subtle);
  text-align: center;
  flex-shrink: 0;
}

.panel-footer kbd {
  padding: 1px 6px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--card);
  font-family: inherit;
  font-size: 11px;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease;
}

.slide-enter-active .side-panel,
.slide-leave-active .side-panel {
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
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
