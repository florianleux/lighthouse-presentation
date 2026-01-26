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
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

function handleClick(gender: Gender) {
  if (!props.disabled) {
    emit('update:modelValue', gender)
  }
}
</script>

<template>
  <div class="gender-selector" :class="{ disabled }">
    <span class="label">Gender</span>
    <div class="options">
      <button
        v-for="gender in genders"
        :key="gender.value"
        :class="['gender-btn', { selected: modelValue === gender.value }]"
        type="button"
        :disabled="disabled"
        @click="handleClick(gender.value)"
      >
        {{ gender.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.gender-selector {
  display: flex;
  align-items: center;
  gap: 16px;
}

.label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.options {
  display: flex;
  gap: 8px;
}

.gender-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.gender-btn:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.gender-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gender-btn.selected {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
}

.gender-selector.disabled {
  opacity: 0.7;
}
</style>
