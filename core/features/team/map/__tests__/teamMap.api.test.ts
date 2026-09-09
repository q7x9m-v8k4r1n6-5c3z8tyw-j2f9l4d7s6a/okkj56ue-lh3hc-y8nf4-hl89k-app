import { describe, expect, it, vi, afterEach } from 'vitest'
import { client } from '@/core/shared/api'
import { getTeamMapDetail } from '../api/teamMap.api'

describe('teamMap.api', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('throws an error when raceId is empty or whitespace', async () => {
    await expect(getTeamMapDetail('')).rejects.toThrow('Mã trận đấu không hợp lệ.')
    await expect(getTeamMapDetail('   ')).rejects.toThrow('Mã trận đấu không hợp lệ.')
  })

  it('calls client.request with GET /Race/{raceId} properly encoded', async () => {
    const mockResponse = {
      id: 'race-123',
      name: 'Giải chạy Mùa Thu',
      mapImageUrl: 'https://example.com/autumn-map.png',
      booth: [
        {
          id: 'b-1',
          name: 'Trạm 1',
          place: 'Vườn hoa',
          description: 'Thử thách 1',
          isHidden: false,
          status: 'free',
          mapX: 12.5,
          mapY: 34.2,
        },
      ],
    }

    const requestSpy = vi
      .spyOn(client, 'request')
      .mockResolvedValueOnce(mockResponse)

    const controller = new AbortController()
    const result = await getTeamMapDetail('race 123/special', controller.signal)

    expect(requestSpy).toHaveBeenCalledWith({
      path: '/Race/race%20123%2Fspecial',
      signal: controller.signal,
    })

    expect(result.mapImageUrl).toBe('https://example.com/autumn-map.png')
    expect(result.booth).toHaveLength(1)
    expect(result.booth[0].name).toBe('Trạm 1')
  })
})
