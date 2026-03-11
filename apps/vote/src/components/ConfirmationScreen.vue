<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  hint?: string
  showCheckmark?: boolean
}>(), {
  hint: undefined,
  showCheckmark: false,
})
</script>

<template>

  <div class="absolute top-[30%] -rotate-6 left-[50%] -translate-x-1/2 -translate-y-1/2">
    <img
      src="/vote/A.webp"
      alt=""
      class="block max-h-[50dvh] max-w-[90vw]"
    />
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <div
        v-if="showCheckmark"
        class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-[36px] mb-2"
      >
        ✓
      </div>
      <span class="text-4xl font-title text-black font-bold m-0">
        {{ title }}
      </span>
    </div>
  </div>

  <p
    v-if="hint"
    class="absolute w-[80%] bottom-[15%] left-[50%] -translate-x-1/2 z-1000 text-6xl font-title text-shadow-md text-shadow-black text-white text-center"
  >
    {{ hint }}
  </p>

</template>
