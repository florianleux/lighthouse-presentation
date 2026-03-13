<script setup lang="ts">
import type { PollChoice } from '../../../../shared/types'

const emit = defineEmits<{
  poll: [choice: PollChoice]
}>()

</script>

<template>
  <div class="relative h-full w-full">
    <div
      class="absolute left-1/2 -translate-x-1/2 top-[5%] h-[30%] cursor-pointer transition-transform duration-200 active:scale-[0.97] overflow-hidden rounded-2xl"
      @click="emit('poll', 'newbie')"
    >
      <img
        src="/vote/A.webp"
        alt=""
        class="h-full w-auto object-cover"
      />
      <img
        src="/poll/newbie.webp"
        alt="Newbie"
        class="absolute inset-0 m-auto w-[90%] object-contain"
      />
    </div>

    <div
      class="absolute left-1/2 -translate-x-1/2 top-[35%] h-[30%] cursor-pointer transition-transform duration-200 active:scale-[0.97] overflow-hidden rounded-2xl"
      @click="emit('poll', 'captain')"
    >
      <img
        src="/vote/A.webp"
        alt=""
        class="h-full w-auto object-cover"
      />
      <img
        src="/poll/captain.webp"
        alt="Captain"
        class="absolute inset-0 m-auto w-[90%] object-contain"
      />
    </div>

    <div
      class="absolute left-1/2 -translate-x-1/2 top-[65%] h-[30%] cursor-pointer transition-transform duration-200 active:scale-[0.97] overflow-hidden rounded-2xl"
      @click="emit('poll', 'admiral')"
    >
      <img
        src="/vote/A.webp"
        alt=""
        class="h-full w-auto object-cover"
      />
      <img
        src="/poll/admiral.webp"
        alt="Admiral"
        class="absolute inset-0 m-auto w-[90%] object-contain"
      />
    </div>
  </div>
</template>
