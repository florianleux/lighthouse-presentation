import Ably from 'ably'
import { ref, shallowRef } from 'vue'
import { ABLY_CHANNELS } from '../../../../shared/constants'
import type { AvatarCreatedMessage, SessionStateMessage } from '../../../../shared/types'

interface AblyState {
  client: Ably.Realtime | null
  isConnected: boolean
}

const state = shallowRef<AblyState>({
  client: null,
  isConnected: false,
})

// Unique ID for this participant
let odientId: string | null = null

export function useAbly() {
  const isConnected = ref(state.value.isConnected)
  const error = ref<Error | null>(null)

  /**
   * Connect to Ably server
   * @param apiKey - Ably API key
   * @param savedOdientId - Optional saved ID to restore session
   */
  async function connect(apiKey: string, savedOdientId?: string): Promise<void> {
    if (state.value.client) {
      console.log('[Ably] Already connected')
      return
    }

    try {
      // Use saved ID or generate a new one
      odientId = savedOdientId || 'pirate-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)

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
   * Send a join crew message with the name
   */
  async function joinCrew(name: string, keynoteId: string): Promise<void> {
    const { client } = state.value
    if (!client || !odientId) {
      throw new Error('Not connected to Ably')
    }

    const channel = client.channels.get(ABLY_CHANNELS.AVATARS)

    const message: AvatarCreatedMessage = {
      type: 'avatar-created',
      keynoteId,
      odientId,
      name,
      avatar: null,
      timestamp: Date.now(),
    }

    await channel.publish('message', message)
    console.log('[Ably] Joined crew as', name, 'for keynote', keynoteId)
  }

  /**
   * Returns the participant's ID
   */
  function getOdientId(): string | null {
    return odientId
  }

  /**
   * Restore session with a saved odientId (called after connect with savedOdientId)
   */
  function restoreSession(savedOdientId: string) {
    odientId = savedOdientId
    console.log('[Ably] Session restored for', savedOdientId)
  }

  /**
   * Subscribe to session state messages from the presentation
   */
  function onSessionState(callback: (msg: SessionStateMessage) => void): void {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot subscribe to session state - not connected')
      return
    }

    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    channel.subscribe('message', (message) => {
      const data = message.data as SessionStateMessage
      if (data.type === 'session-state') {
        callback(data)
      }
    })

    console.log('[Ably] Subscribed to session state')
  }

  /**
   * Disconnect
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
    restoreSession,
    onSessionState,
    disconnect,
  }
}
