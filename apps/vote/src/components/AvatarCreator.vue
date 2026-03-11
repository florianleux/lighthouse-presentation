<script setup lang="ts">
import { onMounted } from 'vue'
import AvatarPreview from './AvatarPreview.vue'
import GenderSelector from './GenderSelector.vue'
import SkinToneSelector from './SkinToneSelector.vue'
import { useAvatar } from '../composables/useAvatar'
import type { Gender, SkinTone } from '../../../../shared/types'

const emit = defineEmits<{
  join: [string]
}>()

const { avatar, isSpinning, spinAndRandomize, setSkinTone, setGender, serialize } = useAvatar()

// Initial roll to show the randomize mechanic
onMounted(() => {
  spinAndRandomize()
})

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
  <div class="flex flex-col px-8 items-center gap-6 rounded-2xl w-full max-w-[400px]">

    <div class="
      absolute
      top-[36%]
      left-[50%]
      -translate-x-1/2
      -translate-y-1/2">
      <img
        src="/vote/A.webp"
        alt=""
        class="block max-h-[50dvh] max-w-[90vw]"
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <AvatarPreview
          :avatar="avatar"
          :size="0"
          class="h-[60%] z-10 aspect-square"
        />
      </div>
    </div>


    <GenderSelector
      class="
      absolute
      bottom-[25%]
      left-[50%]
      -translate-x-1/2
      -translate-y-1/2
      z-1000
      flex
      flex-col
      gap-8
      items-center"
      :model-value="avatar.gender"
      :disabled="isSpinning"
      @update:model-value="handleGenderChange"
    />

    <SkinToneSelector
      class="
      absolute
      bottom-[13%]
      left-[50%]
      -translate-x-1/2
      -translate-y-1/2
      z-1000
      flex
      flex-col
      gap-8
      items-center"
      :model-value="avatar.skinTone"
      :disabled="isSpinning"
      @update:model-value="handleSkinToneChange"
    />


    <div class="absolute bottom-[3%] left-1/2 -translate-x-1/2 flex gap-3 w-[90%] z-1000">
      <button
        class="flex-1 appearance-none py-4 px-4 text-xl font-semibold text-black bg-white shadow-[0_0_32px_-3px_rgba(0,0,0,0.62)] border-none rounded-xl cursor-pointer transition-all duration-200 hover:enabled:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed font-title uppercase"
        type="button"
        :disabled="isSpinning"
        @click="spinAndRandomize()"
      >
        {{ isSpinning ? 'SPINNING...' : 'RANDOMIZE' }}
      </button>
      <button
        class="flex-1 appearance-none py-4 px-4 text-xl font-semibold text-black bg-[#E9BB23] shadow-[0_0_32px_-3px_rgba(0,0,0,0.62)] border-none rounded-xl cursor-pointer transition-all duration-200 hover:enabled:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed font-title uppercase"
        type="button"
        :disabled="isSpinning"
        @click="handleJoin"
      >
        JOIN THE CREW
      </button>
    </div>
  </div>
</template>
