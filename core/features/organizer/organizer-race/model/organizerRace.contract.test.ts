import { describe, expect, it } from 'vitest'
import { organizerRaceDetailResponseSchema } from './organizerRace.contract'

describe('organizerRaceDetailResponseSchema', () => {
  it('keeps every booth assignment returned by race detail', () => {
    const organizerId = 'df735aa9-2b3d-46b9-8597-684596d1300a'
    const result = organizerRaceDetailResponseSchema.parse({
      id: '84a5a0d9-1121-46ea-98cf-a67e5429dabd',
      raceName: 'sad',
      status: 'ongoing',
      booth: [
        {
          id: 'ee0fd25b-e9b5-42ba-9e25-187fe5c471ea',
          organizerID: organizerId,
        },
        {
          id: '30b96f23-8094-408a-90a9-251fe661f638',
          organizerID: organizerId,
        },
      ],
    })

    expect(result.booths).toEqual([
      {
        id: 'ee0fd25b-e9b5-42ba-9e25-187fe5c471ea',
        organizerId,
      },
      {
        id: '30b96f23-8094-408a-90a9-251fe661f638',
        organizerId,
      },
    ])
  })

  it('supports older responses that do not include booths', () => {
    const result = organizerRaceDetailResponseSchema.parse({
      id: '84a5a0d9-1121-46ea-98cf-a67e5429dabd',
      raceName: 'sad',
      status: 'ongoing',
    })

    expect(result.booths).toEqual([])
  })
})
