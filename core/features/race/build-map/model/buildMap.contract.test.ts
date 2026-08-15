import { describe, expect, it } from 'vitest'
import {
  raceMapBoothSchema,
  raceMapDetailResponseSchema,
  saveRaceMapResponseSchema,
} from './buildMap.contract'

describe('buildMap.contract zod schemas', () => {
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
