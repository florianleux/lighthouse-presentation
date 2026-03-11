<script setup lang="ts">
import { reactive, watch } from 'vue'
import { sessionStore } from '../setup/main'
import type { CrewMember } from '../../../shared/types'

const SLOT_COUNT = 5
const TOAST_DURATION = 2000
const STAGGER_DELAY = 400

interface Slot {
  member: CrewMember | null
  key: number
  filling: boolean
}

const slots = reactive<Slot[]>(
  Array.from({ length: SLOT_COUNT }, () => ({ member: null, key: 0, filling: false }))
)

const queue: CrewMember[] = []
let nextKey = 0

function fillSlots() {
  let delay = 0
  for (let i = 0; i < SLOT_COUNT && queue.length > 0; i++) {
    if (slots[i].member === null && !slots[i].filling) {
      const member = queue.shift()!
      slots[i].filling = true

      setTimeout(() => {
        slots[i].member = member
        slots[i].key = nextKey++
        slots[i].filling = false

        setTimeout(() => {
          slots[i].member = null
          fillSlots()
        }, TOAST_DURATION)
      }, delay)

      delay += STAGGER_DELAY
    }
  }
}

// Watch crew array length to detect new joins
watch(
  () => sessionStore.crew.length,
  (newLen, oldLen) => {
    if (newLen > oldLen) {
      const newMembers = sessionStore.crew.slice(oldLen)
      queue.push(...newMembers)
      fillSlots()
    }
  },
)
</script>



<template>
  <!-- Crew counter -->
  <div
    class="flex flex-col text-center w-[5%] -rotate-34 items-center absolute right-[11.2%] -translate-1/2 top-[14.1%] text-white text-md font-bold font-title"
  >
    <span class="text-[#36A300] mr-1 text-3xl">{{ sessionStore.crew.length }}</span>
    <span class="-mt-1 -rotate-6 mr-1.5 uppercase line-height-3 text-[#36A300] text-xs">crew<br>member{{
      sessionStore.crew.length > 1 ?
        's' : ''
    }}</span>
  </div>
  <div
    class="absolute top-35 -right-2 z-100 flex flex-col gap-0 pointer-events-none"
  >
    <div
      v-for="(slot, i) in slots"
      :key="i"
      class="h-[52px] relative"
    >
      <Transition name="toast">
        <div
          v-if="slot.member"
          :key="slot.key"
          class="absolute top-0 right-0 flex items-center gap-2.5 py-1 pl-2 pr-4 border border-[#39A400] rounded-md text-white text-sm whitespace-nowrap pointer-events-auto shadow-sm"
          style="background: linear-gradient(to top right, #F2F700, #6BFF00)"
        >
          <div class="shrink-0 w-8 h-8">
            <AvatarPreview
              class="-rotate-5 "
              :avatar="slot.member.avatar ?? ''"
              :size="32"
            />
          </div>
          <span class="font-bold text-[#36A300] text-md">{{ slot.member.name }}</span>
          <span class="text-[#36A300] text-md">joined!</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* Slide-in from right */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(120px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(80px);
}
</style>
