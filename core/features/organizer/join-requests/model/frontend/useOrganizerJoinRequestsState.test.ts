import { describe, expect, it } from 'vitest'
import type { MyBoothData } from '../myBooth.contract'
import { mapMyBoothToOrganizerSession } from './useOrganizerJoinRequestsState'

const booth = (status: MyBoothData['status']): MyBoothData => ({
  boothId: 'ee0fd25b-e9b5-42ba-9e25-187fe5c471ea',
  name: 'Booth 1',
  place: 'BK',
  description: '',
  status,
  teamId: status === 'free'
    ? null
    : '1b6d04ef-6281-4032-b1ae-969816213641',
  teamName: status === 'free' ? null : 'Team A',
})

describe('mapMyBoothToOrganizerSession', () => {
  it('restores a pending request after reload', () => {
    const result = mapMyBoothToOrganizerSession(booth('pending'))

    expect(result.request?.teamName).toBe('Team A')
    expect(result.acceptedRequest).toBeNull()
  })

  it('restores the scoring screen for an occupied booth', () => {
    const result = mapMyBoothToOrganizerSession(booth('occupied'))

    expect(result.request).toBeNull()
    expect(result.acceptedRequest?.id).toBe(
      '1b6d04ef-6281-4032-b1ae-969816213641',
    )
  })

  it('clears both views for a free booth', () => {
    expect(mapMyBoothToOrganizerSession(booth('free'))).toEqual({
      request: null,
      acceptedRequest: null,
    })
  })
})
