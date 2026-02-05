<script setup lang="ts">
import { METRICS } from '../../../../../../../../shared/metrics-data'

const metric = METRICS.cls
const option = metric.options.b
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center p-8">
    <h2 class="text-4xl font-bold mb-8" :style="{ color: metric.color }">
      {{ option.title }}
    </h2>

    <div class="max-w-4xl w-full">
      <p class="text-xl text-gray-300 text-center">
        [PLACEHOLDER: Additional content for CLS Option B]
      </p>
    </div>
  </div>
</template>
