<script setup lang="ts">
import AvatarPreview from './AvatarPreview.vue'

const props = defineProps<{
  avatar: string | null
  name: string
  hasVotedOnce: boolean
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
        class="h-[60%] z-10 aspect-square absolute top-[25%]   -translate-y-1/2"
      />
      <span class="absolute bottom-[10%] left-[50%] -translate-1/2 text-4xl font-title text-black font-bold m-0">
        {{ name }}
      </span>
    </div>
  </div>

  <p
    class="absolute w-[90%] bottom-[7%] left-[50%] -translate-x-1/2 z-1000 text-[250%] leading-tight font-title text-shadow-md text-shadow-black text-white text-center">
    <template v-if="hasVotedOnce">
      Thanks for your vote!<br> The captain will let you know about the next vote!
    </template>
    <template v-else>
      Get ready for your next adventure!
    </template>
  </p>

</template>
