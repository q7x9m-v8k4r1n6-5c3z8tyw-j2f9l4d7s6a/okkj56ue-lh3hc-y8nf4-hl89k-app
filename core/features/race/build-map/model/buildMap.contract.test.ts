import { describe, expect, it } from 'vitest'
import {
  boothCoordinateItemSchema,
  raceBoothItemSchema,
  raceBoothsResponseSchema,
  raceMapDetailResponseSchema,
  updateBoothCoordinatesPayloadSchema,
  uploadRaceMapResponseSchema,
} from './buildMap.contract'

describe('buildMap contracts', () => {
  it('parses race map detail with mapImageUrl', () => {
    const raw = {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'OVC Race 2026',
      mapImageUrl: 'https://storage.blob.example/map.png',
      status: 'ongoing',
      extraField: 'allowed_by_passthrough',
    }
    const parsed = raceMapDetailResponseSchema.parse(raw)
    expect(parsed.id).toBe(raw.id)
    expect(parsed.mapImageUrl).toBe(raw.mapImageUrl)
    expect(parsed.status).toBe('ongoing')

    const invalidStatus = {
      id: '11111111-1111-4111-8111-111111111111',
      status: 'unknown_status',
    }
    expect(() => raceMapDetailResponseSchema.parse(invalidStatus)).toThrow()
  })

  it('parses station booth items with isHidden flag', () => {
    const booths = [
      {
        boothId: '22222222-2222-4222-8222-222222222222',
        boothName: 'Trạm N',
        boothLocation: 'Khu A',
        description: 'Trạm kiểm tra',
        status: 'active',
        isHidden: false,
      },
      {
        boothId: '33333333-3333-4333-8333-333333333333',
        boothName: 'Trạm L',
        isHidden: true,
      },
    ]

    const parsedItem = raceBoothItemSchema.parse(booths[0])
    expect(parsedItem.boothName).toBe('Trạm N')

    const parsed = raceBoothsResponseSchema.parse(booths)
    expect(parsed).toHaveLength(2)
    expect(parsed[0].isHidden).toBe(false)
    expect(parsed[1].isHidden).toBe(true)
    expect(parsed[1].boothLocation).toBe('')
  })

  it('parses upload race map response', () => {
    const raw = {
      mapImageUrl: 'https://storage.blob.example/new-map.png',
    }
    const parsed = uploadRaceMapResponseSchema.parse(raw)
    expect(parsed.mapImageUrl).toBe('https://storage.blob.example/new-map.png')
  })

  it('rejects invalid upload response missing mapImageUrl', () => {
    expect(() => uploadRaceMapResponseSchema.parse({})).toThrow()
  })

  it('validates booth with mapX and mapY', () => {
    const item = raceBoothItemSchema.parse({
      boothId: 'b-coords',
      boothName: 'Trạm Tọa Độ',
      mapX: 45.5,
      mapY: 72.1,
    })
    expect(item.mapX).toBe(45.5)
    expect(item.mapY).toBe(72.1)
  })

  it('validates coordinate item within [0, 100]', () => {
    const valid = { boothId: 'b-1', mapX: 0, mapY: 100 }
    expect(boothCoordinateItemSchema.parse(valid).boothId).toBe('b-1')

    const outOfBounds = { boothId: 'b-1', mapX: -1, mapY: 50 }
    expect(() => boothCoordinateItemSchema.parse(outOfBounds)).toThrow()

    const payload = updateBoothCoordinatesPayloadSchema.parse({
      coordinates: [{ boothId: 'b-1', mapX: 25.5, mapY: 80.2 }],
    })
    expect(payload.coordinates).toHaveLength(1)
  })
})
