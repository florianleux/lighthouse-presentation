<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { voteStore, sessionStore, getAbly } from '../setup/main'
import { ABLY_CHANNELS } from '../../../shared/constants'
import type { VoteStartedMessage } from '../../../shared/types'

const props = defineProps<{
  voteIndex: number
  labelA: string
  labelB: string
  nextSlide: number
}>()

const { go } = useNav()

// Is this vote currently active?
const isVoteActive = computed(() =>
  sessionStore.votePhase === 'voting' && sessionStore.activeVoteIndex === props.voteIndex
)

// Vote results for this vote
const results = computed(() => sessionStore.voteResults[props.voteIndex])

// Get crew member name by odientId
function getCrewName(odientId: string): string {
  const member = sessionStore.crew.find(m => m.odientId === odientId)
  return member?.name || odientId.slice(0, 8)
}

// Is this vote ended (show results)?
const isVoteEnded = computed(() =>
  sessionStore.votePhase === 'ended' && sessionStore.activeVoteIndex === props.voteIndex
)

// Determine winner based on vote counts
const winner = computed<'A' | 'B'>(() => {
  const aCount = results.value.A.length
  const bCount = results.value.B.length
  return bCount > aCount ? 'B' : 'A' // A wins in case of tie
})

const winnerLabel = computed(() =>
  winner.value === 'A' ? props.labelA : props.labelB
)

// Start vote session
async function startVoteSession() {
  sessionStore.activeVoteIndex = props.voteIndex
  sessionStore.votePhase = 'voting'

  const ably = getAbly()
  if (ably) {
    const message: VoteStartedMessage = {
      type: 'vote-started',
      voteIndex: props.voteIndex,
      duration: 0,
      timestamp: Date.now()
    }
    await ably.publish(ABLY_CHANNELS.SESSION, message)
    console.log('[VoteButtons] Vote session started for vote', props.voteIndex)
  }
}

// Stop vote session and show results
function stopVoteSession() {
  sessionStore.votePhase = 'ended'
  console.log('[VoteButtons] Vote session stopped for vote', props.voteIndex)
}

// Apply winner and continue
function continueWithWinner() {
  voteStore.vote(props.voteIndex, winner.value)
  sessionStore.activeVoteIndex = null
  go(props.nextSlide)
}

// Manual override vote (presenter choice)
function vote(choice: 'A' | 'B') {
  voteStore.vote(props.voteIndex, choice)
  sessionStore.votePhase = 'ended'
  sessionStore.activeVoteIndex = null
  go(props.nextSlide)
}
</script>

<template>
  <div class="vote-container">
    <!-- Start Vote Button -->
    <div v-if="!isVoteActive && !isVoteEnded" class="mb-6 text-center">
      <button
        class="px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 transition-all cursor-pointer"
        @click="startVoteSession"
      >
        Start Vote Session
      </button>
    </div>

    <!-- Voting in progress + Stop button -->
    <div v-else-if="isVoteActive" class="mb-4 text-center flex items-center justify-center gap-4">
      <span class="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold animate-pulse">
        Voting in progress...
      </span>
      <button
        class="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all cursor-pointer"
        @click="stopVoteSession"
      >
        Stop Vote Session
      </button>
    </div>

    <!-- Vote ended indicator + Continue button -->
    <div v-else-if="isVoteEnded" class="mb-4 text-center flex items-center justify-center gap-4">
      <span class="px-4 py-2 bg-gray-600 text-white rounded-full text-sm font-semibold">
        Voting ended
      </span>
      <button
        class="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all cursor-pointer"
        @click="continueWithWinner"
      >
        Continue with {{ winner }} - {{ winnerLabel }}
      </button>
    </div>

    <!-- Real-time vote results -->
    <div v-if="results.A.length > 0 || results.B.length > 0" class="grid grid-cols-2 gap-8 mb-6">
      <div class="p-4 border-2 border-blue-500 rounded-lg">
        <h3 class="text-lg font-bold text-blue-500 mb-2">A - {{ labelA }} ({{ results.A.length }})</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="odientId in results.A"
            :key="odientId"
            class="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
          >
            {{ getCrewName(odientId) }}
          </span>
        </div>
        <p v-if="results.A.length === 0" class="text-gray-400 text-sm">No votes yet</p>
      </div>
      <div class="p-4 border-2 border-amber-500 rounded-lg">
        <h3 class="text-lg font-bold text-amber-500 mb-2">B - {{ labelB }} ({{ results.B.length }})</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="odientId in results.B"
            :key="odientId"
            class="px-3 py-1 bg-amber-500 text-white text-sm rounded-full"
          >
            {{ getCrewName(odientId) }}
          </span>
        </div>
        <p v-if="results.B.length === 0" class="text-gray-400 text-sm">No votes yet</p>
      </div>
    </div>

    <!-- Presenter A/B buttons -->
    <div class="grid grid-cols-2 gap-8 pt-4">
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
  </div>
</template>
