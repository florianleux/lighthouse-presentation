import Ably from 'ably'
import { ref, shallowRef } from 'vue'
import { ABLY_CHANNELS } from '../../../shared/constants'
import type { SessionStateMessage, JoinCrewAction, VoteCastAction, PollCastAction } from '../../../shared/types'
import { isJoinCrewAction, isVoteCastAction, isPollCastAction } from '../../../shared/validators'

const CONNECTION_TIMEOUT = 15000

type MessageCallback<T> = (message: T) => void

interface AblyState {
  client: Ably.Realtime | null
  isConnected: boolean
}

const state = shallowRef<AblyState>({ client: null, isConnected: false })

// Callbacks by action type
const actionCallbacks = {
  'join-crew': [] as MessageCallback<JoinCrewAction>[],
  'vote-cast': [] as MessageCallback<VoteCastAction>[],
  'poll-cast': [] as MessageCallback<PollCastAction>[],
}

const presenceCallbacks = {
  enter: [] as MessageCallback<string>[],
  leave: [] as MessageCallback<string>[],
}

export function useAbly() {
  const isConnected = ref(state.value.isConnected)
  const error = ref<Error | null>(null)

  async function connect(apiKey: string): Promise<void> {
    if (state.value.client) return

    const client = new Ably.Realtime({
      key: apiKey,
      clientId: 'presentation-' + crypto.randomUUID(),
    })

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

    // Track ongoing connection state
    client.connection.on((stateChange) => {
      const connected = stateChange.current === 'connected'
      isConnected.value = connected
      state.value = { ...state.value, isConnected: connected }
    })

    // Subscribe to ACTIONS channel (all incoming actions from vote apps)
    const actionsChannel = client.channels.get(ABLY_CHANNELS.ACTIONS)
    actionsChannel.subscribe((message) => {
      const data = message.data
      if (isJoinCrewAction(data)) {
        actionCallbacks['join-crew'].forEach((cb) => {
          try { cb(data) } catch (err) { console.error('[Ably] Error in join-crew callback:', err) }
        })
      } else if (isVoteCastAction(data)) {
        actionCallbacks['vote-cast'].forEach((cb) => {
          try { cb(data) } catch (err) { console.error('[Ably] Error in vote-cast callback:', err) }
        })
      } else if (isPollCastAction(data)) {
        actionCallbacks['poll-cast'].forEach((cb) => {
          try { cb(data) } catch (err) { console.error('[Ably] Error in poll-cast callback:', err) }
        })
      }
    })

    // Presence on SESSION channel (vote apps enter presence here)
    const sessionChannel = client.channels.get(ABLY_CHANNELS.SESSION)
    sessionChannel.presence.subscribe('enter', (member) => {
      presenceCallbacks.enter.forEach((cb) => {
        try { cb(member.clientId) } catch (err) { console.error('[Ably] Error in presence-enter:', err) }
      })
    })
    sessionChannel.presence.subscribe('leave', (member) => {
      presenceCallbacks.leave.forEach((cb) => {
        try { cb(member.clientId) } catch (err) { console.error('[Ably] Error in presence-leave:', err) }
      })
    })

    console.log('[Ably] Connected and subscribed to channels')
  }

  /**
   * Publish session state to the SESSION channel.
   */
  async function publish(data: SessionStateMessage): Promise<void> {
    const { client } = state.value
    if (!client) return
    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    await channel.publish('message', data)
  }

  // Action subscriptions
  function onJoinCrew(callback: MessageCallback<JoinCrewAction>): () => void {
    actionCallbacks['join-crew'].push(callback)
    return () => {
      const idx = actionCallbacks['join-crew'].indexOf(callback)
      if (idx > -1) actionCallbacks['join-crew'].splice(idx, 1)
    }
  }

  function onVoteCast(callback: MessageCallback<VoteCastAction>): () => void {
    actionCallbacks['vote-cast'].push(callback)
    return () => {
      const idx = actionCallbacks['vote-cast'].indexOf(callback)
      if (idx > -1) actionCallbacks['vote-cast'].splice(idx, 1)
    }
  }

  function onPollCast(callback: MessageCallback<PollCastAction>): () => void {
    actionCallbacks['poll-cast'].push(callback)
    return () => {
      const idx = actionCallbacks['poll-cast'].indexOf(callback)
      if (idx > -1) actionCallbacks['poll-cast'].splice(idx, 1)
    }
  }

  // Presence subscriptions
  function onPresenceEnter(callback: MessageCallback<string>): () => void {
    presenceCallbacks.enter.push(callback)
    return () => {
      const idx = presenceCallbacks.enter.indexOf(callback)
      if (idx > -1) presenceCallbacks.enter.splice(idx, 1)
    }
  }

  function onPresenceLeave(callback: MessageCallback<string>): () => void {
    presenceCallbacks.leave.push(callback)
    return () => {
      const idx = presenceCallbacks.leave.indexOf(callback)
      if (idx > -1) presenceCallbacks.leave.splice(idx, 1)
    }
  }

  async function getPresenceMembers(): Promise<string[]> {
    const { client } = state.value
    if (!client) return []
    const channel = client.channels.get(ABLY_CHANNELS.SESSION)
    const members = await channel.presence.get()
    return members.map((m) => m.clientId)
  }

  function disconnect() {
    const { client } = state.value
    if (client) {
      client.close()
      state.value = { client: null, isConnected: false }
      isConnected.value = false
    }
  }

  return {
    isConnected,
    error,
    connect,
    publish,
    disconnect,
    onJoinCrew,
    onVoteCast,
    onPollCast,
    onPresenceEnter,
    onPresenceLeave,
    getPresenceMembers,
  }
}
