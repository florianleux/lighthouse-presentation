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
  >{{ $t('vote.submit.failed') }}</p>
  <p
    v-else-if="state === 'slow'"
    role="status"
    class="absolute left-1/2 -translate-x-1/2 w-[90%] z-1000 m-0 px-4 py-2 rounded-xl bg-black/70 text-center text-base text-white"
  >{{ $t('vote.submit.slow') }}</p>
</template>
