import Ably from 'ably'
import { ref, shallowRef } from 'vue'
import { ABLY_CHANNELS } from '../../../../shared/constants'
import type { AvatarCreatedMessage } from '../../../../shared/types'

interface AblyState {
  client: Ably.Realtime | null
  isConnected: boolean
}

const state = shallowRef<AblyState>({
  client: null,
  isConnected: false,
})

// ID unique pour ce participant
let odientId: string | null = null

export function useAbly() {
  const isConnected = ref(state.value.isConnected)
  const error = ref<Error | null>(null)

  /**
   * Connecte au serveur Ably
   */
  async function connect(apiKey: string): Promise<void> {
    if (state.value.client) {
      console.log('[Ably] Already connected')
      return
    }

    try {
      // Générer un ID unique pour ce participant
      odientId = 'pirate-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)

      const client = new Ably.Realtime({
        key: apiKey,
        clientId: odientId,
      })

      await new Promise<void>((resolve, reject) => {
        client.connection.on('connected', () => {
          console.log('[Ably] Connected as', odientId)
          state.value = { client, isConnected: true }
          isConnected.value = true
          resolve()
        })

        client.connection.on('failed', (err) => {
          console.error('[Ably] Connection failed', err)
          error.value = err as Error
          reject(err)
        })
      })
    } catch (err) {
      console.error('[Ably] Connection error', err)
      error.value = err as Error
      throw err
    }
  }

  /**
   * Envoie un message de join crew avec le nom
   */
  async function joinCrew(name: string): Promise<void> {
    const { client } = state.value
    if (!client || !odientId) {
      throw new Error('Not connected to Ably')
    }

    const channel = client.channels.get(ABLY_CHANNELS.AVATARS)

    const message: AvatarCreatedMessage = {
      type: 'avatar-created',
      odientId,
      name,
      avatar: null,
      timestamp: Date.now(),
    }

    await channel.publish('message', message)
    console.log('[Ably] Joined crew as', name)
  }

  /**
   * Retourne l'ID du participant
   */
  function getOdientId(): string | null {
    return odientId
  }

  /**
   * Déconnexion
   */
  function disconnect() {
    const { client } = state.value
    if (client) {
      client.close()
      state.value = { client: null, isConnected: false }
      isConnected.value = false
      odientId = null
      console.log('[Ably] Disconnected')
    }
  }

  return {
    isConnected,
    error,
    connect,
    joinCrew,
    getOdientId,
    disconnect,
  }
}
