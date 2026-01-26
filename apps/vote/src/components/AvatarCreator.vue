<script setup lang="ts">
import AvatarPreview from './AvatarPreview.vue'
import GenderSelector from './GenderSelector.vue'
import SkinToneSelector from './SkinToneSelector.vue'
import { useAvatar } from '../composables/useAvatar'
import type { Gender, SkinTone } from '../../../../shared/types'

const emit = defineEmits<{
  join: [string]
}>()

const { avatar, isSpinning, spinAndRandomize, setSkinTone, setGender, serialize } = useAvatar()

function handleGenderChange(gender: Gender) {
  setGender(gender)
}

function handleSkinToneChange(skinTone: SkinTone) {
  setSkinTone(skinTone)
}

function handleJoin() {
  emit('join', serialize())
}
</script>

<template>
  <div class="avatar-creator">
    <h2>Create Your Pirate</h2>

    <div class="preview-wrapper" :class="{ spinning: isSpinning }">
      <AvatarPreview :avatar="avatar" :size="200" />
    </div>

    <div class="selectors">
      <GenderSelector
        :model-value="avatar.gender"
        :disabled="isSpinning"
        @update:model-value="handleGenderChange"
      />

      <SkinToneSelector
        :model-value="avatar.skinTone"
        :disabled="isSpinning"
        @update:model-value="handleSkinToneChange"
      />
    </div>

    <div class="actions">
      <button class="random-btn" type="button" :disabled="isSpinning" @click="spinAndRandomize()">
        {{ isSpinning ? 'Spinning...' : 'Randomize' }}
      </button>
      <button class="join-btn" type="button" :disabled="isSpinning" @click="handleJoin">
        Join the crew
      </button>
    </div>
  </div>
</template>

<style scoped>
.avatar-creator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
}

h2 {
  margin: 0;
  font-size: 24px;
  color: #ffd700;
  text-align: center;
}

.preview-wrapper {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 16px;
  transition: box-shadow 0.2s;
}

.preview-wrapper.spinning {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.selectors {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.actions {
  display: flex;
  gap: 16px;
  width: 100%;
}

.random-btn,
.join-btn {
  flex: 1;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.random-btn {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.random-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.random-btn:disabled,
.join-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.join-btn {
  background: #ffd700;
  color: #1e3a5f;
}

.join-btn:hover:not(:disabled) {
  background: #ffed4a;
  transform: scale(1.02);
}
</style>
