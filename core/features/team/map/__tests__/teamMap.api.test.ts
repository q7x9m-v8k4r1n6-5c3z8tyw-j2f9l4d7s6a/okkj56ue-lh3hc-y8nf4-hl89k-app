import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getTeamRaceMapDetail, getTeamBoothList } from '../api/teamMap.api'
import { client } from '@/core/shared/api'

vi.mock('@/core/shared/api', () => ({
  client: {
    request: vi.fn(),
  },
}))

describe('teamMap.api Client Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTeamRaceMapDetail', () => {
    it('calls GET /Race/{raceId} and parses response', async () => {
      const mockResponse = {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'Race 1',
        raceName: 'Race 1',
        mapImageUrl: 'https://example.com/map.png',
        status: 'draft',
        modifiedAt: '2026-08-15T07:55:54Z',
      }

      vi.mocked(client.request).mockResolvedValueOnce(mockResponse)

      const result = await getTeamRaceMapDetail('3fa85f64-5717-4562-b3fc-2c963f66afa6')

      expect(client.request).toHaveBeenCalledWith({
        path: '/Race/3fa85f64-5717-4562-b3fc-2c963f66afa6',
        signal: undefined,
      })
      expect(result.id).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      expect(result.mapImageUrl).toBe('https://example.com/map.png')
    })
  })

  describe('getTeamBoothList', () => {
    it('calls GET /Race/booth-list?RaceId={raceId} and parses response', async () => {
      const mockBooths = [
        {
          boothId: 'b-1',
          boothName: 'Trạm 1',
          boothLocation: 'A1',
          description: 'Mô tả',
          status: 'free',
          isHidden: false,
          currentTeamName: null,
          currentOrganizerName: null,
          mapX: 20.0,
          mapY: 30.0,
        },
      ]

      vi.mocked(client.request).mockResolvedValueOnce(mockBooths)

      const result = await getTeamBoothList('race-guid-123')

      expect(client.request).toHaveBeenCalledWith({
        path: '/Race/booth-list',
        query: { RaceId: 'race-guid-123' },
        signal: undefined,
      })
      expect(result).toHaveLength(1)
      expect(result[0].boothId).toBe('b-1')
      expect(result[0].mapX).toBe(20.0)
    })
  })
})
