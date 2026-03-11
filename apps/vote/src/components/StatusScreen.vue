<script setup lang="ts">
defineProps<{
  variant: 'connecting' | 'waiting' | 'error'
}>()
</script>

<template>
  <div
    :class="['py-5 absolute top-[40%] w-[90%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-5xl font-title text-shadow-md text-shadow-black text-white text-center', { 'text-red-400': variant === 'error' }]"
  >
    <img
      v-if="variant !== 'error'"
      src="/vote/wheel.webp"
      alt=""
      class=" animate-[spin_3s_linear_infinite] mx-auto mb-4"
    />
    <p v-if="variant === 'connecting'">Connecting...</p>
    <p v-else-if="variant === 'waiting'">Waiting for the captain...</p>
    <p v-else-if="variant === 'error'">Connection error</p>
    <p
      v-if="variant === 'waiting'"
      class="text-sm opacity-60 mt-2"
    >The presentation hasn't started yet</p>
    <p
      v-if="variant === 'error'"
      class="text-sm opacity-60 mt-2"
    >Check your internet connection</p>
  </div>
</template>
po