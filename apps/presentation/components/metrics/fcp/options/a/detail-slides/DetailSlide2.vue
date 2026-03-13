<script setup lang="ts">
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="fcp"
      option="a"
    >
      <!-- ===== ALWAYS VISIBLE: Client island + pirate ===== -->
      <img
        src="/images/ttfb/island-client.webp"
        class="absolute left-[15%] top-[40%] -translate-1/2 h-[45%]"
      />
      <img
        src="/images/ttfb/pirate.webp"
        class="absolute left-[15%] top-[40%] -translate-1/2 h-[25%] rotate-[10deg]"
      />

      <!-- ===== ALWAYS VISIBLE: Server island + server ===== -->
      <div
        class="absolute left-[85%] z-10 top-[87%] text-[#345b23] bg-[#B7D47B] border-2 border-[#345b23] px-2 py-1 rounded-md -translate-1/2 text-center shadow-md"
      >
        <div class="text-lg font-bold font-title">https://www.blackmarket.com</div>
      </div>
      <img
        src="/images/ttfb/island-server.webp"
        class="absolute left-[88%] top-[72%] -translate-1/2 h-[40%]"
      />
      <img
        src="/images/ttfb/server.webp"
        class="absolute left-[88%] top-[72%] -translate-1/2 h-[25%] rotate-[-10deg]"
      />
      <img
        src="/images/ttfb/rum.webp"
        class="absolute left-[95%] top-[60%] -translate-1/2 h-[15%] -rotate-[5deg]"
      />

      <!-- ===== STEP 1: Direct round trip (clicks 1-2, hide at 3) ===== -->
      <svg
        v-click="[1, 3]"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="27%"
          y1="40%"
          x2="78%"
          y2="63%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>
      <svg
        v-click="[2, 3]"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="75%"
          y1="75%"
          x2="23%"
          y2="52%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>

      <!-- ===== STEP 1b: Empty step (click 3) — direct trip hides, pause ===== -->

      <!-- ===== STEP 2: Redirections — Skull Island (clicks 4-6, hide at 7) ===== -->
      <div
        v-click="[4, 7]"
        class="absolute left-[60%] z-10 top-[25%] text-[#345b23] bg-[#B7D47B] border-2 border-[#345b23] px-2 py-1 rounded-md -translate-1/2 text-center shadow-md"
      >
        <div class="text-lg font-bold font-title">https://blackmarket.com</div>
      </div>
      <img
        v-click="[4, 7]"
        src="/images/ttfb/island-cdn.webp"
        class="absolute left-[60%] top-[25%] -translate-1/2 h-[30%]"
      />
      <svg
        v-click="[4, 7]"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="27%"
          y1="40%"
          x2="48%"
          y2="32%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>
      <svg
        v-click="[5, 7]"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="67%"
          y1="35%"
          x2="78%"
          y2="55%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>
      <svg
        v-click="[6, 7]"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="75%"
          y1="70%"
          x2="27%"
          y2="50%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>

      <!-- ===== STEP 3a: Empty step (click 7) — step 2 hides, pause ===== -->

      <!-- ===== STEP 3b: CDN — Boat + rum (click 8, stays through backend) ===== -->
      <img
        v-click="8"
        src="/images/ttfb/cdn.webp"
        class="absolute left-[52%] top-[40%] -translate-1/2 h-[30%]"
      />
      <img
        v-click="8"
        src="/images/ttfb/rum.webp"
        class="absolute left-[62%] top-[27%] -translate-1/2 h-[20%] rotate-[25deg]"
      />
      <!-- ===== STEP 3c: Trip to CDN (clicks 9-10, hide at 11) ===== -->
      <svg
        v-click="9"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="27%"
          y1="37%"
          x2="43%"
          y2="37%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>
      <svg
        v-click="10"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="27%"
          y1="47%"
          x2="43%"
          y2="47%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>

      <!-- ===== Bottom labels ===== -->
      <div class="flex-col  absolute bottom-[17%] left-[7%] w-full flex justify-center gap-0">
        <div
          v-click="6"
          class="text-4xl font-bold"
        >Avoid redirects</div>
        <div
          v-click="10"
          class="text-4xl font-bold"
        >Setup a CDN</div>
        <div
          v-click="10"
          class="text-4xl font-bold"
        >Cache your assets</div>
      </div>

    </DetailSlide>
  </DetailSlideLayered>
</template>
