<script setup lang="ts">
import { ref } from 'vue'

// Image décorative : apparaît en fondu une fois chargée, sans jamais retarder
// l'affichage de l'écran qui la contient.
withDefaults(defineProps<{
  opacity?: number
}>(), {
  opacity: 1,
})

const loaded = ref(false)
</script>

<template>
  <img
    alt=""
    class="transition-opacity duration-500"
    :style="{ opacity: loaded ? opacity : 0 }"
    @load="loaded = true"
  />
</template>
