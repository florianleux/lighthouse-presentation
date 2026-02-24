<script setup lang="ts">
// Type that allows 1 to 4 keywords
type Keywords = [string] | [string, string] | [string, string, string] | [string, string, string, string]

defineProps<{
  letter: 'A' | 'B'
  title: string
  subtitle: string
  keywords: Keywords
}>()

</script>

<template>
  <div class="flex flex-col text-center w-[28%] h-[70%]">
    <div class="mb-4">
      <div class="flex flex-col items-center mb-4">
        <div class="text-xl font-bold font-title">
          Option {{ letter }}
        </div>
        <div class="text-4xl font-bold font-title w-[80%]">{{ title }}</div>
        <div class="text-lg italic text-center">
          {{ subtitle }}
        </div>
      </div>

    </div>

    <div
      v-if="keywords.length > 0"
      class="grid grid-cols-2 gap-4"
    >
      <div
        v-for="(keyword, index) in keywords"
        :key="index"
        class="text-2xl text-center px-1"
        :class="[
          index === keywords.length - 1 && keywords.length % 2 === 1 ? 'col-span-2' : ''
        ]"
      >
        {{ keyword }}
      </div>
    </div>
  </div>
</template>
