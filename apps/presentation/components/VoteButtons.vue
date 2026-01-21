<script setup lang="ts">
import { useNav } from '@slidev/client'
import { voteStore } from '../setup/main'

const props = defineProps<{
  voteIndex: number
  labelA: string
  labelB: string
  nextSlide: number
}>()

const { go } = useNav()

function vote(choice: 'A' | 'B') {
  voteStore.vote(props.voteIndex, choice)
  go(props.nextSlide)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-8 pt-8">
    <button
      class="p-8 border-4 border-blue-500 rounded-lg text-2xl font-bold hover:bg-blue-500 hover:text-white transition-all cursor-pointer"
      @click="vote('A')"
    >
      A - {{ labelA }}
    </button>
    <button
      class="p-8 border-4 border-amber-500 rounded-lg text-2xl font-bold hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
      @click="vote('B')"
    >
      B - {{ labelB }}
    </button>
  </div>
</template>
