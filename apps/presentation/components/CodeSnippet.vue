<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { codeToHtml } from 'shiki'

type Size = 'tiny' | 'small' | 'medium' | 'large'

const sizePresets: Record<Size, string> = {
  tiny: '0.6em',
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
    theme: 'synthwave-84',
  })
})

const cssVars = computed(() => ({
  '--code-font-size': sizePresets[props.size],
}))
</script>

<template>
  <div
    class="code-snippet"
    :style="cssVars"
    v-html="highlightedCode"
  />
</template>

<style>
.code-snippet pre {
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: var(--code-font-size);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  background-color: rgba(62, 48, 17, 0.5) !important;
}

.code-snippet code {
  font-size: inherit;
  font-family: inherit;
}

/* Color overrides */
.code-snippet span[style*="#FE4450"] {
  color: #ffffff !important;
}

.code-snippet span[style*="#848BBD"] {
  color: #ffffff !important;
}

.code-snippet span[style*="#F97E72"] {
  color: #70ff46 !important;
}

.code-snippet span[style*="#BBBBBB"] {
  color: #ffffff !important;
}

.code-snippet span[style*="#FF8B39"] {
  color: #70ff47 !important;
}
</style>
