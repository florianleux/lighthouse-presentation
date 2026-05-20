<script setup lang="ts">
import type { Gender } from '../../../../shared/types'

const props = withDefaults(defineProps<{
  modelValue: Gender
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [Gender]
}>()

const genders: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Homme' },
  { value: 'female', label: 'Femme' },
]

function handleClick(gender: Gender) {
  if (!props.disabled) {
    emit('update:modelValue', gender)
  }
}
</script>

<template>
  <div
    class="flex items-center gap-4"
    :class="{ 'opacity-70': disabled }"
  >
    <div class="flex gap-2">
      <button
        v-for="gender in genders"
        :key="gender.value"
        class="py-2 px-4 text-bold rounded-[20px] border-4 bg-transparent text-white text-3xl font-bold cursor-pointer transition-all duration-200 hover:enabled:border-white/50 hover:enabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="modelValue === gender.value ? 'border-[#ffd700] bg-[rgba(255,215,0,0.2)] text-[#ffd700]!' : 'border-white'"
        type="button"
        :disabled="disabled"
        @click="handleClick(gender.value)"
      >
        {{ gender.label }}
      </button>
    </div>
  </div>
</template>
