import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}))

vi.mock('@/core/shared/api', () => ({
  client: { request: requestMock },
}))

import { getMyBooth } from './getMyBooth.api'

describe('getMyBooth', () => {
  beforeEach(() => requestMock.mockReset())

  it('loads the durable occupied session for the assigned booth', async () => {
    const raceId = '22d749f7-da08-404f-8113-529a32a88374'
    const booth = {
      boothId: 'ee0fd25b-e9b5-42ba-9e25-187fe5c471ea',
      name: 'Booth 1',
      place: 'BK',
      description: '',
      status: 'occupied',
      teamId: '1b6d04ef-6281-4032-b1ae-969816213641',
      teamName: 'Team A',
    }
    requestMock.mockResolvedValue(booth)

    await expect(getMyBooth(raceId)).resolves.toEqual(booth)
    expect(requestMock).toHaveBeenCalledWith({
      path: '/Booth/my-booth',
      method: 'GET',
      query: { raceId },
      signal: undefined,
    })
  })

  it('rejects an unsupported booth status', async () => {
    requestMock.mockResolvedValue({
      boothId: 'ee0fd25b-e9b5-42ba-9e25-187fe5c471ea',
      name: 'Booth 1',
      place: 'BK',
      description: '',
      status: 'busy',
      teamId: null,
      teamName: null,
    })

    await expect(getMyBooth(
      '22d749f7-da08-404f-8113-529a32a88374',
    )).rejects.toThrow()
  })
})
