<script setup lang="ts">
import MetricIntro from '../../MetricIntro.vue'
</script>

<template>
  <MetricIntro metric="lcp">
    <template #right>
      <img
        src="/images/lcp.gif"
        alt="démo LCP"
        class="absolute right-[10%] top-[12%] h-[75%] w-auto rounded shadow-md"
      />
    </template>
  </MetricIntro>
</template>
