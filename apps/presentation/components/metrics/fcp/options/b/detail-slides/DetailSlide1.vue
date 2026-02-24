<script setup lang="ts">
const jsCodeExample = `document.write()`
</script>

<template>

  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/parchment-top-left.png');"
  >
    <DetailSlide
      class="pl-10 pt-5 relative"
      metric="fcp"
      option="b"
    >
      <div class="absolute text-2xl top-[25%] left-[18%]">
        <span class="i-ph-check-bold inline-block w-6 h-6 -mb-1" />
        HTML
      </div>

      <div class="absolute text-2xl top-[25%] left-[82%]">
        <span class="i-svg-spinners-bars-fade inline-block w- h-6 align-middle mb-1" /> CSS
      </div>



      <div v-click="3">
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


      <div v-click="4">
        <div
          class="absolute text-[#FF2626] font-bold top-[58%] left-[4%] underline text-sm w-[15%] leading-none text-center"
        >
          Parser-blocking resource
        </div>
        <div class="border border-2 border-[#FF2626] w-[15%] h-[19%] absolute top-[48%] left-[4%] " />
      </div>

      <div v-click="6">

        <div
          class="absolute text-[#FF2626] font-bold top-[17%] left-[79.5%] underline text-sm w-[15%] leading-none text-center"
        >
          Render-blocking resource
        </div>

        <div class="border border-2 border-[#FF2626] w-[15%] h-[19%] absolute top-[14%] left-[79.5%] " />

      </div>

      <div class="absolute text-2xl top-[50%] left-[7%]">
        <span class="i-svg-spinners-bars-fade inline-block w- h-6 align-middle " /> JS
      </div>

      <div class="absolute text-center text-4xl top-[85%] left-[50%]">
        FCP <div class="text-lg"> (interactive pixels)</div>
      </div>


      <!-- Parsing HTML -->
      <div
        v-click="2"
        class="absolute italic text-2xl top-[36%] left-[30%]"
      >
        Parsing
      </div>
      <!-- Ligne HTML - DOM -->
      <div
        v-click="2"
        class="absolute top-[31%] left-[24%] w-30 h-0.5 bg-black origin-left"
        style="transform: rotate(51deg)"
      ></div>



      <div v-click="[1, 2]">
        <!-- Ligne HTML - CSS -->
        <div class="absolute top-[28%] left-[30%] w-118 h-0.5 bg-black origin-left"></div>
        <!-- Ligne HTML - CSS - FCP-->
        <div
          class="absolute top-[28%] left-[57%] w-69 h-0.5 bg-black origin-left"
          style="transform: rotate(90deg);"
        ></div>
        <div class="absolute italic text-2xl top-[49%] left-[59%]">
          Rendering
        </div>
      </div>

      <div v-click="5">
        <!-- Parsing CSS -->
        <div class="absolute italic text-2xl top-[36%] left-[73%]">
          Parsing
        </div>
        <div class="absolute border border-2 border-black p-2 font-bold text-3xl top-[50%] left-[75%]">
          CSSOM
        </div>

        <!-- Ligne CSS - CSSOM -->
        <div
          class="absolute top-[31%] left-[86%] w-27 h-0.5 bg-black origin-left"
          style="transform: rotate(120deg)"
        ></div>
      </div>

      <div v-click="6">
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
        v-click="2"
        class="absolute border border-2 border-black p-2 font-bold text-3xl top-[50%] left-[30%]"
      >
        DOM
      </div>



    </DetailSlide>
  </div>
</template>
