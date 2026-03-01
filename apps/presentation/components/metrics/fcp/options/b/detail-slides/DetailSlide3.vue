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
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/cls-detail-4.webp');"
  >
    <DetailSlide
      class="pl-10"
      metric="fcp"
      option="b"
    >
      <div class=" mr-13 ml-11 grid grid-cols-3  text-center items-top gap-7">
        <div class="flex flex-col items-top gap-5">
          <div class="text-xl font-bold">Not always relevant anymore</div>
          <div class="text-4xl font-bold">Use native methods!</div>

          <div class="text-left">
            <CodeSnippet
              language="js"
              :code="lodashCode"
              size="tiny"
            />
            <CodeSnippet
              class="mt-3"
              language="js"
              :code="noLodashCode"
              size="tiny"
            />
          </div>

        </div>
        <div class="flex flex-col col-span-2 items-center gap-5">
          <div class="text-xl font-bold">Probably doesn't need to be blocking</div>
          <div class="text-4xl font-bold">Defer or async it!</div>
          <div class="text-left w-full">
            <!-- JavaScript (defer) -->
            <div class="mb-2">
              <div class="text-lg font-bold mb-2">defer</div>
              <div class="grid grid-cols-4 gap-0.5">
                <!-- Row 1: HTML parsing continues -->
                <div class="bg-green-500 text-white text-xs px-2 py-2 rounded">Parsing</div>
                <div class="bg-green-500 text-white text-xs px-2 py-2 rounded">Parsing</div>
                <div class="bg-green-500 text-white text-xs px-2 py-2 rounded">Parsing</div>
                <div />
                <!-- Row 2: Script loading + execution after -->
                <div class="col" />
                <div class="col bg-orange-400 text-white text-xs px-2 py-2 rounded">Script loading</div>
                <div></div>
                <div class="bg-orange-600  text-white text-xs px-2 py-2 rounded">Script execution</div>
              </div>
            </div>
            <!-- JavaScript (async) -->
            <div>
              <div class="text-lg font-bold mb-2">async</div>
              <div class="grid grid-cols-4 gap-0.5">
                <!-- Row 1: HTML parsing interrupted -->
                <div class="bg-green-500 text-white text-xs px-2 py-2 rounded">Parsing</div>
                <div class="bg-green-500 text-white text-xs px-2 py-2 rounded">Parsing</div>
                <div></div>
                <div class="bg-green-500 text-white text-xs px-2 py-2 rounded">Parsing</div>
                <!-- Row 2: Script loading + immediate execution -->
                <div></div>
                <div class="bg-orange-400 text-white text-xs px-2 py-2 rounded">Script loading</div>
                <div class="bg-orange-600 text-white text-xs px-2 py-2 rounded">Script execution</div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </DetailSlide>
  </div>
</template>
