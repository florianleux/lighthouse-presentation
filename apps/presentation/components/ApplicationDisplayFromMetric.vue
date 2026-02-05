<script setup lang="ts">
import ApplicationDisplay from './ApplicationDisplay.vue'
import { getApplicationDisplayProps } from '../../../shared/metrics-data'
import { computed } from 'vue'

const props = defineProps<{
  metricIndex: number
}>()

const displayProps = computed(() => getApplicationDisplayProps(props.metricIndex))
</script>

<template>
  <ApplicationDisplay
    v-if="displayProps"
    :vote-index="displayProps.voteIndex"
    :category="displayProps.category"
    :floor="displayProps.floor"
  />
</template>
