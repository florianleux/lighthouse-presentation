<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'
import { METRICS_LIST, getScoreData } from '../../../shared/metrics-data'

// Get score for a specific vote based on choice
function getScore(voteIndex: number): number | string {
  const choice = voteStore.path[voteIndex]
  if (!choice) return '??'
  const scoreData = getScoreData(voteIndex)
  if (!scoreData) return '??'
  return scoreData[choice as 'A' | 'B'].score
}

// Computed scores for all 5 metrics
const metricScores = computed(() =>
  METRICS_LIST.map((metric) => ({
    name: metric.name,
    fullName: metric.fullName,
    score: getScore(metric.index),
    weight: metric.weight,
  }))
)

// Check if all votes are complete
const allVoted = computed(() => voteStore.path.every((v) => v !== null))
</script>

<template>
  <div class="grid grid-cols-2 gap-8 pt-4">
    <div class="flex justify-center items-center">
      <div class="text-9xl">🗼</div>
    </div>
    <div>
      <div class="text-xl font-bold mb-4">Your path</div>
      <div class="flex gap-2 text-2xl mb-6">
        <template v-for="(choice, index) in voteStore.path" :key="index">
          <span v-if="index > 0">→</span>
          <span :class="choice === 'A' ? 'text-blue-500' : choice === 'B' ? 'text-amber-500' : 'text-gray-400'">
            {{ choice || '?' }}
          </span>
        </template>
      </div>
      <div class="text-xl font-bold mb-4">Final scores</div>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="metric in metricScores" :key="metric.name">
          <div
            class="text-3xl font-bold"
            :class="typeof metric.score === 'number' ? 'text-green-500' : 'text-gray-400'"
          >
            {{ metric.score }}
          </div>
          <div>{{ metric.name }}</div>
          <div class="text-xs opacity-50">{{ metric.weight }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>
