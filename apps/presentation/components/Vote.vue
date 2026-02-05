<script setup lang="ts">
import { onMounted } from 'vue'
import { useNav } from '@slidev/client'
import { registerVoteSlide } from '../setup/main'

const props = defineProps<{
  titleA: string
  titleB: string
  voteIndex: number
}>()

const { currentSlideNo } = useNav()

// Register this slide as a vote slide when mounted
onMounted(() => {
  registerVoteSlide(currentSlideNo.value, props.voteIndex)
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Option titles -->
    <div class="grid grid-cols-2 gap-8">
      <!-- Option A -->
      <div class="flex flex-col items-center justify-center border-4 border-blue-500 rounded-xl p-6 bg-blue-500/5">
        <div class="text-2xl font-bold text-blue-500 font-title mb-2">Option A</div>
        <div class="text-xl font-bold font-title">{{ titleA }}</div>
      </div>

      <!-- Option B -->
      <div class="flex flex-col items-center justify-center border-4 border-amber-500 rounded-xl p-6 bg-amber-500/5">
        <div class="text-2xl font-bold text-amber-500 font-title mb-2">Option B</div>
        <div class="text-xl font-bold font-title">{{ titleB }}</div>
      </div>
    </div>

    <!-- Vote buttons and controls -->
    <VoteButtons
      :vote-index="voteIndex"
      :label-a="titleA"
      :label-b="titleB"
    />
  </div>
</template>
