import { reactive, watch } from 'vue'
import { defineAppSetup } from '@slidev/types'

// Slides de vote (navigation bloquée)
export const VOTE_SLIDES = [11, 16, 21, 26]

// Store global pour les votes
export const voteStore = reactive({
  path: [null, null, null, null] as (string | null)[],

  vote(index: number, choice: 'A' | 'B') {
    this.path[index] = choice
  },

  getChoice(index: number) {
    return this.path[index]
  },

  reset() {
    this.path = [null, null, null, null]
  }
})

export default defineAppSetup(({ app }) => {
  // Rendre le store accessible globalement
  app.provide('voteStore', voteStore)
})
