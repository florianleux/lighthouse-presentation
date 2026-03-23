<script setup lang="ts">
import AvatarPreview from './AvatarPreview.vue'

defineProps<{
  avatar: string | null
  name: string
}>()

const emit = defineEmits<{
  'show-feedback': []
}>()
</script>

<template>
  <div class="absolute top-[30%] -rotate-6 left-[50%] -translate-x-1/2 -translate-y-1/2">
    <img
      src="/vote/A.webp"
      alt=""
      class="block max-h-[50dvh] max-w-[90vw]"
    />
    <div class="absolute inset-0 flex items-center justify-center">
      <AvatarPreview
        v-if="avatar"
        :avatar="avatar"
        :size="0"
        class="h-[60%] z-10 aspect-square absolute top-[25%] -translate-y-1/2"
      />
      <span class="absolute bottom-[10%] left-[50%] -translate-1/2 text-4xl font-title text-black font-bold m-0">
        {{ name }}
      </span>
    </div>
  </div>

  <div class="absolute w-[90%] bottom-[5%] left-[50%] -translate-x-1/2 z-1000 text-center flex flex-col gap-4">
    <p class="text-[200%] leading-tight font-title text-shadow-md text-shadow-black text-white m-0">
      Thank you for building the lighthouse!
    </p>
    <a
      href="https://blackmarket.florianleux.fr/"
      target="_blank"
      rel="noopener noreferrer"
      class="py-4 px-8 text-xl font-semibold text-black bg-[#E9BB23] shadow-[0_0_32px_-3px_rgba(0,0,0,0.62)] border-none rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] font-title no-underline text-center"
    >
      Take a look at BlackMarket
    </a>
    <button
      class="py-4 px-8 text-xl font-semibold text-[#E9BB23] bg-black shadow-[0_0_32px_-3px_rgba(0,0,0,0.62)] border-none rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] font-title"
      @click="emit('show-feedback')"
    >
      Share your thoughts<br>with the captain
    </button>
  </div>
</template>
