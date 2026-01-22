import Ably from 'ably'
import { ref, shallowRef } from 'vue'
import { ABLY_CHANNELS } from '../../../shared/constants'
import type {
  IncomingMessage,
  OutgoingMessage,
  AvatarCreatedMessage,
  VoteCastMessage,
  HeartbeatResponseMessage,
} from '../../../shared/types'

type MessageCallback<T> = (message: T) => void

interface AblyState {
  client: Ably.Realtime | null
  isConnected: boolean
  channels: Map<string, Ably.RealtimeChannel>
}

// Singleton state to share the connection
const state = shallowRef<AblyState>({
  client: null,
  isConnected: false,
  channels: new Map(),
})

// Callbacks by message type
const callbacks = {
  'avatar-created': [] as MessageCallback<AvatarCreatedMessage>[],
  'vote-cast': [] as MessageCallback<VoteCastMessage>[],
  'heartbeat-response': [] as MessageCallback<HeartbeatResponseMessage>[],
}

export function useAbly() {
  const isConnected = ref(state.value.isConnected)
  const error = ref<Error | null>(null)

  /**
   * Connect to Ably server
   */
  async function connect(apiKey: string): Promise<void> {
    if (state.value.client) {
      console.log('[Ably] Already connected')
      return
    }

    try {
      const client = new Ably.Realtime({
        key: apiKey,
        clientId: 'presentation-' + Date.now(),
      })

      // Wait for connection
      await new Promise<void>((resolve, reject) => {
        client.connection.on('connected', () => {
          console.log('[Ably] Connected successfully')
          state.value = { ...state.value, client, isConnected: true }
          isConnected.value = true
          resolve()
        })

        client.connection.on('failed', (err) => {
          console.error('[Ably] Connection failed', err)
          error.value = err as Error
          reject(err)
        })
      })

      // Setup listeners on incoming channels
      setupIncomingChannels()
    } catch (err) {
      console.error('[Ably] Connection error', err)
      error.value = err as Error
      throw err
    }
  }

  /**
   * Configure listeners on incoming channels
   */
  function setupIncomingChannels() {
    const { client } = state.value
    if (!client) return

    // Channel AVATARS
    const avatarsChannel = client.channels.get(ABLY_CHANNELS.AVATARS)
    avatarsChannel.subscribe((message) => {
      const data = message.data as AvatarCreatedMessage
      console.log('[Ably] Avatar created:', data)
      callbacks['avatar-created'].forEach((cb) => cb(data))
    })
    state.value.channels.set(ABLY_CHANNELS.AVATARS, avatarsChannel)

    // Channel VOTES
    const votesChannel = client.channels.get(ABLY_CHANNELS.VOTES)
    votesChannel.subscribe((message) => {
      const data = message.data as VoteCastMessage
      console.log('[Ably] Vote cast:', data)
      callbacks['vote-cast'].forEach((cb) => cb(data))
    })
    state.value.channels.set(ABLY_CHANNELS.VOTES, votesChannel)

    // Channel HEARTBEAT
    const heartbeatChannel = client.channels.get(ABLY_CHANNELS.HEARTBEAT)
    heartbeatChannel.subscribe((message) => {
      const data = message.data as HeartbeatResponseMessage
      if (data.type === 'heartbeat-response') {
        callbacks['heartbeat-response'].forEach((cb) => cb(data))
      }
    })
    state.value.channels.set(ABLY_CHANNELS.HEARTBEAT, heartbeatChannel)

    console.log('[Ably] Subscribed to incoming channels')
  }

  /**
   * Publish a message to a channel
   */
  async function publish(channel: string, data: OutgoingMessage): Promise<void> {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot publish - not connected')
      return
    }

    let ch = state.value.channels.get(channel)
    if (!ch) {
      ch = client.channels.get(channel)
      state.value.channels.set(channel, ch)
    }

    await ch.publish('message', data)
    console.log(`[Ably] Published to ${channel}:`, data.type)
  }

  /**
   * Subscribe to a message type
   */
  function onAvatarCreated(callback: MessageCallback<AvatarCreatedMessage>): () => void {
    callbacks['avatar-created'].push(callback)
    return () => {
      const idx = callbacks['avatar-created'].indexOf(callback)
      if (idx > -1) callbacks['avatar-created'].splice(idx, 1)
    }
  }

  function onVoteCast(callback: MessageCallback<VoteCastMessage>): () => void {
    callbacks['vote-cast'].push(callback)
    return () => {
      const idx = callbacks['vote-cast'].indexOf(callback)
      if (idx > -1) callbacks['vote-cast'].splice(idx, 1)
    }
  }

  function onHeartbeatResponse(callback: MessageCallback<HeartbeatResponseMessage>): () => void {
    callbacks['heartbeat-response'].push(callback)
    return () => {
      const idx = callbacks['heartbeat-response'].indexOf(callback)
      if (idx > -1) callbacks['heartbeat-response'].splice(idx, 1)
    }
  }

  /**
   * Disconnect from Ably
   */
  function disconnect() {
    const { client } = state.value
    if (client) {
      client.close()
      state.value = {
        client: null,
        isConnected: false,
        channels: new Map(),
      }
      isConnected.value = false
      console.log('[Ably] Disconnected')
    }
  }

  return {
    // State
    isConnected,
    error,

    // Actions
    connect,
    publish,
    disconnect,

    // Subscriptions
    onAvatarCreated,
    onVoteCast,
    onHeartbeatResponse,

    // Channels constants (for convenience)
    CHANNELS: ABLY_CHANNELS,
  }
}
