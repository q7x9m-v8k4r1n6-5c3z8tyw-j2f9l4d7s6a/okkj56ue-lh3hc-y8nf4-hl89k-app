import { describe, expect, it } from 'vitest'
import {
  raceBoothItemSchema,
  raceBoothListResponseSchema,
  boothCoordinateItemSchema,
  updateBoothCoordinatesPayloadSchema,
  updateBoothCoordinatesResponseSchema,
  raceMapBoothSchema,
  raceMapDetailResponseSchema,
  saveRaceMapResponseSchema,
} from './buildMap.contract'

describe('buildMap.contract zod schemas', () => {
  describe('raceBoothItemSchema & raceBoothListResponseSchema', () => {
    it('validates a complete booth item from GET /api/v1/Race/booth-list', () => {
      const parsed = raceBoothItemSchema.parse({
        boothId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        boothName: 'Trạm Khởi Động',
        boothLocation: 'Khu A',
        description: 'Thử thách nhập môn',
        status: 'free',
        isHidden: false,
        currentTeamName: null,
        currentOrganizerName: 'Admin User',
        mapX: 45.5,
        mapY: 60.2,
      })

      expect(parsed.boothId).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      expect(parsed.boothName).toBe('Trạm Khởi Động')
      expect(parsed.mapX).toBe(45.5)
      expect(parsed.mapY).toBe(60.2)
    })

    it('defaults optional fields for minimal booth item', () => {
      const parsed = raceBoothItemSchema.parse({
        boothId: 'booth-123',
        boothName: 'Trạm 1',
      })

      expect(parsed.boothLocation).toBe('')
      expect(parsed.description).toBe('')
      expect(parsed.status).toBe('free')
      expect(parsed.isHidden).toBe(false)
      expect(parsed.mapX).toBeUndefined()
      expect(parsed.mapY).toBeUndefined()
    })

    it('validates an array of booths via raceBoothListResponseSchema', () => {
      const list = [
        { boothId: 'b-1', boothName: 'Trạm 1', mapX: null, mapY: null },
        { boothId: 'b-2', boothName: 'Trạm 2', mapX: 20.0, mapY: 30.0 },
      ]

      const parsed = raceBoothListResponseSchema.parse(list)
      expect(parsed).toHaveLength(2)
      expect(parsed[0].mapX).toBeNull()
      expect(parsed[1].mapX).toBe(20.0)
    })

    it('rejects booth with empty name', () => {
      expect(() =>
        raceBoothItemSchema.parse({
          boothId: 'b-invalid',
          boothName: '',
        }),
      ).toThrow()
    })
  })

  describe('boothCoordinateItemSchema & updateBoothCoordinatesPayloadSchema', () => {
    it('validates single booth coordinate item with [0, 100] percentage bounds', () => {
      const parsed = boothCoordinateItemSchema.parse({
        boothId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        mapX: 75.5,
        mapY: 25.0,
      })

      expect(parsed.mapX).toBe(75.5)
      expect(parsed.mapY).toBe(25.0)
    })

    it('allows null coordinates for unplaced booths in payload', () => {
      const parsed = boothCoordinateItemSchema.parse({
        boothId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        mapX: null,
        mapY: null,
      })

      expect(parsed.mapX).toBeNull()
      expect(parsed.mapY).toBeNull()
    })

    it('rejects coordinates out of [0, 100] range', () => {
      expect(() =>
        boothCoordinateItemSchema.parse({
          boothId: 'b-1',
          mapX: 105.0,
          mapY: 50.0,
        }),
      ).toThrow()

      expect(() =>
        boothCoordinateItemSchema.parse({
          boothId: 'b-1',
          mapX: -5.0,
          mapY: 50.0,
        }),
      ).toThrow()
    })

    it('validates full update coordinates payload for PUT endpoint', () => {
      const payload = {
        coordinates: [
          { boothId: 'b-1', mapX: 10.0, mapY: 20.0 },
          { boothId: 'b-2', mapX: null, mapY: null },
        ],
      }

      const parsed = updateBoothCoordinatesPayloadSchema.parse(payload)
      expect(parsed.coordinates).toHaveLength(2)
      expect(parsed.coordinates[0].mapX).toBe(10.0)
    })

    it('validates update booth coordinates response schema', () => {
      const parsed = updateBoothCoordinatesResponseSchema.parse({
        message: 'Đã cập nhật tọa độ trạm thành công.',
      })
      expect(parsed.message).toBe('Đã cập nhật tọa độ trạm thành công.')
    })
  })

  describe('raceMapBoothSchema', () => {
    it('validates a valid booth', () => {
      const parsed = raceMapBoothSchema.parse({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Trạm A',
        place: 'Khu vực 1',
        status: 'ready',
        description: 'Mô tả trạm',
      })

      expect(parsed.name).toBe('Trạm A')
      expect(parsed.place).toBe('Khu vực 1')
    })

    it('validates booth with stationType and isHidden fields', () => {
      const parsed = raceMapBoothSchema.parse({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Trạm L',
        stationType: 'Trạm ẩn',
        isHidden: true,
      })

      expect(parsed.stationType).toBe('Trạm ẩn')
      expect(parsed.isHidden).toBe(true)
    })

    it('defaults place and status when omitted', () => {
      const parsed = raceMapBoothSchema.parse({
        id: 'booth-1',
        name: 'Trạm Không Vị Trí',
      })

      expect(parsed.place).toBe('')
      expect(parsed.status).toBe('free')
      expect(parsed.description).toBeUndefined()
    })

    it('rejects booth missing name', () => {
      expect(() =>
        raceMapBoothSchema.parse({
          id: 'booth-1',
          name: '',
        }),
      ).toThrow()
    })
  })

  describe('raceMapDetailResponseSchema', () => {
    it('validates race detail response with mapImageUrl and booths', () => {
      const parsed = raceMapDetailResponseSchema.parse({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Đường Đua 2026',
        mapImageUrl: 'https://azure.storage/map.png',
        modifiedAt: '2026-08-15T00:00:00Z',
        booth: [
          {
            id: 'b1',
            name: 'Trạm 1',
          },
        ],
      })

      expect(parsed.mapImageUrl).toBe('https://azure.storage/map.png')
      expect(parsed.booth).toHaveLength(1)
    })

    it('defaults booth array to empty array when omitted', () => {
      const parsed = raceMapDetailResponseSchema.parse({
        id: 'race-99',
      })

      expect(parsed.booth).toEqual([])
    })
  })

  describe('saveRaceMapResponseSchema', () => {
    it('parses mapImageUrl or other URL fields', () => {
      const parsed = saveRaceMapResponseSchema.parse({
        mapImageUrl: 'https://azure.storage/map.png',
        message: 'Success',
      })

      expect(parsed.mapImageUrl).toBe('https://azure.storage/map.png')
    })

    it('passthroughs unexpected backend properties gracefully', () => {
      const parsed = saveRaceMapResponseSchema.parse({
        extraField: 123,
        url: 'https://azure.storage/map2.png',
      })

      expect(parsed.url).toBe('https://azure.storage/map2.png')
    })
  })
})
