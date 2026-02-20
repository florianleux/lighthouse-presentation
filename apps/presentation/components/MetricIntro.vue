<script setup lang="ts">
import { useSlots, computed } from 'vue'
import { METRICS, type MetricName } from '../../../shared/metrics-data'

const props = defineProps<{
  metric: MetricName
}>()

const metricData = computed(() => METRICS[props.metric])

const slots = useSlots()
const hasRightSlot = computed(() => !!slots.right)
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
          <div class="text-orange-500 font-bold text-3xl">{{ metricData.weight }}%</div>
        </div>


        <div class="relative mt-2">
          <div class="flex rounded overflow-hidden h-8">
            <div
              class="bg-white border-1 border-r-0 border-green-500 text-green-500 flex-1 flex items-center justify-center text-sm"
            >Good</div>
            <div
              class="bg-white border-y-1 border-orange-500 text-orange-500 flex-1 flex items-center justify-center text-sm"
            >Average</div>
            <div
              class="bg-white border-1 border-l-0 border-red-500 text-red-500 flex-1 flex items-center justify-center text-sm"
            >Poor</div>
          </div>
          <span
            class="absolute text-green-500 font-bold text-sm"
            style="left: 33%; top: 50%; transform: translate(-50%, -50%)"
          >{{ metricData.thresholds[0] }}</span>
          <span
            class="absolute text-sm text-red-500 font-bold"
            style="left: 66%; top: 50%; transform: translate(-50%, -50%)"
          >{{ metricData.thresholds[1] }}</span>
        </div>

        <div class="mt-10 text-3xl font-bold text-center">{{ metricData.formula }}</div>
        <div class="grid grid-cols-2 gap-10 mt-15 text-lg text-center">
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

        <div
          v-if="metricData.businessInfo && metricData.businessInfo.length > 0"
          class="mt-15"
        >
          <table class="w-full text-sm">
            <tbody>
              <tr
                v-for="(info, index) in metricData.businessInfo"
                :key="index"
              >
                <td class="font-bold pr-4 py-0!">{{ info.company }}</td>
                <td class="py-1! ">{{ info.comment }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


    </div>

    <div
      v-if="hasRightSlot"
      class="col-span-1 flex items-center justify-center"
    >
      <slot name="right" />
    </div>
  </div>
</template>
