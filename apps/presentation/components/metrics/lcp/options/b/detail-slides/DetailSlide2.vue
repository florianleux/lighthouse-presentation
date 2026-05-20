<script setup lang="ts">
const heroCSS = `.hero {
  width: 100vw;
  height: 100vh;
  background-image: url('hero.jpg');
  background-size: cover;
  background-position: center;
}`
</script>

<template>
  <DetailSlideLayered quadrant="bottom-left">
    <DetailSlide
      class="pl-10"
      metric="lcp"
      option="b"
    >
      <div class="grid grid-cols-2 items-start h-full">
        <!-- Left column: text + snippet -->
        <div class="flex flex-col gap-4">
          <div class="text-5xl text-center mb-3">Et si on avait
            <br>le meilleur des<br>deux mondes ?</div>

          <div v-click="1">
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
            v-click="1"
            src="/lcp/splash-before.gif"
            alt=""
            class="rounded-lg "
          />
          <img
            v-click="2"
            src="/lcp/splash-after.gif"
            alt=""
            class="rounded-lg "
          />

        </div>
      </div>
    </DetailSlide>
  </DetailSlideLayered>
</template>
