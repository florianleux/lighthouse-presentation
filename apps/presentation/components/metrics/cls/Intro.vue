<!-- TODO: Review MetricIntro content (tags, thresholds, formula) -->
<script setup lang="ts">
import MetricIntro from '../../MetricIntro.vue'
</script>

<template>
  <MetricIntro metric="cls">
    <template #right>
      <img
        src="/images/cls.gif"
        alt="CLS demo"
        class="absolute right-[6%] top-[12%] h-[75%] rotate-[-2deg] w-auto rounded shadow-2xl"
      />
    </template>
  </MetricIntro>
</template>
