import Ably from 'ably'
import { ref, shallowRef } from 'vue'
import { ABLY_CHANNELS } from '../../../../shared/constants'
import type { SessionStateMessage, ActionMessage } from '../../../../shared/types'
import { isSessionStateMessage } from '../../../../shared/validators'

const CONNECTION_TIMEOUT = 15000

interface AblyState {
  client: Ably.Realtime | null
  isConnected: boolean
}

const state = shallowRef<AblyState>({ client: null, isConnected: false })
let participantId: string | null = null

export function useAbly() {
  const isConnected = ref(state.value.isConnected)
  const error = ref<Error | null>(null)

  async function connect(apiKey: string, savedParticipantId?: string): Promise<void> {
    if (state.value.client) return

    participantId = savedParticipantId || 'pirate-' + crypto.randomUUID()
    const client = new Ably.Realtime({ key: apiKey, clientId: participantId })

    // Wait for initial connection
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT)
      client.connection.once('connected', () => { clearTimeout(timeout); resolve() })
      client.connection.once('failed', (stateChange) => {
        clearTimeout(timeout)
        reject(new Error(stateChange?.reason?.message || 'Connection failed'))
      })
    })

    state.value = { client, isConnected: true }
    isConnected.value = true

    // Track ongoing connection state (reconnections, disconnections)
    client.connection.on((stateChange) => {
      const connected = stateChange.current === 'connected'
      isConnected.value = connected
      state.value = { ...state.value, isConnected: connected }
    })

    // Enter presence on session channel (Ably auto-re-enters on reconnect)
    const sessionChannel = client.channels.get(ABLY_CHANNELS.SESSION)
    await sessionChannel.presence.enter().catch((err) => {
      console.warn('[Ably] Failed to enter presence:', err)
    })
  }

  /**
   * Subscribe to session-state messages from the presentation.
   * Returns an unsubscribe function.
   */
  function onSessionState(callback: (msg: SessionStateMessage) => void): () => void {
    const { client } = state.value
    if (!client) return () => {}

    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    const handler = (message: Ably.Message) => {
      if (isSessionStateMessage(message.data)) {
        callback(message.data)
      }
    }
    channel.subscribe('message', handler)
    return () => channel.unsubscribe('message', handler)
  }

  /**
   * Publish an action (join-crew, vote-cast, poll-cast) to the presentation.
   */
  async function publishAction(action: ActionMessage): Promise<void> {
    const { client } = state.value
    if (!client) throw new Error('Not connected to Ably')
    const channel = client.channels.get(ABLY_CHANNELS.ACTIONS)
    await channel.publish('message', action)
  }

  function getParticipantId(): string | null {
    return participantId
  }

  /**
   * Force a reconnection attempt (useful after phone lock/unlock).
   */
  function reconnect(): void {
    const { client } = state.value
    if (client && !isConnected.value) {
      client.connection.connect()
    }
  }

  return { isConnected, error, connect, onSessionState, publishAction, getParticipantId, reconnect }
}
