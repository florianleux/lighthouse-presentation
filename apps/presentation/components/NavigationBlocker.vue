<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useNav } from '@slidev/client'
import { VOTE_SLIDES } from '../setup/main'

const { currentSlideNo, next, prev } = useNav()

let isBlocked = false

// Vérifie si on est sur un slide de vote
function checkIfVoteSlide() {
  isBlocked = VOTE_SLIDES.includes(currentSlideNo.value)
}

// Bloque les événements clavier
function blockKeyboard(e: KeyboardEvent) {
  if (!isBlocked) return

  const blockedKeys = [
    'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
    ' ', 'Space', 'Enter', 'PageDown', 'PageUp'
  ]

  if (blockedKeys.includes(e.key) || blockedKeys.includes(e.code)) {
    e.preventDefault()
    e.stopPropagation()
  }
}

// Bloque les clics pour naviguer
function blockClick(e: MouseEvent) {
  if (!isBlocked) return

  // Autorise les clics sur les boutons
  const target = e.target as HTMLElement
  if (target.tagName === 'BUTTON' || target.closest('button')) {
    return
  }

  e.preventDefault()
  e.stopPropagation()
}

watch(currentSlideNo, checkIfVoteSlide, { immediate: true })

onMounted(() => {
  // Capture phase pour intercepter avant Slidev
  window.addEventListener('keydown', blockKeyboard, true)
  document.addEventListener('click', blockClick, true)
})

onUnmounted(() => {
  window.removeEventListener('keydown', blockKeyboard, true)
  document.removeEventListener('click', blockClick, true)
})
</script>

<template>
  <div v-if="false" />
</template>
