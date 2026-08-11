import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}))

vi.mock('@/core/shared/api', () => ({
  client: { request: requestMock },
}))

import { getTeamBoothSession } from './getTeamBoothSession.api'

const raceId = '22d749f7-da08-404f-8113-529a32a88374'

describe('getTeamBoothSession', () => {
  beforeEach(() => requestMock.mockReset())

  it('loads the current pending session from the authenticated team endpoint', async () => {
    const session = {
      raceId,
      boothId: 'ee0fd25b-e9b5-42ba-9e25-187fe5c471ea',
      boothName: 'Booth 1',
      place: 'BK',
      description: '',
      isHidden: false,
      status: 'pending',
    }
    requestMock.mockResolvedValue(session)

    await expect(getTeamBoothSession(raceId)).resolves.toEqual(session)
    expect(requestMock).toHaveBeenCalledWith({
      path: '/Team/my-session',
      method: 'GET',
      query: { raceId },
      signal: undefined,
    })
  })

  it('returns null when the team has no active session', async () => {
    requestMock.mockResolvedValue(null)

    await expect(getTeamBoothSession(raceId)).resolves.toBeNull()
  })

  it('rejects a non-active booth status', async () => {
    requestMock.mockResolvedValue({
      raceId,
      boothId: 'ee0fd25b-e9b5-42ba-9e25-187fe5c471ea',
      boothName: 'Booth 1',
      place: 'BK',
      description: '',
      isHidden: false,
      status: 'free',
    })

    await expect(getTeamBoothSession(raceId)).rejects.toThrow()
  })
})
