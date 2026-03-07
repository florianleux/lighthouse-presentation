<script setup lang="ts">
import { useSlots, computed } from 'vue'
import { METRICS, type MetricName } from '../../../shared/metrics-data'

const props = defineProps<{
  metric: MetricName
}>()

const metricData = computed(() => METRICS[props.metric])

const slots = useSlots()
const hasRightSlot = computed(() => !!slots.right)

// Offset click numbers when right slot adds an extra step (click 3)
const formulaClick = 2
const tagsClick = computed(() => hasRightSlot.value ? 4 : 3)
const thresholdClick = computed(() => hasRightSlot.value ? 5 : 4)
</script>

<template>
  <div class="grid grid-cols-3 gap-8 h-full pt-6 pl-10 pr-5 pb-6">
    <div :class="[hasRightSlot ? 'col-span-2' : 'col-span-3', 'flex flex-col justify-between']">
      <div>
        <div class="flex justify-between items-baseline">
          <div>
            <span class="!m-0 text-6xl font-bold font-title">{{ metricData.name }}</span>
            <span class="ml-4 text-lg italic">{{ metricData.fullName }}</span>
          </div>
          <div
            v-click="1"
            class="text-orange-black font-bold text-5xl"
          >{{ metricData.weight }}%</div>
        </div>


        <div
          v-click="thresholdClick"
          class="relative mt-12"
        >
          <div class="flex rounded overflow-hidden h-8 mt-8">
            <div
              class="bg-green-500 border-1 border-r-0 border-green-800 font-bold text-green-900 text-bold flex-1 flex items-center justify-center text-md"
            >Good</div>
            <div
              class="bg-orange-500 border-y-1 border-orange-800 text-orange-900 font-bold flex-1 flex items-center justify-center text-md"
            >Average</div>
            <div
              class="bg-red-500 border-1 border-l-0 border-red-800 text-red-900 font-bold flex-1 flex items-center justify-center text-md"
            >Poor</div>
          </div>
          <span
            class="absolute text-black text-shadow- font-title font-bold text-xl"
            style="left: 33%; top: 150%; transform: translate(-50%, -50%)"
          >{{ metricData.thresholds[0] }}</span>
          <span
            class="absolute text-black font-title font-bold text-xl"
            style="left: 66%; top: 150%; transform: translate(-50%, -50%)"
          >{{ metricData.thresholds[1] }}</span>
        </div>

        <div
          v-click="formulaClick"
          class="mt-15 text-5xl font-bold text-center"
        >{{ metricData.formula }}</div>
        <div
          v-click="tagsClick"
          class="grid grid-cols-2 gap-10 mt-10 text-2xl text-center"
        >
          <span v-if="metricData.tags[0]">{{ metricData.tags[0] }}</span>
          <span v-if="metricData.tags[1]">{{ metricData.tags[1] }}</span>
          <span
            v-if="metricData.tags[2]"
            :class="[metricData.tags[3] ? 'col-span-1' : 'col-span-2']"
          >{{ metricData.tags[2] }}</span>
          <span v-if="metricData.tags[3]">{{ metricData.tags[3] }}</span>
        </div>

        <!-- Named slot for content under keywords -->
        <slot
          class="mt-10"
          name="bottom"
        />
      </div>


    </div>

    <div
      v-if="hasRightSlot"
      v-click="3"
      class="col-span-1 flex items-center justify-center"
    >
      <slot name="right" />
    </div>
  </div>
</template>
