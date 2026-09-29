<script setup lang="ts">
import type { SubmissionState } from '../composables/useSubmission'

defineProps<{
  state: SubmissionState
}>()
</script>

<template>
  <p
    v-if="state === 'failed'"
    role="alert"
    class="absolute left-1/2 -translate-x-1/2 w-[90%] z-1000 m-0 px-4 py-2 rounded-xl bg-black/70 text-center text-base text-red-400"
  >Envoi refusé. Vérifiez votre connexion internet, puis réessayez.</p>
  <p
    v-else-if="state === 'slow'"
    role="status"
    class="absolute left-1/2 -translate-x-1/2 w-[90%] z-1000 m-0 px-4 py-2 rounded-xl bg-black/70 text-center text-base text-white"
  >Connexion lente : l'envoi partira dès le retour du réseau.</p>
</template>
