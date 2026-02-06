<script setup lang="ts">
</script>

<template>
  <DetailSlide
    metric="fcp"
    option="a"
  >
    <div class="mt-15 grid grid-cols-2 items-center justify-center gap-15">
      <div class="flex flex-col items-center text-center gap-10">
        <div class="text-2xl font-bold  text-center ">Some data (<span class="italic">almost</span>) never changes</div>
        <div class="text-4xl font-bold">Cache at every level</div>
        <div class="text-lg bg-green-500 p-10"> Max Yahya Maxou</div>
      </div>
      <div class="flex flex-col items-center gap-10">
        <div class="text-2xl font-bold text-center ">There will always be hits on the server</div>
        <div class="text-4xl font-bold">Optimize the backend</div>
        <div class="text-lg bg-green-500 p-10"> PLACEHOLDER SCHEMA</div>
      </div>
    </div>
  </DetailSlide>
</template>
