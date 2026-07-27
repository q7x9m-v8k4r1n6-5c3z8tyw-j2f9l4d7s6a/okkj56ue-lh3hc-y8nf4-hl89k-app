import { describe, expect, it } from 'vitest'
import { organizerSummarySchema } from './organizer'

describe('organizer entity schema', () => {
  it('accepts a canonical organizer summary', () => {
    const organizer = {
      id: '11111111-1111-4111-8111-111111111111',
      displayName: 'Nguyen Van A',
      email: 'organizer@example.com',
    }

    expect(organizerSummarySchema.parse(organizer)).toEqual(organizer)
  })

  it('rejects an invalid organizer identity', () => {
    expect(() => organizerSummarySchema.parse({
      id: 'invalid',
      email: 'organizer@example.com',
    })).toThrow()
  })
})
