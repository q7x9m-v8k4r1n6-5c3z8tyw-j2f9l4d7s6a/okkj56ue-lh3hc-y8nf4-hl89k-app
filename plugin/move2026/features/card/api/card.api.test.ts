import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }))

vi.mock('@/core/shared/api', () => ({
  client: { request: requestMock },
}))

import { confirmRevive, getPendingRevive } from './card.api'

const raceId = '5f9a064a-29c2-4faa-917b-da2d7a443246'
const boothId = '22d749f7-da08-404f-8113-529a32a88374'
const effectId = '68c0370123456789abcdef01'

describe('Revive card API', () => {
  beforeEach(() => requestMock.mockReset())

  it('loads the pending Revive for the organizer booth', async () => {
    const pending = {
      effectId,
      cardUseId: 'c37e7f80-ddbf-41fd-9217-96c4d12e0921',
      teamId: '1b6d04ef-6281-4032-b1ae-969816213641',
      boothId,
      requestedAt: '2026-09-08T10:00:00Z',
    }
    requestMock.mockResolvedValue(pending)

    await expect(getPendingRevive(raceId, boothId)).resolves.toEqual(pending)
    expect(requestMock).toHaveBeenCalledWith({
      path: `/plugin/cards/races/${raceId}/booths/${boothId}/revive-effect/pending`,
      signal: undefined,
    })
  })

  it('confirms Revive without exposing a reject operation', async () => {
    requestMock.mockResolvedValue(true)

    await expect(confirmRevive(raceId, effectId)).resolves.toBeUndefined()
    expect(requestMock).toHaveBeenCalledWith({
      path: `/plugin/cards/races/${raceId}/revive-effects/${effectId}/confirm`,
      method: 'POST',
    })
  })
})
