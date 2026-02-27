<script setup lang="ts">
import AvatarCreator from './AvatarCreator.vue'

defineProps<{
  name: string
  isJoining: boolean
}>()

const emit = defineEmits<{
  back: []
  join: [avatar: string]
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-4 relative">
    <button
      class="self-start py-2 px-4 text-sm text-white/80 bg-transparent border-2 border-white/30 rounded-lg cursor-pointer transition-all duration-200 hover:enabled:border-white/50 hover:enabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="emit('back')"
      :disabled="isJoining"
    >
      ← Back
    </button>
    <p class="text-lg text-[#ffd700] font-semibold m-0">{{ name }}</p>
    <AvatarCreator @join="(avatar: string) => emit('join', avatar)" />
    <div
      v-if="isJoining"
      class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl z-10"
    >
      <div class="w-10 h-10 border-3 border-white/30 border-t-[#ffd700] rounded-full animate-spin mx-auto mb-4"></div>
      <p>Boarding...</p>
    </div>
  </div>
</template>

