<script setup lang="ts">
import AvatarPreview from './AvatarPreview.vue'

defineProps<{
  avatar: string | null
  name: string
}>()
</script>

<template>
  <div class="flex flex-col items-center py-5">
    <div class="avatar-wrapper w-full max-w-[500px] mb-4">
      <AvatarPreview
        v-if="avatar"
        :avatar="avatar"
        :size="400"
      />
    </div>
    <div class="py-2 px-5 bg-[rgba(255,215,0,0.2)] border-2 border-[#ffd700] rounded-[20px] text-[#ffd700] text-lg font-semibold -mt-[30px]">{{ name }}</div>
    <p class="text-sm opacity-60 mt-2">The captain will let you know about the next vote!</p>
  </div>
</template>

<style scoped>
.avatar-wrapper :deep(.avatar-container) {
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 1;
}

.avatar-wrapper :deep(.avatar-layer) {
  width: 100%;
  height: 100%;
}
</style>
