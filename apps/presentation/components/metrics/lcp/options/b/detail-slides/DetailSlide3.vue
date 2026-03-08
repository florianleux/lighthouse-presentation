<script setup lang="ts">
import { inject, computed } from 'vue'
const clicksContext = inject<{ value: { current: number } }>('$$slidev-clicks-context')
const clicks = computed(() => clicksContext?.value?.current ?? 0)

const heroCSS = `.hero {
  width: 100vw;
  height: 100vh;
  background-image: url('hero.jpg');
  background-size: cover;
  background-position: center;
}`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-right">
    <DetailSlide
      class="pl-10"
      metric="lcp"
      option="b"
    >
      <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">What if we could have the best of both worlds?</div>
      <div v-click="1" class="text-4xl text-center font-bold mb-7">Hide it in plain sight!</div>

      <div class="grid grid-cols-2 gap-x-10 items-start">
        <!-- Column 1: Full viewport cover -->
        <div v-click="2">
          <CodeSnippet
            class="text-left px-4"
            language="css"
            :code="heroCSS"
            size="small"
          />
        </div>

        <!-- Column 2: Placeholder -->
        <div v-click="3" class="w-full h-[250px] bg-[#39FF14] rounded-lg" />

      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
