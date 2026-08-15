import { describe, expect, it, vi, beforeEach } from 'vitest'
import { client } from '@/core/shared/api'
import {
  getRaceMapDetail,
  getRaceBoothList,
  uploadAndSaveRaceMap,
  updateBoothCoordinates,
} from './buildMap.api'

vi.mock('@/core/shared/api', () => ({
  client: {
    request: vi.fn(),
  },
}))

describe('buildMap.api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getRaceMapDetail', () => {
    it('fetches and parses race detail with booths and mapImageUrl', async () => {
      const mockResponse = {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Trận đấu 1',
        mapImageUrl: 'https://azure.blob/race-map/map1.png',
        modifiedAt: '2026-08-15T00:00:00Z',
        booth: [
          {
            id: '22222222-2222-2222-2222-222222222222',
            name: 'Trạm 1',
            place: 'Khu A',
            status: 'free',
          },
        ],
      }

      vi.mocked(client.request).mockResolvedValueOnce(mockResponse)

      const result = await getRaceMapDetail('11111111-1111-1111-1111-111111111111')

      expect(client.request).toHaveBeenCalledWith({
        path: '/Race/11111111-1111-1111-1111-111111111111',
        signal: undefined,
      })
      expect(result.id).toBe('11111111-1111-1111-1111-111111111111')
      expect(result.mapImageUrl).toBe('https://azure.blob/race-map/map1.png')
      expect(result.booth).toHaveLength(1)
      expect(result.booth[0].name).toBe('Trạm 1')
    })
  })

  describe('getRaceBoothList', () => {
    it('fetches and parses booth list with coordinate metadata', async () => {
      const mockBooths = [
        {
          boothId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          boothName: 'Trạm Khởi Động',
          boothLocation: 'Khu A',
          description: 'Mô tả 1',
          status: 'free',
          isHidden: false,
          currentTeamName: null,
          currentOrganizerName: 'Organizer 1',
          mapX: 25.5,
          mapY: 30.0,
        },
      ]

      vi.mocked(client.request).mockResolvedValueOnce(mockBooths)

      const result = await getRaceBoothList('race-123')

      expect(client.request).toHaveBeenCalledWith({
        path: '/Race/booth-list',
        query: { RaceId: 'race-123' },
        signal: undefined,
      })
      expect(result).toHaveLength(1)
      expect(result[0].boothName).toBe('Trạm Khởi Động')
      expect(result[0].mapX).toBe(25.5)
    })
  })

  describe('uploadAndSaveRaceMap', () => {
    const mockFile = new File(['image-content'], 'map.png', { type: 'image/png' })

    it('uploads via primary POST /Race/{id}/map endpoint', async () => {
      vi.mocked(client.request).mockResolvedValueOnce({
        mapImageUrl: 'https://azure.blob/race-map/uploaded.png',
      })

      const result = await uploadAndSaveRaceMap('race-123', mockFile)

      expect(client.request).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/Race/race-123/map',
          method: 'POST',
        }),
      )
      expect(result.mapImageUrl).toBe('https://azure.blob/race-map/uploaded.png')
    })
  })

  describe('updateBoothCoordinates', () => {
    it('sends PUT request with coordinates payload', async () => {
      const mockPayload = {
        coordinates: [
          { boothId: 'b-1', mapX: 45.0, mapY: 55.0 },
          { boothId: 'b-2', mapX: null, mapY: null },
        ],
      }

      vi.mocked(client.request).mockResolvedValueOnce({
        message: 'Đã cập nhật tọa độ trạm thành công.',
      })

      const result = await updateBoothCoordinates('race-123', mockPayload)

      expect(client.request).toHaveBeenCalledWith({
        path: '/Race/race-123/booths/coordinates',
        method: 'PUT',
        body: mockPayload,
      })
      expect(result.message).toBe('Đã cập nhật tọa độ trạm thành công.')
    })
  })
})
