<script setup lang="ts">
// Type that allows 1 to 4 keywords
type Keywords = [string] | [string, string] | [string, string, string] | [string, string, string, string]

interface Option {
  title: string
  subtitle: string
  keywords: Keywords
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
    :keywords="optionA.keywords"
  />

  <ChoiceOption
    class="absolute top-[16%] right-[8%]"
    style="transform: rotate(14deg)"
    letter="B"
    :title="optionB.title"
    :subtitle="optionB.subtitle"
    :keywords="optionB.keywords"
  />

</template>
