<script setup lang="ts">
// CLS Option B - Detail Slide 1
// Third-party content: Ads & Embeds optimization
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center p-8">
    <h2 class="text-4xl font-bold mb-8 text-orange-500">
      Third-party Content
    </h2>

    <div class="max-w-4xl w-full space-y-8">
      <section>
        <h3 class="text-2xl font-semibold mb-4">Reserve Space for Ads</h3>
        <div class="bg-gray-800 rounded-lg p-6">
          <pre class="text-sm"><code class="text-green-400">.ad-container {
  min-height: 250px;
  aspect-ratio: 300/250;
  contain: layout;
}</code></pre>
        </div>
        <p class="mt-4 text-gray-300">
          Pre-allocate space for ad slots to prevent layout shift when ads load.
        </p>
      </section>

      <section>
        <h3 class="text-2xl font-semibold mb-4">Embed Placeholders</h3>
        <div class="bg-gray-800 rounded-lg p-6">
          <pre class="text-sm"><code class="text-green-400">&lt;div class="youtube-embed"
     style="aspect-ratio: 16/9;"&gt;
  &lt;!-- YouTube iframe loads here --&gt;
&lt;/div&gt;</code></pre>
        </div>
        <p class="mt-4 text-gray-300">
          Use aspect-ratio for embeds to maintain consistent dimensions.
        </p>
      </section>
    </div>
  </div>
</template>
