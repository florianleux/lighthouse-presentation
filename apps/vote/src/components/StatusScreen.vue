<script setup lang="ts">
defineProps<{
  variant: 'connecting' | 'waiting' | 'error'
}>()
</script>

<template>
  <div :class="['py-5', { 'text-red-400': variant === 'error' }]">
    <div v-if="variant !== 'error'" class="w-10 h-10 border-3 border-white/30 border-t-[#ffd700] rounded-full animate-spin mx-auto mb-4"></div>
    <p v-if="variant === 'connecting'">Connecting...</p>
    <p v-else-if="variant === 'waiting'">Waiting for the captain...</p>
    <p v-else-if="variant === 'error'">Connection error</p>
    <p v-if="variant === 'waiting'" class="text-sm opacity-60 mt-2">The presentation hasn't started yet</p>
    <p v-if="variant === 'error'" class="text-sm opacity-60 mt-2">Check your internet connection</p>
  </div>
</template>
po