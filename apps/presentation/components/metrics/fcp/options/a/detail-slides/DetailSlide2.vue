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
        class="absolute left-[20%] top-[50%] -translate-1/2 h-[38%]"
      />
      <img
        src="/images/ttfb/pirate.webp"
        class="absolute left-[20%] top-[50%] -translate-1/2 h-[22%]"
      />

      <!-- ===== ALWAYS VISIBLE: Server island + server ===== -->
      <div class="absolute left-[82%] w-[10%] top-[35%] -translate-x-1/2 text-center">
        <div class="text-2xl font-bold font-title">Island of the Skull</div>
      </div>
      <img
        src="/images/ttfb/island-server.webp"
        class="absolute left-[82%] top-[60%] -translate-1/2 h-[30%]"
      />
      <img
        src="/images/ttfb/server.webp"
        class="absolute left-[82%] top-[60%] -translate-1/2 h-[22%]"
      />

      <!-- ===== STEP 1: Direct round trip (clicks 1-2, hide at 3) ===== -->
      <svg
        v-click="[1, 3]"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="29%"
          y1="48%"
          x2="73%"
          y2="55%"
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
          x1="73%"
          y1="62%"
          x2="28%"
          y2="55%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>

      <!-- ===== STEP 1b: Empty step (click 3) — direct trip hides, pause ===== -->

      <!-- ===== STEP 2: Redirections — Skull Island (clicks 4-6, hide at 7) ===== -->
      <div
        v-click="[4, 7]"
        class="absolute w-[10%] left-[60%] top-[43%] -translate-x-1/2 text-center"
      >
        <div class="text-2xl font-bold font-title">Skull Island</div>
      </div>
      <img
        v-click="[4, 7]"
        src="/images/ttfb/island-cdn.webp"
        class="absolute left-[60%] top-[30%] -translate-1/2 h-[20%]"
      />
      <svg
        v-click="[4, 7]"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="30%"
          y1="45%"
          x2="55%"
          y2="35%"
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
          x1="65%"
          y1="35%"
          x2="75%"
          y2="50%"
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
          x1="72%"
          y1="62%"
          x2="30%"
          y2="55%"
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
        class="absolute left-[50%] top-[38%] -translate-1/2 h-[18%]"
      />
      <img
        v-click="8"
        src="/images/ttfb/rum.webp"
        class="absolute left-[50%] top-[24%] -translate-1/2 h-[12%] rotate-[2deg]"
      />
      <!-- ===== STEP 3c: Trip to CDN (clicks 9-10, hide at 11) ===== -->
      <svg
        v-click="[9, 11]"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="31%"
          y1="45%"
          x2="42%"
          y2="40%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>
      <svg
        v-click="[10, 11]"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="42%"
          y1="46%"
          x2="30%"
          y2="52%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>

      <!-- ===== STEP 4a: Empty step (click 11) — CDN hides, pause ===== -->

      <!-- ===== STEP 4b: Backend optimization (clicks 12-15) ===== -->
      <img
        v-click="12"
        src="/images/ttfb/tequila.webp"
        class="absolute left-[92%] top-[52%] -translate-1/2 h-[18%] rotate-[2deg]"
      />
      <!-- pirate → CDN -->
      <svg
        v-click="13"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="31%"
          y1="45%"
          x2="42%"
          y2="40%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>
      <!-- CDN → server -->
      <svg
        v-click="14"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="58%"
          y1="40%"
          x2="72%"
          y2="52%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>
      <!-- server → pirate (return) -->
      <svg
        v-click="15"
        class="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line
          x1="72%"
          y1="62%"
          x2="30%"
          y2="55%"
          stroke="#000000"
          stroke-width="9"
          stroke-dasharray="42,24"
        />
      </svg>

      <!-- ===== Bottom labels ===== -->
      <div class="absolute bottom-[19%] left-0 w-full flex justify-center gap-8">
        <div
          v-click="6"
          class="text-4xl font-bold"
        >Avoid redirects</div>
        <div
          v-click="10"
          class="text-4xl font-bold"
        >CDN</div>
        <div
          v-click="10"
          class="text-4xl font-bold"
        >Caching</div>
        <div
          v-click="15"
          class="text-4xl font-bold"
        >Backend Optimization</div>
      </div>

    </DetailSlide>
  </DetailSlideLayered>
</template>
