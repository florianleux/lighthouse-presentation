// ===========================================
// Type guards and validators for Ably messages
// ===========================================

import type {
  AvatarCreatedMessage,
  VoteCastMessage,
  PollCastMessage,
  HeartbeatResponseMessage,
  SessionStateMessage,
  VoteStartedMessage,
  PollStartedMessage,
  PollChoice,
} from './types'

// Helper to check if value is a non-null object
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

// Helper to check string
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// Helper to check number
function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

// ===========================================
// Incoming message validators (vote app -> presentation)
// ===========================================

export function isAvatarCreatedMessage(data: unknown): data is AvatarCreatedMessage {
  if (!isObject(data)) return false
  return (
    data.type === 'avatar-created' &&
    isString(data.keynoteId) &&
    isString(data.odientId) &&
    isString(data.name) &&
    (data.avatar === null || isString(data.avatar)) &&
    isNumber(data.timestamp)
  )
}

export function isVoteCastMessage(data: unknown): data is VoteCastMessage {
  if (!isObject(data)) return false
  return (
    data.type === 'vote-cast' &&
    isString(data.keynoteId) &&
    isString(data.odientId) &&
    isNumber(data.voteIndex) &&
    (data.choice === 'A' || data.choice === 'B') &&
    isNumber(data.timestamp)
  )
}

export function isPollCastMessage(data: unknown): data is PollCastMessage {
  if (!isObject(data)) return false
  const validChoices: PollChoice[] = ['cabin_boy', 'quartermaster', 'captain']
  return (
    data.type === 'poll-cast' &&
    isString(data.keynoteId) &&
    isString(data.odientId) &&
    isString(data.pollId) &&
    validChoices.includes(data.choice as PollChoice) &&
    isNumber(data.timestamp)
  )
}

export function isHeartbeatResponseMessage(data: unknown): data is HeartbeatResponseMessage {
  if (!isObject(data)) return false
  return (
    data.type === 'heartbeat-response' &&
    isString(data.odientId) &&
    isNumber(data.timestamp)
  )
}

// ===========================================
// Outgoing message validators (presentation -> vote app)
// ===========================================

export function isSessionStateMessage(data: unknown): data is SessionStateMessage {
  if (!isObject(data)) return false
  return (
    data.type === 'session-state' &&
    (data.keynoteId === null || isString(data.keynoteId)) &&
    isString(data.sessionId) &&
    isNumber(data.currentSlide) &&
    Array.isArray(data.path) &&
    isNumber(data.timestamp)
  )
}

export function isVoteStartedMessage(data: unknown): data is VoteStartedMessage {
  if (!isObject(data)) return false
  return (
    data.type === 'vote-started' &&
    isNumber(data.voteIndex) &&
    isNumber(data.duration) &&
    isNumber(data.timestamp)
  )
}

export function isPollStartedMessage(data: unknown): data is PollStartedMessage {
  if (!isObject(data)) return false
  return (
    data.type === 'poll-started' &&
    isString(data.pollId) &&
    isNumber(data.duration) &&
    isNumber(data.timestamp)
  )
}

// ===========================================
// Generic validator with error logging
// ===========================================

export function validateMessage<T>(
  data: unknown,
  validator: (data: unknown) => data is T,
  messageType: string
): T | null {
  if (validator(data)) {
    return data
  }
  console.warn(`[Validator] Invalid ${messageType} message:`, data)
  return null
}
