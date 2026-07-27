import { describe, expect, it } from 'vitest'
import {
  raceStatusSchema,
  raceSummarySchema,
} from './race'

const validRace = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Summer race',
  place: 'Ho Chi Minh City',
  status: 'draft',
}

describe('race entity schemas', () => {
  it('accepts a canonical race summary', () => {
    expect(raceSummarySchema.parse(validRace)).toEqual(validRace)
  })

  it('rejects an unsupported lifecycle status', () => {
    expect(() => raceStatusSchema.parse('upcoming')).toThrow()
  })

  it('rejects a race without a valid identity', () => {
    expect(() => raceSummarySchema.parse({
      ...validRace,
      id: 'not-a-uuid',
    })).toThrow()
  })
})
