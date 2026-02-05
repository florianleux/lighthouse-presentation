<script setup lang="ts">
import { METRICS } from '../../../../../../../../shared/metrics-data'

const metric = METRICS.tbt
const option = metric.options.b
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center p-8">
    <h2 class="text-4xl font-bold mb-8" :style="{ color: metric.color }">
      {{ option.title }}
    </h2>

    <div class="max-w-4xl w-full">
      <p class="text-xl text-gray-300 text-center">
        [PLACEHOLDER: Content for TBT Option B - Slide 1]
      </p>
    </div>
  </div>
</template>
