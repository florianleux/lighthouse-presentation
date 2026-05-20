<script setup lang="ts">
import MetricIntro from '../../MetricIntro.vue'
</script>

<template>
  <MetricIntro metric="tbt">
    <template #right>
      <img
        src="/images/tbt.gif"
        alt="démo TBT"
        class="absolute right-[10%] top-[12%] h-[75%] w-auto rounded shadow-md"
      />
    </template>
  </MetricIntro>
</template>
