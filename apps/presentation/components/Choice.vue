<script setup lang="ts">
interface Option {
  title: string
  subtitle: string
}

defineProps<{
  optionA: Option
  optionB: Option
}>()
</script>

<template>

  <ChoiceOption
    class="absolute top-[18%] left-[9%]"
    style="transform: rotate(-13deg)"
    letter="A"
    :title="optionA.title"
    :subtitle="optionA.subtitle"
  />

  <ChoiceOption
    class="absolute top-[16%] right-[8%]"
    style="transform: rotate(14deg)"
    letter="B"
    :title="optionB.title"
    :subtitle="optionB.subtitle"
  />

</template>
