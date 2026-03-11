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
      <div class="grid grid-cols-2 items-start h-full">
        <!-- Left column: text + snippet -->
        <div class="flex flex-col gap-4">
          <div :class="[clicks >= 1 ? 'text-xl' : 'text-4xl', 'text-center transition-all duration-800']">What if we
            could have the best of both worlds?</div>
          <div
            v-click="1"
            class="text-4xl text-center font-bold mb-4"
          >Hide it in plain sight!</div>

          <div v-click="2">
            <CodeSnippet
              class="text-left px-4"
              language="css"
              :code="heroCSS"
              size="small"
            />
          </div>
        </div>

        <!-- Right column: splash gifs -->
        <div class="-mt-15 grid grid-cols-2 gap-10 pr-10">
          <img
            v-click="3"
            src="/lcp/splash-before.gif"
            alt=""
            class="rounded-lg "
          />
          <img
            v-click="4"
            src="/lcp/splash-after.gif"
            alt=""
            class="rounded-lg "
          />

        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
