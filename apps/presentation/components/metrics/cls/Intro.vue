<script setup lang="ts">
import MetricIntro from '../../MetricIntro.vue'
</script>

<template>
  <MetricIntro metric="cls">
    <template #right>
      <img
        src="/images/cls.gif"
        alt="CLS demo"
        class="absolute right-[10%] top-[12%] h-[75%]  w-auto rounded shadow-md"
      />
    </template>
  </MetricIntro>
</template>
