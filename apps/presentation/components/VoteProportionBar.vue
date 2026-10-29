<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { sessionStore } from '../setup/main'

const props = defineProps<{
  voteIndex: number
  labelA: string
  labelB: string
  // Main levée : le présentateur saisit les comptes à la place des compteurs
  editable?: boolean
}>()

// Main levée : saisie directe, le parent ouvre le vote à la première saisie
const emit = defineEmits<{ 'hand-raise-input': [] }>()

// Get vote counts from sessionStore
const countA = computed(() => sessionStore.voteResults[props.voteIndex]?.A.length ?? 0)
const countB = computed(() => sessionStore.voteResults[props.voteIndex]?.B.length ?? 0)
const totalVotes = computed(() => countA.value + countB.value)

// Calculate raw percentage for A (B is derived)
const rawPercentageA = computed(() => {
  if (totalVotes.value === 0) return 50
  return (countA.value / totalVotes.value) * 100
})

// Proportions for bar widths (with minimum width for visibility)
const MIN_WIDTH = 5
const proportionA = computed(() => {
  if (totalVotes.value === 0) return 50
  if (countA.value === 0) return 0
  if (countB.value === 0) return 100
  return Math.max(MIN_WIDTH, Math.min(100 - MIN_WIDTH, rawPercentageA.value))
})

const proportionB = computed(() => 100 - proportionA.value)

// Display percentages (rounded)
const percentageA = computed(() => Math.round(rawPercentageA.value))
const percentageB = computed(() => 100 - percentageA.value)

const hasVotes = computed(() => totalVotes.value > 0)

// --- Saisie main levée ---
const validated = reactive({ A: false, B: false })
const inputValues = reactive({ A: '' as string | number, B: '' as string | number })
const inputA = ref<HTMLInputElement | null>(null)
const inputB = ref<HTMLInputElement | null>(null)

// Nouvelle session : la barre reste montée en main levée, on rouvre les saisies
watch(() => sessionStore.sessionId, () => {
  validated.A = validated.B = false
  inputValues.A = inputValues.B = ''
})

function showInput(side: 'A' | 'B') {
  return props.editable && !validated[side]
}

function submit(side: 'A' | 'B', e: KeyboardEvent) {
  emit('hand-raise-input')
  sessionStore.assignHandRaiseVote(props.voteIndex, side, Number(inputValues[side]))
  validated[side] = true
  // Rendre le focus à la slide : Slidev ignore ses raccourcis tant qu'un input a le focus
  ;(e.target as HTMLInputElement).blur()
}

async function edit(side: 'A' | 'B') {
  if (!props.editable) return
  inputValues[side] = side === 'A' ? countA.value : countB.value
  validated[side] = false
  await nextTick()
  ;(side === 'A' ? inputA : inputB).value?.focus()
  ;(side === 'A' ? inputA : inputB).value?.select()
}
</script>

<template>
  <div class="vote-proportion-bar mb-6">

    <!-- Bar container -->
    <div
      class="absolute top-[73.3%] right-[24.32%] left-[24.7%] bottom-[10.9%] overflow-hidden flex"
      :class="{ 'opacity-50': !hasVotes }"
    >
      <!-- Option A (Blue) -->
      <div
        class="flex items-center justify-center transition-all duration-500 ease-out"
        :class="hasVotes ? 'bg-option-a' : 'bg-gray-500'"
        :style="{ width: proportionA + '%' }"
      >
        <span
          v-if="proportionA > 15"
          class="text-white font-bold text-5xl"
        >
          A
        </span>
      </div>

      <!-- Option B (Amber) -->
      <div
        class="flex items-center justify-center transition-all duration-500 ease-out"
        :class="hasVotes ? 'bg-option-b' : 'bg-gray-600'"
        :style="{ width: proportionB + '%' }"
      >
        <span
          v-if="proportionB > 15"
          class="text-white font-bold text-5xl"
        >
          B
        </span>
      </div>
    </div>


    <div class=" absolute bottom-[10%] -translate-x-1/2 left-[11%] text-option-a text-center">
      <input
        v-if="showInput('A')"
        ref="inputA"
        v-model="inputValues.A"
        type="number"
        min="0"
        :max="sessionStore.crew.length"
        class="hand-raise-input font-title text-6xl text-option-a"
        @keydown.enter.prevent="submit('A', $event)"
      />
      <div
        v-else
        :class="{ 'cursor-pointer': editable }"
        @click="edit('A')"
      >
        <div class="font-title text-6xl">{{ hasVotes ? percentageA + '%' : '-' }}</div>
        <div
          v-if="hasVotes || validated.A"
          class="-mt-2 text-xl"
        >{{ countA }} voix</div>
      </div>
    </div>
    <div class="absolute bottom-[10%] right-[11%] translate-x-1/2 text-option-b text-center">
      <input
        v-if="showInput('B')"
        ref="inputB"
        v-model="inputValues.B"
        type="number"
        min="0"
        :max="sessionStore.crew.length"
        class="hand-raise-input font-title text-6xl text-option-b"
        @keydown.enter.prevent="submit('B', $event)"
      />
      <div
        v-else
        :class="{ 'cursor-pointer': editable }"
        @click="edit('B')"
      >
        <div class="font-title text-6xl">{{ hasVotes ? percentageB + '%' : '-' }}</div>
        <div
          v-if="hasVotes || validated.B"
          class="-mt-2 text-xl"
        >{{ countB }} voix</div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.hand-raise-input {
  width: 2.2em;
  border: none;
  background: transparent;
  text-align: center;
  outline: none;
  -moz-appearance: textfield;
}

.hand-raise-input::-webkit-outer-spin-button,
.hand-raise-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
