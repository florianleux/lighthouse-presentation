<script setup lang="ts">
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/cls-detail-1.webp');"
  >
    <DetailSlide
      class="pl-10 pt-5"
      metric="lcp"
      option="b"
    >
      <div class="text-xl font-bold text-center mb-10">LCP changes with screen size (and user behavior)</div>
      <div class="text-4xl text-center font-bold -mt-5">Google judges mobile, users experience both</div>

      <img
        src="/images/lcp-desktop.png"
        alt="LCP Desktop"
        class="absolute left-[13%] bottom-[13%] h-[40%] w-auto"
      />
      <div class="absolute left-[21%] bottom-[22%] w-[33%] h-[15%] bg-[#39FF14]/40 border-2 border-[#39FF14]" />

      <img
        src="/images/lcp-mobile.png"
        alt="LCP Mobile"
        class="absolute right-[19%] bottom-[8%] h-[45%] w-auto"
      />
      <div class="absolute right-[19.2%] bottom-[7%] w-[11%] h-[9%] bg-[#39FF14]/40 border-2 border-[#39FF14]" />
    </DetailSlide>
  </div>
</template>
