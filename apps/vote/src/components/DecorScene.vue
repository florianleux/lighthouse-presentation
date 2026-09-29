<script setup lang="ts">
import FadeInImg from './FadeInImg.vue'

// Décor commun aux écrans plein cadre : fond, ombre, contenu, halo de lumière.
// Les calques d'ambiance (faible opacité, mode de fusion) arrivent en fondu.
withDefaults(defineProps<{
  // Formulaire de nom : ombre plus marquée, non retournée.
  strongShadow?: boolean
}>(), {
  strongShadow: false,
})
</script>

<template>
  <div class="relative w-screen h-dvh overflow-hidden">
    <img
      src="/vote/Bg.webp"
      alt=""
      fetchpriority="high"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />
    <slot name="backdrop" />
    <FadeInImg
      src="/vote/shadow.webp"
      :opacity="strongShadow ? 0.48 : 0.34"
      class="absolute inset-0 w-full h-full object-cover z-2 pointer-events-none mix-blend-multiply"
      :class="{ '-scale-x-100': !strongShadow }"
    />
    <slot />
    <FadeInImg
      src="/vote/light.webp"
      :opacity="0.41"
      class="absolute inset-0 w-full h-full object-cover mix-blend-plus-lighter z-999 pointer-events-none"
    />
  </div>
</template>
