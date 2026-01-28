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
} from '../../../../shared/types'
import {
  isSessionStateMessage,
  isVoteStartedMessage,
  isPollStartedMessage,
} from '../../../../shared/validators'

// Connection timeout in milliseconds
const CONNECTION_TIMEOUT = 15000

// Helper to convert unknown error to Error
function toError(err: unknown): Error {
  if (err instanceof Error) return err
  return new Error(String(err))
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
        client.connection.on('connected', () => {
          console.log('[Ably] Connected as', odientId)
          state.value = { client, isConnected: true }
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
   */
  function onSessionState(callback: (msg: SessionStateMessage) => void): void {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot subscribe to session state - not connected')
      return
    }

    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    channel.subscribe('message', (message) => {
      if (isSessionStateMessage(message.data)) {
        try {
          callback(message.data)
        } catch (err) {
          console.error('[Ably] Error in session-state callback:', err)
        }
      }
    })

    console.log('[Ably] Subscribed to session state')
  }

  /**
   * Subscribe to vote-started messages from the presentation
   */
  function onVoteStarted(callback: (msg: VoteStartedMessage) => void): void {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot subscribe to vote-started - not connected')
      return
    }

    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    channel.subscribe('message', (message) => {
      if (isVoteStartedMessage(message.data)) {
        try {
          callback(message.data)
        } catch (err) {
          console.error('[Ably] Error in vote-started callback:', err)
        }
      }
    })

    console.log('[Ably] Subscribed to vote-started messages')
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
   */
  function onPollStarted(callback: (msg: PollStartedMessage) => void): void {
    const { client } = state.value
    if (!client) {
      console.warn('[Ably] Cannot subscribe to poll-started - not connected')
      return
    }

    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    channel.subscribe('message', (message) => {
      if (isPollStartedMessage(message.data)) {
        try {
          callback(message.data)
        } catch (err) {
          console.error('[Ably] Error in poll-started callback:', err)
        }
      }
    })

    console.log('[Ably] Subscribed to poll-started messages')
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
    onVoteStarted,
    onPollStarted,
    sendVote,
    sendPoll,
    disconnect,
  }
}
