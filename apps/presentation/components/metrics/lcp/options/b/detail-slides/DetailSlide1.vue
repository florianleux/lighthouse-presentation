<script setup lang="ts">
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/parchment-top-left.png');"
  >
    <DetailSlide
      class="pl-10 pt-5"
      metric="lcp"
      option="b"
    >
      <div class="text-2xl font-bold text-center mb-10">LCP changes with screen size (and user behavior)</div>
      <div class="text-4xl text-center font-bold">Google judges mobile, users experience both</div>
      <div class="mt-15 grid grid-cols-2 items-center justify-center gap-15">
        <div class="flex flex-col items-center text-center gap-10">

          <div class="text-lg bg-green-500 p-10"> PLACEHOLDER SCHEMA LCP DESKTOP</div>
        </div>
        <div class="flex flex-col items-center gap-10">

          <div class="text-lg bg-green-500 p-10"> PLACEHOLDER SCHEMA LCP MOBILE</div>
        </div>
      </div>
    </DetailSlide>
  </div>
</template>
