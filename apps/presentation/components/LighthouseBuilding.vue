<script setup lang="ts">
import { voteStore } from '../setup/main'
import { METRICS_LIST } from '../../../shared/metrics-data'
import { FLOOR_POSITIONS } from '../../../shared/floor-positions'

const METRICS_WITH_PNG = ['cls', 'fcp', 'lcp', 'tbt', 'si']

const floors = METRICS_LIST.map(m => ({
  label: m.name,
  key: m.name.toLowerCase(),
  index: m.index,
}))

function getFloorSrc(floor: { key: string; index: number }) {
  const choice = voteStore.path[floor.index]
  if (!choice) return null
  if (!METRICS_WITH_PNG.includes(floor.key)) return null
  return `/floors/floor-${floor.key}-${choice.toLowerCase()}.webp`
}

function getBuildingPos(key: string, index: number) {
  const choice = voteStore.path[index]
  if (!choice) return {}
  const option = choice.toLowerCase() as 'a' | 'b'
  return FLOOR_POSITIONS[key]?.building[option] ?? {}
}

</script>

<template>
  <div class="relative w-full h-full">
    <!-- Floor PNGs -->
    <img
      v-for="floor in floors"
      v-show="getFloorSrc(floor)"
      :key="floor.key"
      :src="getFloorSrc(floor) ?? ''"
      :style="getBuildingPos(floor.key, floor.index)"
      class="absolute -translate-x-1/2 transition-all duration-500"
      :alt="floor.label"
    />
  </div>
</template>
