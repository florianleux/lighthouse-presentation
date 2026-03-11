<script setup lang="ts">
import type { PollChoice } from '../../../../shared/types'

const emit = defineEmits<{
  poll: [choice: PollChoice]
}>()

const choices: { value: PollChoice; emoji: string; label: string; colorClass: string }[] = [
  { value: 'newbie', emoji: '🪣', label: 'Newbie', colorClass: 'border-blue-500 hover:enabled:bg-blue-500' },
  { value: 'captain', emoji: '⚓', label: 'Captain', colorClass: 'border-amber-500 hover:enabled:bg-amber-500' },
  { value: 'admiral', emoji: '🏴‍☠️', label: 'Admiral', colorClass: 'border-purple-500 hover:enabled:bg-purple-500' },
]
</script>

<template>
  <div class="py-5">
    <h2 class="text-[#ffd700] mb-2">Quick question!</h2>
    <p class="opacity-80 mb-5">What's your Lighthouse knowledge level?</p>
    <div class="flex flex-col gap-3">
      <button
        v-for="choice in choices"
        :key="choice.value"
        :class="['flex items-center gap-4 py-4 px-6 text-lg font-semibold border-3 rounded-xl bg-transparent cursor-pointer transition-all duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed', choice.colorClass]"
        @click="emit('poll', choice.value)"
      >
        <span class="text-[32px]">{{ choice.emoji }}</span>
        <span class="flex-1 text-left">{{ choice.label }}</span>
      </button>
    </div>
  </div>
</template>

