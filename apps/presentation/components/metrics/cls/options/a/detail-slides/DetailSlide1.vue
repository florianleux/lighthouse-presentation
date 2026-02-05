<script setup lang="ts">
import DetailSlide from '../../../../../../components/DetailSlide.vue'
</script>

<template>
  <DetailSlide metric="cls" option="a">
    <div class="max-w-4xl w-full space-y-8 mx-auto">
      <section>
        <h3 class="text-2xl font-semibold mb-4">Image Optimization</h3>
        <div class="bg-gray-800 rounded-lg p-6">
          <pre class="text-sm"><code class="text-green-400">&lt;img
  src="product.jpg"
  width="400"
  height="300"
  alt="Product"
/&gt;</code></pre>
        </div>
        <p class="mt-4 text-gray-300">
          Always set explicit width and height attributes to reserve space.
        </p>
      </section>

      <section>
        <h3 class="text-2xl font-semibold mb-4">Font Loading Strategy</h3>
        <div class="bg-gray-800 rounded-lg p-6">
          <pre class="text-sm"><code class="text-green-400">@font-face {
  font-family: 'Pirate';
  font-display: swap;
  size-adjust: 105%;
}</code></pre>
        </div>
        <p class="mt-4 text-gray-300">
          Use font-display: swap with size-adjust to minimize layout shift.
        </p>
      </section>
    </div>
  </DetailSlide>
</template>
