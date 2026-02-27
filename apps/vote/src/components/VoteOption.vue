<script setup lang="ts">
defineProps<{
  bg: string
  floor: string
  floorStyle: Record<string, string>
  title: string
  subtitle: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    class="absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-2xl cursor-pointer transition-transform duration-200 active:scale-[0.97] z-1"
    @click="$emit('click')"
  >
    <img
      :src="bg"
      alt=""
      class="block max-h-[40dvh] max-w-[80vw]"
    />
    <img
      :src="floor"
      alt=""
      class="absolute -translate-x-1/2"
      :style="floorStyle"
    />
    <h3
      style="line-height: 0.8;"
      class="absolute bottom-[30%]  left-[10%] right-[10%] text-3xl font-bold text-black text-center font-title"
    >{{
      title
    }}
    </h3>
    <p class="absolute bottom-[20%] px-2 italic left-0 right-0 text-lg text-black/75 text-center font-body">{{ subtitle
    }}</p>
  </div>
</template>
