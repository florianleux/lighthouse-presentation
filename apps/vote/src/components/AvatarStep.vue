<script setup lang="ts">
import AvatarCreator from './AvatarCreator.vue'

defineProps<{
  name: string
  isJoining: boolean
  joinFailed: boolean
  joinSlow: boolean
}>()

const emit = defineEmits<{
  back: []
  join: [avatar: string]
}>()
</script>

<template>

  <button
    class="absolute top-[2%] left-[5%] z-1000 appearance-none bg-transparent border-none text-[#ffd700] text-lg font-semibold font-title cursor-pointer transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
    @click="emit('back')"
    :disabled="isJoining"
  >
    <
      Retour
      </button
    >
      <p class="absolute top-[7.5%] left-[50%] z-1000 text-shadow-md text-shadow-black
         -translate-x-1/2 -translate-y-1/2 text-4xl font-title text-white font-bold m-0">
        {{ name }}</p>
      <p
        v-if="joinFailed"
        role="alert"
        class="absolute top-[13%] left-1/2 -translate-x-1/2 w-[90%] z-1000 m-0 px-4 py-2 rounded-xl bg-black/60 text-center text-base text-red-400"
      >Embarquement refusé. Vérifiez votre connexion internet, puis réessayez.</p>
      <AvatarCreator @join="(avatar: string) => emit('join', avatar)" />
      <div
        v-if="isJoining"
        class="absolute inset-0 bg-black/20 flex flex-col items-center justify-center rounded-2xl z-10"
      >
        <img
          src="/vote/wheel.webp"
          alt=""
          class=" animate-[spin_3s_linear_infinite] mx-auto mb-4"
        />
        <p>Embarquement...</p>
        <p
          v-if="joinSlow"
          class="text-sm opacity-80 mt-2 px-8 text-center"
        >Connexion lente : l'embarquement partira dès le retour du réseau.</p>
      </div>

</template>
