<script setup lang="ts">
const jsCodeExample = `document.write()`
</script>

<template>

  <DetailSlideLayered quadrant="top-left">
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="fcp"
      option="b"
    >
      <div class="absolute text-4xl top-[22%] left-[15%]">
        <span class="i-ph-check-bold inline-block w-8 h-8 -mb-1" />
        HTML
      </div>

      <div class="absolute text-4xl top-[22%] left-[80%]">
        <span class="i-svg-spinners-bars-fade inline-block w-8 h-8 align-middle mb-1" /> CSS
      </div>



      <div v-click="2">
        <CodeSnippet
          class="absolute w-35  top-[35%] left-[4%]"
          language="js"
          :code="jsCodeExample"
          size="tiny"
        />
        <div
          class="absolute top-[53%] left-[13%] w-38.5 h-0.5 bg-[#FF2626] origin-left"
          style="transform: rotate(-20deg)"
        >
        </div>
        <div
          class="absolute top-[41%] left-[23%] text-[#FF2626] font-bold origin-left"
          style="transform: rotate(-20deg)"
        >
          stop!
        </div>

      </div>


      <div v-click="3">

        <div class="border border-5 border-[#FF2626] w-[10%] h-[15%] absolute top-[46%] left-[6%] " />
      </div>

      <div v-click="5">

        <div class="border border-5 border-[#FF2626] w-[15%] h-[12%] absolute top-[19%] left-[78%] " />

      </div>

      <div class="absolute text-4xl top-[50%] left-[7%]">
        <span class="i-svg-spinners-bars-fade inline-block w-8 h-8 align-middle " /> JS
      </div>

      <div class="absolute text-center text-5xl top-[85%] left-[47%]">
        FCP <div class="text-2xl -mt-3"> (interactive pixels)</div>
      </div>


      <!-- Parsing HTML -->
      <div
        v-click="1"
        class="absolute italic text-xl top-[36%] left-[30%]"
      >
        Parsing
      </div>
      <!-- Ligne HTML - DOM -->
      <div
        v-click="1"
        class="absolute top-[31%] left-[24%] w-30 h-0.5 bg-black origin-left"
        style="transform: rotate(51deg)"
      ></div>




      <div v-click="4">
        <!-- Parsing CSS -->
        <div class="absolute italic text-2xl top-[36%] left-[73%]">
          Parsing
        </div>
        <div class="absolute border border-2 border-black p-2 font-bold text-5xl top-[50%] left-[75%]">
          CSSOM
        </div>

        <!-- Ligne CSS - CSSOM -->
        <div
          class="absolute top-[31%] left-[86%] w-27 h-0.5 bg-black origin-left"
          style="transform: rotate(120deg)"
        ></div>
      </div>

      <div v-click="5">
        <div class="absolute top-[55.5%] left-[39.5%] w-81.5 h-0.5 bg-black origin-left"></div>


        <!-- Ligne DOM - CSSOM - FCP-->
        <div
          class="absolute top-[55.5%] left-[57%] w-34 h-0.5 bg-black origin-left"
          style="transform: rotate(90deg);"
        ></div>
        <div class="absolute italic text-2xl top-[65%] left-[59%]">
          Rendering
        </div>

      </div>


      <div
        v-click="1"
        class="absolute border border-2 border-black p-2 font-bold text-5xl top-[50%] left-[30%]"
      >
        DOM
      </div>



    </DetailSlide>
  </DetailSlideLayered>
</template>
