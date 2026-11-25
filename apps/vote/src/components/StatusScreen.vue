<script setup lang="ts">
defineProps<{
  variant: 'connecting' | 'waiting' | 'error'
}>()

defineEmits<{
  retry: []
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
    <p v-if="variant === 'connecting'">{{ $t('vote.status.connecting') }}</p>
    <p v-else-if="variant === 'waiting'">{{ $t('vote.status.waiting') }}</p>
    <p v-else-if="variant === 'error'">{{ $t('vote.status.error') }}</p>
    <p
      v-if="variant === 'waiting'"
      class="text-sm opacity-60 mt-2"
    >{{ $t('vote.status.notStarted') }}</p>
    <p
      v-if="variant === 'error'"
      class="text-sm opacity-60 mt-2"
    >{{ $t('vote.status.checkConnection') }}</p>
    <button
      v-if="variant === 'error'"
      type="button"
      class="mt-6 px-6 py-3 text-2xl rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
      @click="$emit('retry')"
    >{{ $t('vote.status.retry') }}</button>
  </div>
</template>