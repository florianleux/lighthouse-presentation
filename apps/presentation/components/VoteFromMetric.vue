<script setup lang="ts">
import { getVoteProps } from '../../../shared/metrics-data'
import { computed } from 'vue'

const props = defineProps<{
  metricIndex: number
}>()

const voteProps = computed(() => getVoteProps(props.metricIndex))
</script>

<template>
  <div
    class="slide-bg"
    style="background-image: url('/backgrounds/metric-intro-br.webp');"
  >
    <Vote
      v-if="voteProps"
      :title-a="voteProps.titleA"
      :title-b="voteProps.titleB"
      :vote-index="voteProps.voteIndex"
    />
  </div>
</template>
