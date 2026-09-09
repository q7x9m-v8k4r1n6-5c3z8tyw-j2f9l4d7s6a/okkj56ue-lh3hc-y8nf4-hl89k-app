import { describe, expect, it } from 'vitest'
import {
  teamMapBoothSchema,
  teamMapDetailResponseSchema,
} from '../model/teamMap.contract'

describe('teamMap.contract', () => {
  describe('teamMapBoothSchema', () => {
    it('parses a valid booth payload', () => {
      const input = {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Trạm 1',
        place: 'Khu A',
        description: 'Mô tả trạm 1',
        isHidden: false,
        status: 'occupied',
        mapX: 25.5,
        mapY: 50.2,
      }

      const parsed = teamMapBoothSchema.parse(input)

      expect(parsed.id).toBe('11111111-1111-1111-1111-111111111111')
      expect(parsed.name).toBe('Trạm 1')
      expect(parsed.place).toBe('Khu A')
      expect(parsed.description).toBe('Mô tả trạm 1')
      expect(parsed.isHidden).toBe(false)
      expect(parsed.status).toBe('occupied')
      expect(parsed.mapX).toBe(25.5)
      expect(parsed.mapY).toBe(50.2)
    })

    it('defaults optional fields safely when missing or null', () => {
      const input = {
        id: '22222222-2222-2222-2222-222222222222',
        name: null,
        place: null,
        description: null,
        isHidden: null,
        status: null,
        mapX: null,
        mapY: null,
      }

      const parsed = teamMapBoothSchema.parse(input)

      expect(parsed.name).toBe('')
      expect(parsed.place).toBe('')
      expect(parsed.description).toBe('')
      expect(parsed.isHidden).toBe(false)
      expect(parsed.status).toBe('free')
      expect(parsed.mapX).toBeNull()
      expect(parsed.mapY).toBeNull()
    })
    it('handles numeric string coordinates and string isHidden safely', () => {
      const input = {
        id: 12345,
        name: 'Trạm 1',
        place: 'Khu A',
        description: 'Mô tả',
        isHidden: 'true',
        status: 'occupied',
        mapX: '45.8',
        mapY: '60.2',
      }

      const parsed = teamMapBoothSchema.parse(input)

      expect(parsed.id).toBe('12345')
      expect(parsed.isHidden).toBe(true)
      expect(parsed.mapX).toBe(45.8)
      expect(parsed.mapY).toBe(60.2)
    })

    it('handles invalid coordinate strings by falling back to null', () => {
      const input = {
        id: 'b-invalid',
        mapX: 'not-a-number',
        mapY: '',
      }

      const parsed = teamMapBoothSchema.parse(input)

      expect(parsed.mapX).toBeNull()
      expect(parsed.mapY).toBeNull()
    })

    it('parses numeric isHidden flag (1 as true, 0 as false)', () => {
      const parsedTrue = teamMapBoothSchema.parse({ id: 'b-1', isHidden: 1 })
      const parsedFalse = teamMapBoothSchema.parse({ id: 'b-2', isHidden: 0 })

      expect(parsedTrue.isHidden).toBe(true)
      expect(parsedFalse.isHidden).toBe(false)
    })
  })

  describe('teamMapDetailResponseSchema', () => {
    it('parses race detail response with booth array', () => {
      const input = {
        id: 'race-uuid-1',
        name: 'Giải chạy Mùa Xuân',
        mapImageUrl: 'https://example.com/map.jpg',
        booth: [
          {
            id: 'b-1',
            name: 'Trạm 1',
            place: 'Cổng Bắc',
            isHidden: false,
            mapX: 10,
            mapY: 20,
          },
        ],
      }

      const parsed = teamMapDetailResponseSchema.parse(input)

      expect(parsed.mapImageUrl).toBe('https://example.com/map.jpg')
      expect(parsed.booth).toHaveLength(1)
      expect(parsed.booth[0].name).toBe('Trạm 1')
    })

    it('safely handles booth: null and booths: null without throwing', () => {
      const inputWithNullBooth = {
        id: 'race-null-booth',
        mapImageUrl: 'https://example.com/map.png',
        booth: null,
      }

      const parsed = teamMapDetailResponseSchema.parse(inputWithNullBooth)
      expect(parsed.booth).toEqual([])

      const inputWithNullBooths = {
        id: 'race-null-booths',
        mapImageUrl: 'https://example.com/map.png',
        booth: null,
        booths: null,
      }

      const parsedBoth = teamMapDetailResponseSchema.parse(inputWithNullBooths)
      expect(parsedBoth.booth).toEqual([])
    })

    it('supports booths alias when booth is empty or null', () => {
      const input = {
        id: 'race-uuid-2',
        mapImageUrl: 'https://example.com/map2.jpg',
        booths: [
          {
            id: 'b-2',
            name: 'Trạm 2',
            place: 'Cổng Nam',
            isHidden: true,
            mapX: 30,
            mapY: 40,
          },
        ],
      }

      const parsed = teamMapDetailResponseSchema.parse(input)

      expect(parsed.booth).toHaveLength(1)
      expect(parsed.booth[0].id).toBe('b-2')
      expect(parsed.booth[0].isHidden).toBe(true)
    })

    it('defaults booth to empty array when omitted', () => {
      const input = {
        id: 'race-uuid-3',
        mapImageUrl: null,
      }

      const parsed = teamMapDetailResponseSchema.parse(input)

      expect(parsed.mapImageUrl).toBeNull()
      expect(parsed.booth).toEqual([])
    })

    it('normalizes whitespace mapImageUrl to null', () => {
      const input = {
        id: 'race-ws-map',
        mapImageUrl: '   ',
        booth: [],
      }

      const parsed = teamMapDetailResponseSchema.parse(input)
      expect(parsed.mapImageUrl).toBeNull()
    })

    it('supports boothId, boothName, and boothLocation aliases', () => {
      const input = {
        id: 'race-alias',
        booth: [
          {
            boothId: 'alias-1',
            boothName: '  Trạm Tên Alias  ',
            boothLocation: '  Khu Alias  ',
            mapX: 20,
            mapY: 30,
          },
        ],
      }

      const parsed = teamMapDetailResponseSchema.parse(input)
      expect(parsed.booth[0].id).toBe('alias-1')
      expect(parsed.booth[0].name).toBe('Trạm Tên Alias')
      expect(parsed.booth[0].place).toBe('Khu Alias')
    })
  })
})
