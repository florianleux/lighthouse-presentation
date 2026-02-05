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
  <div class="grid grid-cols-2 gap-8 h-full">
    <ChoiceOption
      letter="A"
      :title="optionA.title"
      :subtitle="optionA.subtitle"
      :keywords="optionA.keywords"
    />

    <ChoiceOption
      letter="B"
      :title="optionB.title"
      :subtitle="optionB.subtitle"
      :keywords="optionB.keywords"
    />
  </div>
</template>
