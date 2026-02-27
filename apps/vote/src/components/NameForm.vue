<script setup lang="ts">
defineProps<{
  modelValue: string
  validationMessage: string
  canSubmit: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <label for="name" class="text-sm text-left opacity-80">Your pirate name</label>
    <input
      id="name"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      placeholder="Captain Hook"
      maxlength="20"
      :disabled="disabled"
      @keyup.enter="emit('submit')"
      class="py-3 px-4 text-base border-2 border-white/20 rounded-lg bg-white/10 text-white outline-none transition-colors duration-200 focus:border-[#ffd700] placeholder:text-white/40"
    />
    <p
      v-if="validationMessage"
      class="text-xs text-[#ff6b6b] text-left"
    >{{ validationMessage }}</p>
    <button
      @click="emit('submit')"
      :disabled="!canSubmit"
      class="mt-2 py-3.5 px-6 text-base font-semibold text-[#1e3a5f] bg-[#ffd700] border-none rounded-lg cursor-pointer transition-all duration-200 hover:enabled:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>

