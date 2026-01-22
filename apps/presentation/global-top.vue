<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import NavigationBlocker from './components/NavigationBlocker.vue'
import VoteTower from './components/VoteTower.vue'
import AdminPanel from './components/AdminPanel.vue'

const showAdminPanel = ref(false)

function handleKeydown(e: KeyboardEvent) {
  // Toggle admin panel with K key
  if (e.key === 'k' || e.key === 'K') {
    // Don't trigger if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }
    showAdminPanel.value = !showAdminPanel.value
  }

  // Close with Escape
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
  <NavigationBlocker />
  <VoteTower />
  <AdminPanel
    :visible="showAdminPanel"
    @close="showAdminPanel = false"
  />
</template>
