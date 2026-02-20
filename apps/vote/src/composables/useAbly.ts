import Ably from 'ably'
import { ref, shallowRef } from 'vue'
import { ABLY_CHANNELS } from '../../../../shared/constants'
import type {
  AvatarCreatedMessage,
  SessionStateMessage,
  VoteCastMessage,
  VoteStartedMessage,
  VoteEndedMessage,
  PollStartedMessage,
  PollEndedMessage,
  PollCastMessage,
  PollChoice,
} from '../../../../shared/types'
import {
  isSessionStateMessage,
  isVoteStartedMessage,
  isVoteEndedMessage,
  isPollStartedMessage,
  isPollEndedMessage,
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
      // Re-enter presence on reconnect
      const presenceChannel = client.channels.get(ABLY_CHANNELS.PRESENCE)
      presenceChannel.presence.enter().catch((err) => {
        console.warn('[Ably] Failed to re-enter presence on reconnect:', err)
      })
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
let participantId: string | null = null

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
   * @param savedParticipantId - Optional saved ID to restore session
   */
  async function connect(apiKey: string, savedParticipantId?: string): Promise<void> {
    if (state.value.client) {
      console.log('[Ably] Already connected')
      return
    }

    try {
      // Use saved ID or generate a new one (cryptographically secure)
      participantId = savedParticipantId || 'pirate-' + crypto.randomUUID()

      const client = new Ably.Realtime({
        key: apiKey,
        clientId: participantId,
      })

      // Connection with timeout
      const connectionPromise = new Promise<void>((resolve, reject) => {
        // Initial connection handler
        const onInitialConnect = () => {
          console.log('[Ably] Connected as', participantId)
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
    if (!client || !participantId) {
      throw new Error('Not connected to Ably')
    }

    const channel = client.channels.get(ABLY_CHANNELS.AVATARS)

    const message: AvatarCreatedMessage = {
      type: 'avatar-created',
      keynoteId,
      participantId,
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
  function getParticipantId(): string | null {
    return participantId
  }

  /**
   * Restore session with a saved participantId (called after connect with savedParticipantId)
   */
  function restoreSession(savedParticipantId: string) {
    participantId = savedParticipantId
    console.log('[Ably] Session restored for', savedParticipantId)
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
   * Subscribe to vote-ended messages from the presentation
   * Returns an unsubscribe function
   */
  function onVoteEnded(callback: (msg: VoteEndedMessage) => void): () => void {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot subscribe to vote-ended - not connected')
      return () => {}
    }

    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    const handler = (message: Ably.Message) => {
      if (isVoteEndedMessage(message.data)) {
        try {
          callback(message.data)
        } catch (err) {
          console.error('[Ably] Error in vote-ended callback:', err)
        }
      }
    }
    channel.subscribe('message', handler)

    console.log('[Ably] Subscribed to vote-ended messages')
    return () => { channel.unsubscribe('message', handler) }
  }

  /**
   * Subscribe to poll-ended messages from the presentation
   * Returns an unsubscribe function
   */
  function onPollEnded(callback: (msg: PollEndedMessage) => void): () => void {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot subscribe to poll-ended - not connected')
      return () => {}
    }

    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    const handler = (message: Ably.Message) => {
      if (isPollEndedMessage(message.data)) {
        try {
          callback(message.data)
        } catch (err) {
          console.error('[Ably] Error in poll-ended callback:', err)
        }
      }
    }
    channel.subscribe('message', handler)

    console.log('[Ably] Subscribed to poll-ended messages')
    return () => { channel.unsubscribe('message', handler) }
  }

  /**
   * Send a vote to the presentation
   */
  async function sendVote(voteIndex: number, choice: 'A' | 'B', keynoteId: string): Promise<void> {
    const { client } = state.value
    if (!client || !participantId) {
      throw new Error('Not connected to Ably')
    }

    const channel = client.channels.get(ABLY_CHANNELS.VOTES)

    const message: VoteCastMessage = {
      type: 'vote-cast',
      keynoteId,
      participantId,
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
    if (!client || !participantId) {
      throw new Error('Not connected to Ably')
    }

    const channel = client.channels.get(ABLY_CHANNELS.VOTES)

    const message: PollCastMessage = {
      type: 'poll-cast',
      keynoteId,
      participantId,
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
   * Enter presence on the presence channel to signal this voter is active.
   * Ably automatically handles leave on disconnect.
   */
  async function enterPresence(): Promise<void> {
    const { client } = state.value
    if (!client || !participantId) {
      console.warn('[Ably] Cannot enter presence - not connected or no participantId')
      return
    }

    const channel = client.channels.get(ABLY_CHANNELS.PRESENCE)
    await channel.presence.enter()
    console.log('[Ably] Entered presence')
  }

  /**
   * Fetch recent message history from the session channel
   * Used after reconnection to catch up on missed messages
   */
  async function fetchSessionHistory(): Promise<{
    sessionState: SessionStateMessage | null
    voteStarted: VoteStartedMessage | null
    voteEnded: VoteEndedMessage | null
    pollStarted: PollStartedMessage | null
    pollEnded: PollEndedMessage | null
  }> {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot fetch history - not connected')
      return { sessionState: null, voteStarted: null, voteEnded: null, pollStarted: null, pollEnded: null }
    }

    try {
      const channel = client.channels.get(ABLY_CHANNELS.SESSION)
      const history = await channel.history({ limit: 10, direction: 'backwards' })

      let sessionState: SessionStateMessage | null = null
      let voteStarted: VoteStartedMessage | null = null
      let voteEnded: VoteEndedMessage | null = null
      let pollStarted: PollStartedMessage | null = null
      let pollEnded: PollEndedMessage | null = null

      // Find the most recent of each message type
      for (const msg of history.items) {
        if (!sessionState && isSessionStateMessage(msg.data)) sessionState = msg.data
        if (!voteStarted && isVoteStartedMessage(msg.data)) voteStarted = msg.data
        if (!voteEnded && isVoteEndedMessage(msg.data)) voteEnded = msg.data
        if (!pollStarted && isPollStartedMessage(msg.data)) pollStarted = msg.data
        if (!pollEnded && isPollEndedMessage(msg.data)) pollEnded = msg.data
        if (sessionState && voteStarted && voteEnded && pollStarted && pollEnded) break
      }

      console.log('[Ably] Fetched history - sessionState:', !!sessionState, 'voteStarted:', !!voteStarted, 'voteEnded:', !!voteEnded)
      return { sessionState, voteStarted, voteEnded, pollStarted, pollEnded }
    } catch (err) {
      console.error('[Ably] Failed to fetch history:', err)
      return { sessionState: null, voteStarted: null, voteEnded: null, pollStarted: null, pollEnded: null }
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
      participantId = null
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
    getParticipantId,
    restoreSession,
    onSessionState,
    onVoteStarted,
    onVoteEnded,
    onPollStarted,
    onPollEnded,
    sendVote,
    sendPoll,
    setOnReconnect,
    enterPresence,
    fetchSessionHistory,
    disconnect,
  }
}
