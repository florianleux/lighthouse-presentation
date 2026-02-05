<script setup lang="ts">
import { getChoiceProps } from '../../../shared/metrics-data'
import { computed } from 'vue'

const props = defineProps<{
  metricIndex: number
}>()

const choiceProps = computed(() => getChoiceProps(props.metricIndex))
</script>

<template>
  <Choice
    v-if="choiceProps"
    :option-a="choiceProps.optionA"
    :option-b="choiceProps.optionB"
  />
</template>
