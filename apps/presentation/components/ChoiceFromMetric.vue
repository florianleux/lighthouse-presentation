<script setup lang="ts">
import { computed } from 'vue'
import { useResolvedMetric } from '../composables/useResolvedMetric'

const props = defineProps<{
  metricIndex: number
}>()

const { getResolvedChoiceProps } = useResolvedMetric()
const choiceProps = computed(() => getResolvedChoiceProps(props.metricIndex))
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/metric-intro-tr.webp');"
  >
    <Choice
      v-if="choiceProps"
      :option-a="choiceProps.optionA"
      :option-b="choiceProps.optionB"
    />
  </div>
</template>
