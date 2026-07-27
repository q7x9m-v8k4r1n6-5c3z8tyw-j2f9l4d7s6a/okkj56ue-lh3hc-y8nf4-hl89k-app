import { describe, expect, it } from 'vitest'
import {
  formatDateTime,
  formatGmt7DateTime,
  toGmt7ApiDateTime,
} from './dateTime'

describe('GMT+7 date-time utilities', () => {
  it('keeps backend local date-time values unchanged when formatting', () => {
    expect(formatDateTime('2026-07-27T09:05:04')).toBe(
      '27/7/2026 09:05:04',
    )
  })

  it('converts UTC instants to GMT+7 for display', () => {
    expect(formatGmt7DateTime('2026-07-27T02:05:04Z')).toBe(
      '27/7/2026 09:05:04',
    )
  })

  it('serializes a Date as a GMT+7 backend date-time', () => {
    expect(toGmt7ApiDateTime(new Date('2026-07-27T02:05:04Z'))).toBe(
      '2026-07-27T09:05:04',
    )
  })
})
