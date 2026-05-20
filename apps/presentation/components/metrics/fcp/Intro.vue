<script setup lang="ts">
import MetricIntro from '../../MetricIntro.vue'
</script>

<template>
  <MetricIntro metric="fcp">
    <template #right>
      <img
        src="/images/fcp.gif"
        alt="démo FCP"
        class="absolute right-[10%] top-[12%] h-[75%] w-auto rounded shadow-md"
      />
    </template>
  </MetricIntro>
</template>
