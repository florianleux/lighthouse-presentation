<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  hint?: string
  showCheckmark?: boolean
}>(), {
  hint: undefined,
  showCheckmark: false,
})
</script>

<template>
  <div class="py-5">
    <div v-if="showCheckmark" class="w-15 h-15 bg-green-500 rounded-full flex items-center justify-center text-[32px] mx-auto mb-4">✓</div>
    <h2 class="text-[#ffd700] mb-2">{{ title }}</h2>
    <p v-if="hint" class="text-sm opacity-60 mt-2">{{ hint }}</p>
  </div>
</template>
