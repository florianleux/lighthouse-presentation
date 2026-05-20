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
  { value: 'light', color: 'rgb(252 215 195)', label: 'Clair' },
  { value: 'mid', color: 'rgb(209 133 89)', label: 'Moyen' },
  { value: 'dark', color: 'rgb(85 63 48)', label: 'Foncé' },
]

function handleClick(tone: SkinTone) {
  if (!props.disabled) {
    emit('update:modelValue', tone)
  }
}
</script>

<template>
  <div
    class="flex items-center gap-4"
    :class="{ 'opacity-70': disabled }"
  >
    <div class="flex gap-3">
      <button
        v-for="tone in tones"
        :key="tone.value"
        class="size-15 rounded-full border-5 bg-transparent shadow-lg cursor-pointer p-1 transition-all duration-200 flex items-center justify-center hover:enabled:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="modelValue === tone.value ? 'border-[#ffd700]' : 'border-none'"
        type="button"
        :disabled="disabled"
        @click="handleClick(tone.value)"
      >
        <span
          class="w-full h-full rounded-full block"
          :style="{ background: tone.color }"
        ></span>
      </button>
    </div>
  </div>
</template>
