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

  <button
    class="absolute top-[2%] left-[5%] z-1000 appearance-none bg-transparent border-none text-[#ffd700] text-lg font-semibold font-title cursor-pointer transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
    @click="emit('back')"
    :disabled="isJoining"
  >
    <
      Back
      </button
    >
      <p class="absolute top-[7.5%] left-[50%] z-1000 text-shadow-md text-shadow-black
         -translate-x-1/2 -translate-y-1/2 text-4xl font-title text-white font-bold m-0">
        {{ name }}</p>
      <AvatarCreator @join="(avatar: string) => emit('join', avatar)" />
      <div
        v-if="isJoining"
        class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl z-10"
      >
        <img src="/vote/wheel.webp" alt="" class="w-16 h-16 animate-[spin_3s_linear_infinite] mx-auto mb-4" />
        <p>Boarding...</p>
      </div>

</template>
