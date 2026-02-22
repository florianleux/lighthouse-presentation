<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import AdminPanel from './components/AdminPanel.vue'
import CrewPills from './components/CrewPills.vue'
import { sessionStore, publishSessionState } from './setup/main'

const { currentSlideNo } = useNav()

// Track slide changes and publish state to Firestore
watch(currentSlideNo, (slide) => {
  if (sessionStore.keynoteId && slide) {
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
  <CrewPills :current-slide="currentSlideNo" />
  <AdminPanel
    :visible="showAdminPanel"
    @close="showAdminPanel = false"
  />
</template>
