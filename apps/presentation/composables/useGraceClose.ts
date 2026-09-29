import { ref } from 'vue'

// Clôture différée d'un vote/sondage : le listener reste ouvert pendant le
// délai de grâce pour laisser arriver les réponses encore en vol (réseau de
// salle, téléphone qui sort de veille). isClosing pilote « Dépouillement... »
// et empêche une double clôture pendant l'attente.
export function useGraceClose(graceSeconds: number) {
  const isClosing = ref(false)

  async function waitForStragglers() {
    isClosing.value = true
    await new Promise(r => setTimeout(r, graceSeconds * 1000))
    isClosing.value = false
  }

  return { isClosing, waitForStragglers }
}
