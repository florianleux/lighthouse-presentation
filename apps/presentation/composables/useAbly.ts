import Ably from 'ably'
import { ref, shallowRef } from 'vue'
import { ABLY_CHANNELS } from '../../../shared/constants'
import type {
  IncomingMessage,
  OutgoingMessage,
  AvatarCreatedMessage,
  VoteCastMessage,
  PollCastMessage,
  HeartbeatResponseMessage,
} from '../../../shared/types'
import {
  isAvatarCreatedMessage,
  isVoteCastMessage,
  isPollCastMessage,
  isHeartbeatResponseMessage,
  validateMessage,
} from '../../../shared/validators'

// Connection timeout in milliseconds
const CONNECTION_TIMEOUT = 15000

// Helper to convert unknown error to Error
function toError(err: unknown): Error {
  if (err instanceof Error) return err
  return new Error(String(err))
}

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
  'poll-cast': [] as MessageCallback<PollCastMessage>[],
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
        clientId: 'presentation-' + crypto.randomUUID(),
      })

      // Connection with timeout
      const connectionPromise = new Promise<void>((resolve, reject) => {
        client.connection.on('connected', () => {
          console.log('[Ably] Connected successfully')
          state.value = { ...state.value, client, isConnected: true }
          isConnected.value = true
          resolve()
        })

        client.connection.on('failed', (err) => {
          console.error('[Ably] Connection failed', err)
          error.value = toError(err)
          reject(toError(err))
        })
      })

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Connection timeout after ${CONNECTION_TIMEOUT}ms`))
        }, CONNECTION_TIMEOUT)
      })

      await Promise.race([connectionPromise, timeoutPromise])

      // Setup listeners on incoming channels
      setupIncomingChannels()
    } catch (err) {
      console.error('[Ably] Connection error', err)
      error.value = toError(err)
      throw toError(err)
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
      const data = validateMessage(message.data, isAvatarCreatedMessage, 'avatar-created')
      if (data) {
        console.log('[Ably] Avatar created:', data)
        callbacks['avatar-created'].forEach((cb) => {
          try {
            cb(data)
          } catch (err) {
            console.error('[Ably] Error in avatar-created callback:', err)
          }
        })
      }
    })
    state.value.channels.set(ABLY_CHANNELS.AVATARS, avatarsChannel)

    // Channel VOTES (handles both vote-cast and poll-cast)
    const votesChannel = client.channels.get(ABLY_CHANNELS.VOTES)
    votesChannel.subscribe((message) => {
      const rawData = message.data
      if (isVoteCastMessage(rawData)) {
        console.log('[Ably] Vote cast:', rawData)
        callbacks['vote-cast'].forEach((cb) => {
          try {
            cb(rawData)
          } catch (err) {
            console.error('[Ably] Error in vote-cast callback:', err)
          }
        })
      } else if (isPollCastMessage(rawData)) {
        console.log('[Ably] Poll cast:', rawData)
        callbacks['poll-cast'].forEach((cb) => {
          try {
            cb(rawData)
          } catch (err) {
            console.error('[Ably] Error in poll-cast callback:', err)
          }
        })
      } else {
        console.warn('[Ably] Invalid vote/poll message:', rawData)
      }
    })
    state.value.channels.set(ABLY_CHANNELS.VOTES, votesChannel)

    // Channel HEARTBEAT
    const heartbeatChannel = client.channels.get(ABLY_CHANNELS.HEARTBEAT)
    heartbeatChannel.subscribe((message) => {
      const data = validateMessage(message.data, isHeartbeatResponseMessage, 'heartbeat-response')
      if (data) {
        callbacks['heartbeat-response'].forEach((cb) => {
          try {
            cb(data)
          } catch (err) {
            console.error('[Ably] Error in heartbeat-response callback:', err)
          }
        })
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

  function onPollCast(callback: MessageCallback<PollCastMessage>): () => void {
    callbacks['poll-cast'].push(callback)
    return () => {
      const idx = callbacks['poll-cast'].indexOf(callback)
      if (idx > -1) callbacks['poll-cast'].splice(idx, 1)
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
    onPollCast,
    onHeartbeatResponse,

    // Channels constants (for convenience)
    CHANNELS: ABLY_CHANNELS,
  }
}
