<script setup lang="ts">
import type { PollChoice } from '../../../../shared/types'

const emit = defineEmits<{
  poll: [choice: PollChoice]
}>()

</script>

<template>
  <div class="relative h-full w-full">
    <div
      class="absolute w-full left-1/2 -translate-x-1/2 top-[5%] h-[30%] cursor-pointer transition-transform duration-200 active:scale-[0.97] overflow-hidden rounded-2xl"
      @click="emit('poll', 'newbie')"
    >
      <img
        src="/vote/A.webp"
        class="block h-full w-auto mx-auto "
        alt="" "
      />
      <img
        src="
        /poll/newbie.webp"
        alt="Mousse"
        class="absolute left-[50%]  -translate-x-1/2 m-auto h-[55%] top-[15%]"
      />
      <div
        class="absolute left-[50%] text-center text-3xl font-bold font-title text-black top-[69%] -translate-x-1/2 m-auto"
      >Mousse</div>
    </div>


    <div
      class="absolute w-full left-1/2 -translate-x-1/2 top-[35%] h-[30%] cursor-pointer transition-transform duration-200 active:scale-[0.97] overflow-hidden rounded-2xl"
      @click="emit('poll', 'captain')"
    >
      <img
        src="/vote/A.webp"
        class="block h-full w-auto mx-auto "
      />
      <img
        src="/poll/captain.webp"
        alt="Capitaine"
        class="absolute left-[50%]  -translate-x-1/2 m-auto h-[55%] top-[15%]"
      />
      <div
        class="absolute left-[50%] text-center text-3xl font-bold font-title text-black top-[69%] -translate-x-1/2 m-auto"
      >Capitaine</div>
    </div>

    <div
      class="absolute w-full left-1/2 -translate-x-1/2 top-[65%] h-[30%] cursor-pointer transition-transform duration-200 active:scale-[0.97] overflow-hidden rounded-2xl"
      @click="emit('poll', 'admiral')"
    >
      <img
        src="/vote/A.webp"
        class="block h-full w-auto mx-auto "
      />
      <img
        src="/poll/admiral.webp"
        alt="Amiral"
        class="absolute left-[50%]  -translate-x-1/2 m-auto h-[55%] top-[15%]"
      />
      <div
        class="absolute left-[50%] text-center text-3xl font-bold font-title text-black top-[69%] -translate-x-1/2 m-auto"
      >Amiral</div>
    </div>
  </div>
</template>
