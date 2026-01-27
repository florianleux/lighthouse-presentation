<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useNav } from '@slidev/client'
import { VOTE_SLIDES, sessionStore, voteStore } from '../setup/main'

const { currentSlideNo } = useNav()

let isBlocked = false
let blockReason: 'vote' | 'no-keynote' | null = null

const showToast = ref(false)
const toastMessage = ref('')
let toastTimeout: ReturnType<typeof setTimeout> | null = null

function displayToast(message: string) {
  toastMessage.value = message
  showToast.value = true
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Check blocking conditions
function checkBlockingState() {
  const voteIndex = VOTE_SLIDES.indexOf(currentSlideNo.value)

  if (voteIndex !== -1) {
    // It's a vote slide - check if vote already done
    if (voteStore.path[voteIndex] !== null) {
      // Vote already done - don't block, will auto-skip
      isBlocked = false
      blockReason = null
    } else {
      isBlocked = true
      blockReason = 'vote'
    }
  } else if (currentSlideNo.value === 1 && !sessionStore.keynoteId) {
    isBlocked = true
    blockReason = 'no-keynote'
  } else {
    isBlocked = false
    blockReason = null
  }
}

// Navigation keys that move forward
const forwardKeys = ['ArrowRight', 'ArrowDown', ' ', 'Space', 'Enter', 'PageDown']
const backwardKeys = ['ArrowLeft', 'ArrowUp', 'PageUp']

// Block keyboard events
function blockKeyboard(e: KeyboardEvent) {
  if (!isBlocked) return

  const isForward = forwardKeys.includes(e.key) || forwardKeys.includes(e.code)
  const isBackward = backwardKeys.includes(e.key) || backwardKeys.includes(e.code)

  // For no-keynote, only block forward navigation
  if (blockReason === 'no-keynote') {
    if (isForward) {
      e.preventDefault()
      e.stopPropagation()
      displayToast('Initialize keynote first (press K)')
    }
    return
  }

  // For vote slides, only block forward navigation (allow going back)
  if (isForward) {
    e.preventDefault()
    e.stopPropagation()
  }
}

// Block clicks for navigation
function blockClick(e: MouseEvent) {
  if (!isBlocked) return

  // Allow clicks on buttons
  const target = e.target as HTMLElement
  if (target.tagName === 'BUTTON' || target.closest('button')) {
    return
  }

  // For no-keynote, only block clicks on right side (forward)
  if (blockReason === 'no-keynote') {
    const clickX = e.clientX
    const windowWidth = window.innerWidth
    if (clickX > windowWidth / 2) {
      e.preventDefault()
      e.stopPropagation()
      displayToast('Initialize keynote first (press K)')
    }
    return
  }

  // For vote slides, only block clicks on right side (forward), allow going back
  const clickX = e.clientX
  const windowWidth = window.innerWidth
  if (clickX > windowWidth / 2) {
    e.preventDefault()
    e.stopPropagation()
  }
}

watch(currentSlideNo, checkBlockingState, { immediate: true })

// Also watch keynoteId changes
watch(() => sessionStore.keynoteId, checkBlockingState)

onMounted(() => {
  // Capture phase to intercept before Slidev
  window.addEventListener('keydown', blockKeyboard, true)
  document.addEventListener('click', blockClick, true)
})

onUnmounted(() => {
  window.removeEventListener('keydown', blockKeyboard, true)
  document.removeEventListener('click', blockClick, true)
  if (toastTimeout) clearTimeout(toastTimeout)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="showToast" class="toast">
        {{ toastMessage }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(220, 38, 38, 0.95);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
