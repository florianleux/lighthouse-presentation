<script setup lang="ts">
defineProps<{
  quadrant: 'top-left' | 'bottom-left' | 'bottom-right'
}>()
</script>

<template>
  <div
    class="slide-bg"
    :style="`background-image: url('/backgrounds/parchment-${quadrant}.webp');`"
  >
    <slot />

    <div
      class="overlay-layer"
      :style="`background-image: url('/backgrounds/props-${quadrant}.webp');`"
    />
    <div
      class="overlay-layer"
      :style="{
        backgroundImage: `url('/backgrounds/light-${quadrant}.webp')`,
        opacity: 0.43,
        mixBlendMode: 'screen',
      }"
    />
    <div
      class="overlay-layer"
      :style="{
        backgroundImage: `url('/backgrounds/shadow-${quadrant}.webp')`,
        opacity: 0.20,
        mixBlendMode: 'multiply',
      }"
    />
  </div>
</template>

<style scoped>
.overlay-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  pointer-events: none;
  z-index: 10;
}
</style>
