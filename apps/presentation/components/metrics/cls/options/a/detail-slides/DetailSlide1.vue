<script setup lang="ts">
// CLS Option A - Detail Slide 1
// First-party assets: Images & Fonts optimization
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center p-8">
    <h2 class="text-4xl font-bold mb-8 text-orange-500">
      First-party Assets
    </h2>

    <div class="max-w-4xl w-full space-y-8">
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
  </div>
</template>
