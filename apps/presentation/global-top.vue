<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import AdminPanel from './components/AdminPanel.vue'
import CrewJoinToast from './components/CrewJoinToast.vue'
import { sessionStore, currentPhase, publishSessionState } from './setup/main'

const { currentSlideNo } = useNav()

// Track slide changes and publish state to Firestore
watch(currentSlideNo, (slide) => {
  if (sessionStore.keynoteId && slide) {
    // Transition from lobby to idle once presenter navigates beyond slide 1
    if (currentPhase.value === 'lobby' && slide > 1) {
      currentPhase.value = 'idle'
    }
    sessionStore.updateLastSlide(slide)
    publishSessionState()
  }
})

const showAdminPanel = ref(false)

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'k' || e.key === 'K') {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    showAdminPanel.value = !showAdminPanel.value
  }
  if (e.key === 'Escape' && showAdminPanel.value) {
    showAdminPanel.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <CrewJoinToast />
  <AdminPanel
    :visible="showAdminPanel"
    @close="showAdminPanel = false"
  />
</template>
