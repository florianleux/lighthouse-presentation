<script setup lang="ts">
import type { SkinTone } from '../../../../shared/types'

const props = withDefaults(defineProps<{
  modelValue: SkinTone
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [SkinTone]
}>()

const tones: { value: SkinTone; color: string; label: string }[] = [
  { value: 'light', color: '#f1c27d', label: 'Light' },
  { value: 'mid', color: '#c68642', label: 'Medium' },
  { value: 'dark', color: '#8d5524', label: 'Dark' },
]

function handleClick(tone: SkinTone) {
  if (!props.disabled) {
    emit('update:modelValue', tone)
  }
}
</script>

<template>
  <div class="skin-tone-selector" :class="{ disabled }">
    <span class="label">Skin Tone</span>
    <div class="options">
      <button
        v-for="tone in tones"
        :key="tone.value"
        :class="['tone-btn', { selected: modelValue === tone.value }]"
        type="button"
        :disabled="disabled"
        @click="handleClick(tone.value)"
      >
        <span class="color-dot" :style="{ background: tone.color }"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.skin-tone-selector {
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
  gap: 12px;
}

.tone-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tone-btn:hover:not(:disabled) {
  transform: scale(1.1);
}

.tone-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tone-btn.selected {
  border-color: #ffd700;
}

.skin-tone-selector.disabled {
  opacity: 0.7;
}

.color-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
}
</style>
