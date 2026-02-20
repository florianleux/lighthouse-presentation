import Ably from 'ably'
import { ref, shallowRef } from 'vue'
import { ABLY_CHANNELS } from '../../../../shared/constants'
import type {
  AvatarCreatedMessage,
  SessionStateMessage,
  VoteCastMessage,
  VoteStartedMessage,
  PollStartedMessage,
  PollCastMessage,
  PollChoice,
  HeartbeatResponseMessage,
  HeartbeatRequestMessage,
} from '../../../../shared/types'
import {
  isSessionStateMessage,
  isVoteStartedMessage,
  isPollStartedMessage,
  isHeartbeatRequestMessage,
} from '../../../../shared/validators'

// Connection timeout in milliseconds
const CONNECTION_TIMEOUT = 15000

// Helper to convert unknown error to Error
function toError(err: unknown): Error {
  if (err instanceof Error) return err
  return new Error(String(err))
}

/**
 * Setup listeners for all connection state changes (after initial connect)
 */
function setupConnectionStateListeners(
  client: Ably.Realtime,
  isConnected: ReturnType<typeof ref<boolean>>
): void {
  client.connection.on('disconnected', () => {
    console.log('[Ably] Disconnected')
    state.value = { ...state.value, isConnected: false }
    isConnected.value = false
  })

  client.connection.on('suspended', () => {
    console.log('[Ably] Connection suspended')
    state.value = { ...state.value, isConnected: false }
    isConnected.value = false
  })

  client.connection.on('connecting', () => {
    console.log('[Ably] Reconnecting...')
  })

  client.connection.on('closed', () => {
    console.log('[Ably] Connection closed')
    state.value = { ...state.value, isConnected: false }
    isConnected.value = false
  })

  // Handle reconnections (not initial connect)
  client.connection.on('connected', () => {
    if (hasConnectedOnce) {
      console.log('[Ably] Reconnected')
      state.value = { ...state.value, isConnected: true }
      isConnected.value = true
      // Trigger reconnection callback if set
      if (onReconnectCallback) {
        onReconnectCallback()
      }
    }
  })
}

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

// Callback for reconnection events
let onReconnectCallback: (() => void) | null = null

