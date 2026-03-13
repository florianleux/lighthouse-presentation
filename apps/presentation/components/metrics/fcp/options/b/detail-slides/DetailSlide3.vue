<script setup lang="ts">
const lodashCode = `
_.drop([1, 2, 3]);
// => [2, 3]
`
const noLodashCode = `
[1, 2, 3].slice(1);
// => [2, 3]
`

</script>

<template>
  <DetailSlideLayered quadrant="bottom-right">
    <DetailSlide
      class="pl-10"
      metric="fcp"
      option="b"
    >
      <div class=" mr-11 ml-5 grid grid-cols-3  text-center items-top gap-3">
        <div class="flex flex-col items-top gap-5">
          <div class="text-4xl font-bold">Use native methods!</div>

          <div class="text-left">
            <CodeSnippet
              language="js"
              :code="lodashCode"
              size="medium"
            />
            <CodeSnippet
              class="mt-10"
              language="js"
              :code="noLodashCode"
              size="medium"
            />
          </div>

        </div>
        <div
          v-click="1"
          class="flex flex-col col-span-2 items-center gap-5"
        >
          <div class="text-4xl font-bold">Defer or async it!</div>
          <div class="text-left w-full">
            <!-- JavaScript (defer) -->
            <div
              v-click="2"
              class="mb-2"
            >
              <div class="text-3xl font-bold mb-2">defer <span class="font-normal italic text-xl opacity-70">(analytics,
                  tracking)</span></div>
              <div class="grid grid-cols-4 gap-0.5 text-center">
                <!-- Row 1: HTML parsing continues -->
                <div class="bg-green-500 text-white text-xl px-2 py-2 rounded">Parsing</div>
                <div class="bg-green-500 text-white text-xl px-2 py-2 rounded">Parsing</div>
                <div class="bg-green-500 text-white text-xl px-2 py-2 rounded">Parsing</div>
                <div />
                <!-- Row 2: Script loading + execution after -->
                <div class="col" />
                <div class="col bg-orange-400 text-white text-xl px-2 py-2 rounded">JS Loading</div>
                <div></div>
                <div class="bg-orange-600  text-white text-xl px-2 py-2 rounded">JS Execution</div>
              </div>
            </div>
            <!-- JavaScript (async) -->
            <div
              v-click="3"
              class="mt-2"
            >
              <div class="text-3xl font-bold mb-2">async <span class="font-normal italic text-xl opacity-70">(chat
                  widget, ads)</span></div>
              <div class="grid grid-cols-4 gap-0.5">
                <!-- Row 1: HTML parsing interrupted -->
                <div class="bg-green-500 text-white text-xl px-2 py-2 rounded">Parsing</div>
                <div class="bg-green-500 text-white text-xl px-2 py-2 rounded">Parsing</div>
                <div></div>
                <div class="bg-green-500 text-white text-xl px-2 py-2 rounded">Parsing</div>
                <!-- Row 2: Script loading + immediate execution -->
                <div></div>
                <div class="bg-orange-400 text-white text-xl px-2 py-2 rounded">JS Loading</div>
                <div class="bg-orange-600 text-white text-xl px-2 py-2 rounded">JS Execution</div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </DetailSlide>
  </DetailSlideLayered>
</template>
