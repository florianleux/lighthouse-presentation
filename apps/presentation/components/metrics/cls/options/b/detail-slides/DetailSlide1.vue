<script setup lang="ts">
import { METRICS } from '../../../../../../../../shared/metrics-data'
import CodeSnippet from '../../../../../../components/CodeSnippet.vue'

const metric = METRICS.cls
const option = metric.options.b

const codeExample = `<div
  id="adContainer"
  style="min-height: 250px; min-width: 300px;"
>
  <!-- Ad script injects here -->
</div>`
</script>

<template>
  <div class="h-full flex flex-col gap-8 ">
    <div>
      <div class=" text-4xl font-title">
        {{ option.title }}
      </div>
      <div
        v-if="option.keywords[0]"
        class="text-left text-lg"
      >
        {{ option.keywords.join(' and ') }}
      </div>
    </div>
    <div class="items-center flex-grow justify-center flex mt-5 text-2xl gap-12">
      <div>
        Not designed by us
      </div>
      <div>
        Asynchronous loading
      </div>
      <div>
        Possible dynamic content
      </div>
    </div>
    <div class="flex flex-col items-center gap-8">
      <div>
        <div class="text-4xl font-bold">Reserve space</div>
      </div>
      <div>
        <CodeSnippet
          language="html"
          :code="codeExample"
          size="medium"
        />
      </div>
    </div>
    <div>

    </div>
  </div>
</template>
