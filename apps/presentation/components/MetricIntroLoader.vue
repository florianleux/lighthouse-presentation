<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'
import type { MetricName } from '../../../shared/metrics-data'

const props = defineProps<{
  metric: MetricName
}>()

const IntroComponent = computed<Component | null>(() => {
  return defineAsyncComponent({
    loader: () => import(`./metrics/${props.metric}/Intro.vue`),
    onError: () => null,
  })
})
</script>

<template>
  <component v-if="IntroComponent" :is="IntroComponent" />
</template>
