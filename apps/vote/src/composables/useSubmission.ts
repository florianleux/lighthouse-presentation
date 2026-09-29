import { ref, computed } from 'vue'

export type SubmissionState = 'idle' | 'pending' | 'slow' | 'failed'

// Au-delà, l'écriture attend très probablement le réseau : hors ligne, le SDK
// Firestore la garde en file jusqu'à l'acquittement serveur.
const SLOW_MS = 5000

// État d'un envoi, propre à l'écran qui l'affiche : il repart de zéro quand
// l'écran est remonté (nouveau round, retour arrière, nouvelle keynote).
// Rien n'est rejoué ici : le SDK rejoue lui-même les erreurs transitoires, un
// rejet est définitif et c'est à l'utilisateur de retenter.
export function useSubmission() {
  const state = ref<SubmissionState>('idle')
  const busy = computed(() => state.value === 'pending' || state.value === 'slow')

  async function run(write: () => Promise<void>) {
    if (busy.value) return
    state.value = 'pending'
    const timer = setTimeout(() => {
      if (state.value === 'pending') state.value = 'slow'
    }, SLOW_MS)
    try {
      await write()
      state.value = 'idle'
    } catch (err) {
      console.error('[Firestore] Write rejected:', err)
      state.value = 'failed'
    } finally {
      clearTimeout(timer)
    }
  }

  return { state, busy, run }
}
