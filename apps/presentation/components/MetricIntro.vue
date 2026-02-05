<script setup lang="ts">
import { useSlots, computed } from 'vue'

defineProps<{
  h1: string
  h2: string
  weight: number
  thresholds: [number | string, number | string]
  h3: string
  tags: string[]
  businessInfo?: Array<{ company: string; comment: string }>
}>()

const slots = useSlots()
const hasRightSlot = computed(() => !!slots.right)
</script>

<template>
  <div class="grid grid-cols-3 gap-8 h-full">
    <div :class="[hasRightSlot ? 'col-span-2' : 'col-span-3', 'flex flex-col justify-between']">
      <div>
        <div class="flex justify-between items-baseline">
          <div>
            <span class="!m-0 text-6xl font-bold font-title">{{ h1 }}</span>
            <span class="ml-4 text-lg italic">{{ h2 }}</span>
          </div>
          <div class="text-orange-500 font-bold text-3xl">{{ weight }}%</div>
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
          >{{ thresholds[0] }}</span>
          <span
            class="absolute text-sm text-red-500 font-bold"
            style="left: 66%; top: 50%; transform: translate(-50%, -50%)"
          >{{ thresholds[1] }}</span>
        </div>

        <div class="mt-10 text-3xl font-bold text-center">{{ h3 }}</div>
        <div class="grid grid-cols-2 gap-10 mt-15 text-lg text-center">
          <span v-if="tags[0]">{{ tags[0] }}</span>
          <span v-if="tags[1]">{{ tags[1] }}</span>
          <span
            v-if="tags[2]"
            :class="[tags[3] ? 'col-span-2' : 'col-span-1']"
          >{{ tags[3] }}</span>
          <span v-if="tags[3]">{{ tags[4] }}</span>
        </div>

        <!-- Named slot for content under keywords -->
        <slot
          class="mt-10"
          name="bottom"
        />

        <div
          v-if="businessInfo && businessInfo.length > 0"
          class="mt-15"
        >
          <table class="w-full text-sm">
            <tbody>
              <tr
                v-for="(info, index) in businessInfo"
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
