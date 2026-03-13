<script setup lang="ts">
defineProps<{
  letter: 'A' | 'B'
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="flex flex-col text-center w-[28%] h-[70%]">
    <div class="flex flex-col items-center mb-4">
      <div class="text-3xl font-title mt-5">
        Option {{ letter }}
      </div>
      <div class="text-6xl mt-5 font-bold font-title w-[100%] leading-13">{{ title }}</div>
      <div class="text-lg mt-3 italic text-center ">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>
