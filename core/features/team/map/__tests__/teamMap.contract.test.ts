import { describe, expect, it } from 'vitest'
import {
  teamMapBoothSchema,
  teamMapBoothListResponseSchema,
  teamRaceMapDetailSchema,
} from '../model/teamMap.contract'

describe('teamMap.contract Zod Schemas', () => {
  describe('teamMapBoothSchema', () => {
    it('validates a complete booth object', () => {
      const validBooth = {
        boothId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        boothName: 'Trạm 1: Khởi động',
        boothLocation: 'Khu A',
        description: 'Vượt chướng ngại vật',
        status: 'free',
        isHidden: false,
        currentTeamName: null,
        currentOrganizerName: 'Organizer 1',
        mapX: 25.5,
        mapY: 40.2,
      }

      const result = teamMapBoothSchema.parse(validBooth)
      expect(result.boothId).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      expect(result.boothName).toBe('Trạm 1: Khởi động')
      expect(result.mapX).toBe(25.5)
      expect(result.mapY).toBe(40.2)
      expect(result.isHidden).toBe(false)
    })

    it('handles nullable and optional fields with defaults', () => {
      const minimalBooth = {
        boothId: 'b-123',
        boothName: 'Trạm Tối Thiểu',
      }

      const result = teamMapBoothSchema.parse(minimalBooth)
      expect(result.boothLocation).toBe('')
      expect(result.description).toBe('')
      expect(result.status).toBe('free')
      expect(result.isHidden).toBe(false)
      expect(result.mapX).toBeUndefined()
      expect(result.mapY).toBeUndefined()
    })

    it('rejects booth with empty boothName', () => {
      const invalidBooth = {
        boothId: 'b-123',
        boothName: '',
      }

      expect(() => teamMapBoothSchema.parse(invalidBooth)).toThrow()
    })
  })

  describe('teamMapBoothListResponseSchema', () => {
    it('validates an array of booth items', () => {
      const boothList = [
        { boothId: 'b1', boothName: 'Trạm 1', mapX: 10, mapY: 20 },
        { boothId: 'b2', boothName: 'Trạm 2', mapX: null, mapY: null },
      ]

      const result = teamMapBoothListResponseSchema.parse(boothList)
      expect(result).toHaveLength(2)
      expect(result[0].mapX).toBe(10)
      expect(result[1].mapX).toBeNull()
    })

    it('validates an empty array', () => {
      const result = teamMapBoothListResponseSchema.parse([])
      expect(result).toEqual([])
    })
  })

  describe('teamRaceMapDetailSchema', () => {
    it('validates full race detail', () => {
      const raceDetail = {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'MOVE Race 2026',
        raceName: 'MOVE Race 2026',
        mapImageUrl: 'https://storage.blob.core.windows.net/maps/race1.png',
        status: 'Draft',
        modifiedAt: '2026-08-15T07:55:54Z',
      }

      const result = teamRaceMapDetailSchema.parse(raceDetail)
      expect(result.id).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      expect(result.mapImageUrl).toBe('https://storage.blob.core.windows.net/maps/race1.png')
      expect(result.status).toBe('Draft')
    })

    it('handles null mapImageUrl and fallback fields', () => {
      const raceDetail = {
        id: 'race-456',
        mapImageUrl: null,
        mapUrl: 'https://fallback.com/map.jpg',
      }

      const result = teamRaceMapDetailSchema.parse(raceDetail)
      expect(result.mapImageUrl).toBeNull()
      expect(result.mapUrl).toBe('https://fallback.com/map.jpg')
    })
  })
})
