<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { codeToHtml } from 'shiki'

type Size = 'small' | 'medium' | 'large'

const sizePresets: Record<Size, string> = {
  small: '0.75em',
  medium: '1em',
  large: '1.25em',
}

const props = withDefaults(defineProps<{
  code: string
  language?: string
  size?: Size
}>(), {
  size: 'medium',
})

const highlightedCode = ref('')

watchEffect(async () => {
  highlightedCode.value = await codeToHtml(props.code.trim(), {
    lang: props.language || 'text',
    theme: 'github-dark',
  })
})

const cssVars = computed(() => ({
  '--code-font-size': sizePresets[props.size],
}))
</script>

<template>
  <div class="code-snippet" :style="cssVars" v-html="highlightedCode" />
</template>

<style>
.code-snippet pre {
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: var(--code-font-size);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.code-snippet code {
  font-size: inherit;
  font-family: inherit;
}
</style>
