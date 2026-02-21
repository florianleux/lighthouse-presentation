// ===========================================
// Type guards and validators for Ably messages
// ===========================================

import type {
  SessionStateMessage,
  JoinCrewAction,
  VoteCastAction,
  PollCastAction,
  PollChoice,
} from './types'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

// ===========================================
// Session state validator (presentation → vote app)
// ===========================================

const VALID_PHASES = ['lobby', 'idle', 'voting', 'vote-results', 'polling', 'poll-results']

export function isSessionStateMessage(data: unknown): data is SessionStateMessage {
  if (!isObject(data)) return false
  return (
    data.type === 'session-state' &&
    isString(data.keynoteId) &&
    VALID_PHASES.includes(data.phase as string) &&
    isNumber(data.timestamp)
  )
}

// ===========================================
// Action validators (vote app → presentation)
// ===========================================

export function isJoinCrewAction(data: unknown): data is JoinCrewAction {
  if (!isObject(data)) return false
  return (
    data.type === 'join-crew' &&
    isString(data.participantId) &&
    isString(data.name) &&
    isString(data.avatar) &&
    isString(data.keynoteId) &&
    isNumber(data.timestamp)
  )
}

export function isVoteCastAction(data: unknown): data is VoteCastAction {
  if (!isObject(data)) return false
  return (
    data.type === 'vote-cast' &&
    isString(data.participantId) &&
    isNumber(data.voteIndex) &&
    (data.choice === 'A' || data.choice === 'B') &&
    isString(data.keynoteId) &&
    isNumber(data.timestamp)
  )
}

export function isPollCastAction(data: unknown): data is PollCastAction {
  if (!isObject(data)) return false
  const validChoices: PollChoice[] = ['cabin_boy', 'quartermaster', 'captain']
  return (
    data.type === 'poll-cast' &&
    isString(data.participantId) &&
    isString(data.pollId) &&
    validChoices.includes(data.choice as PollChoice) &&
    isString(data.keynoteId) &&
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
