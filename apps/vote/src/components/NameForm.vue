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
  <div class="flex flex-col gap-2">
    <input
      id="name"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      placeholder="Votre nom"
      maxlength="20"
      :disabled="disabled"
      @keyup.enter="emit('submit')"
      class="appearance-none py-6 px-5 text-3xl border-2 border-white rounded-xl bg-white text-black outline-none transition-colors duration-200 focus:border-black placeholder:text-black/40 font-title text-center shadow-[0_0_32px_-3px_rgba(0,0,0,0.62)]"
    />

    <button
      @click="emit('submit')"
      :disabled="!canSubmit"
      class="appearance-none mt-3 py-6 px-8 text-3xl font-semibold text-black bg-[#E9BB23] shadow-[0_0_32px_-3px_rgba(0,0,0,0.62)] border-none rounded-xl cursor-pointer transition-all duration-200 hover:enabled:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed w-full font-title"
    >
      REJOINDRE L'ÉQUIPAGE
    </button>
  </div>
</template>