// Track if initial connection completed (to distinguish reconnects from first connect)
let hasConnectedOnce = false

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
      // Use saved ID or generate a new one (cryptographically secure)
      odientId = savedOdientId || 'pirate-' + crypto.randomUUID()

      const client = new Ably.Realtime({
        key: apiKey,
        clientId: odientId,
      })

      // Connection with timeout
      const connectionPromise = new Promise<void>((resolve, reject) => {
        // Initial connection handler
        const onInitialConnect = () => {
          console.log('[Ably] Connected as', odientId)
          state.value = { client, isConnected: true }
          isConnected.value = true
          hasConnectedOnce = true

          // Remove initial handler to avoid double-firing
          client.connection.off('connected', onInitialConnect)

          // Setup ongoing connection state listeners
          setupConnectionStateListeners(client, isConnected)

          resolve()
        }

        client.connection.on('connected', onInitialConnect)

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
    } catch (err) {
      console.error('[Ably] Connection error', err)
      error.value = toError(err)
      throw toError(err)
    }
  }

  /**
   * Send a join crew message with the name and avatar
   */
  async function joinCrew(name: string, keynoteId: string, avatar: string | null): Promise<void> {
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
      avatar,
      timestamp: Date.now(),
    }

    await channel.publish('message', message)
    console.log('[Ably] Joined crew as', name, 'with avatar', avatar, 'for keynote', keynoteId)
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
   * Returns an unsubscribe function
   */
  function onSessionState(callback: (msg: SessionStateMessage) => void): () => void {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot subscribe to session state - not connected')
      return () => {}
    }

    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    const handler = (message: Ably.Message) => {
      if (isSessionStateMessage(message.data)) {
        try {
          callback(message.data)
        } catch (err) {
          console.error('[Ably] Error in session-state callback:', err)
        }
      }
    }
    channel.subscribe('message', handler)

    console.log('[Ably] Subscribed to session state')
    return () => { channel.unsubscribe('message', handler) }
  }

  /**
   * Subscribe to vote-started messages from the presentation
   * Returns an unsubscribe function
   */
  function onVoteStarted(callback: (msg: VoteStartedMessage) => void): () => void {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot subscribe to vote-started - not connected')
      return () => {}
    }

    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    const handler = (message: Ably.Message) => {
      if (isVoteStartedMessage(message.data)) {
        try {
          callback(message.data)
        } catch (err) {
          console.error('[Ably] Error in vote-started callback:', err)
        }
      }
    }
    channel.subscribe('message', handler)

    console.log('[Ably] Subscribed to vote-started messages')
    return () => { channel.unsubscribe('message', handler) }
  }

  /**
   * Send a vote to the presentation
   */
  async function sendVote(voteIndex: number, choice: 'A' | 'B', keynoteId: string): Promise<void> {
    const { client } = state.value
    if (!client || !odientId) {
      throw new Error('Not connected to Ably')
    }

    const channel = client.channels.get(ABLY_CHANNELS.VOTES)

    const message: VoteCastMessage = {
      type: 'vote-cast',
      keynoteId,
      odientId,
      voteIndex,
      choice,
      timestamp: Date.now(),
    }

    await channel.publish('message', message)
    console.log('[Ably] Vote sent:', choice, 'for vote', voteIndex)
  }

  /**
   * Subscribe to poll-started messages from the presentation
   * Returns an unsubscribe function
   */
  function onPollStarted(callback: (msg: PollStartedMessage) => void): () => void {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot subscribe to poll-started - not connected')
      return () => {}
    }

    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    const handler = (message: Ably.Message) => {
      if (isPollStartedMessage(message.data)) {
        try {
          callback(message.data)
        } catch (err) {
          console.error('[Ably] Error in poll-started callback:', err)
        }
      }
    }
    channel.subscribe('message', handler)

    console.log('[Ably] Subscribed to poll-started messages')
    return () => { channel.unsubscribe('message', handler) }
  }

  /**
   * Send a poll response to the presentation
   */
  async function sendPoll(pollId: string, choice: PollChoice, keynoteId: string): Promise<void> {
    const { client } = state.value
    if (!client || !odientId) {
      throw new Error('Not connected to Ably')
    }

    const channel = client.channels.get(ABLY_CHANNELS.VOTES)

    const message: PollCastMessage = {
      type: 'poll-cast',
      keynoteId,
      odientId,
      pollId,
      choice,
      timestamp: Date.now(),
    }

    await channel.publish('message', message)
    console.log('[Ably] Poll sent:', choice, 'for poll', pollId)
  }

  /**
   * Set a callback to be called when the connection is restored after a disconnect
   */
  function setOnReconnect(callback: () => void): void {
    onReconnectCallback = callback
  }

  /**
   * Setup heartbeat listener to respond to heartbeat requests from the presentation
   */
  function setupHeartbeatListener(): void {
    const { client } = state.value
    if (!client || !odientId) {
      console.warn('[Ably] Cannot setup heartbeat listener - not connected')
      return
    }

    const channel = client.channels.get(ABLY_CHANNELS.HEARTBEAT)
    channel.subscribe('message', async (message) => {
      if (isHeartbeatRequestMessage(message.data)) {
        console.log('[Ably] Received heartbeat request, responding...')
        await sendHeartbeatResponse()
      }
    })

    console.log('[Ably] Heartbeat listener setup')
  }

  /**
   * Send heartbeat response to indicate this participant is still active
   */
  async function sendHeartbeatResponse(): Promise<void> {
    const { client } = state.value
    if (!client || !odientId) {
      console.warn('[Ably] Cannot send heartbeat - not connected or no odientId')
      return
    }

    const channel = client.channels.get(ABLY_CHANNELS.HEARTBEAT)

    const message: HeartbeatResponseMessage = {
      type: 'heartbeat-response',
      odientId,
      timestamp: Date.now(),
    }

    await channel.publish('message', message)
    console.log('[Ably] Heartbeat response sent')
  }

  /**
   * Fetch recent message history from the session channel
   * Used after reconnection to catch up on missed messages
   */
  async function fetchSessionHistory(): Promise<{
    sessionState: SessionStateMessage | null
    voteStarted: VoteStartedMessage | null
  }> {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot fetch history - not connected')
      return { sessionState: null, voteStarted: null }
    }

    try {
      const channel = client.channels.get(ABLY_CHANNELS.SESSION)
      const history = await channel.history({ limit: 10, direction: 'backwards' })

      let sessionState: SessionStateMessage | null = null
      let voteStarted: VoteStartedMessage | null = null

      // Find the most recent session-state and vote-started messages
      for (const msg of history.items) {
        if (!sessionState && isSessionStateMessage(msg.data)) {
          sessionState = msg.data
        }
        if (!voteStarted && isVoteStartedMessage(msg.data)) {
          voteStarted = msg.data
        }
        // Stop once we have both
        if (sessionState && voteStarted) break
      }

      console.log('[Ably] Fetched history - sessionState:', !!sessionState, 'voteStarted:', !!voteStarted)
      return { sessionState, voteStarted }
    } catch (err) {
      console.error('[Ably] Failed to fetch history:', err)
      return { sessionState: null, voteStarted: null }
    }
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
      hasConnectedOnce = false
      onReconnectCallback = null
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
    onVoteStarted,
    onPollStarted,
    sendVote,
    sendPoll,
    setOnReconnect,
    setupHeartbeatListener,
    sendHeartbeatResponse,
    fetchSessionHistory,
    disconnect,
  }
}
