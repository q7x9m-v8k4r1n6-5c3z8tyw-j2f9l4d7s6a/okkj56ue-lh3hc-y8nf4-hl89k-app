import { describe, expect, it } from 'vitest'
import { shouldResetBoothRequest } from './teamBoothSessionRecovery'

describe('shouldResetBoothRequest', () => {
  it('unlocks scanning when a previously active session disappears from DB', () => {
    expect(shouldResetBoothRequest({
      hadActiveSession: true,
      hasSession: false,
      isFetched: true,
      isFetching: false,
    })).toBe(true)
  })

  it('does not unlock while the active session still exists or is refetching', () => {
    expect(shouldResetBoothRequest({
      hadActiveSession: true,
      hasSession: true,
      isFetched: true,
      isFetching: false,
    })).toBe(false)
    expect(shouldResetBoothRequest({
      hadActiveSession: true,
      hasSession: false,
      isFetched: true,
      isFetching: true,
    })).toBe(false)
  })

  it('does not treat the initial empty query as a completed session', () => {
    expect(shouldResetBoothRequest({
      hadActiveSession: false,
      hasSession: false,
      isFetched: true,
      isFetching: false,
    })).toBe(false)
  })
})
