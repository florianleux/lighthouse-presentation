<script setup lang="ts">
</script>

<template>
  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="lcp"
      option="b"
    >
      <div class="text-5xl text-left ml-10 mb-20">LCP changes with
        screen size</div>

      <div v-click="1">
        <img
          src="/images/lcp-desktop.webp"
          alt="LCP Desktop"
          class="absolute left-[8%] bottom-[10%] h-[50%] w-auto"
        />
        <div class="absolute left-[18%] bottom-[21%] w-[38%] h-[19%] bg-[#39FF14]/40 border-2 border-[#39FF14]" />
      </div>

      <div v-click="2">
        <img
          src="/images/lcp-mobile.webp"
          alt="LCP Mobile"
          class="absolute right-[8%] bottom-[5%] h-[78%] w-auto"
        />
        <div class="absolute right-[8%] bottom-[4%] w-[19%] h-[15%] bg-[#39FF14]/40 border-2 border-[#39FF14]" />
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
