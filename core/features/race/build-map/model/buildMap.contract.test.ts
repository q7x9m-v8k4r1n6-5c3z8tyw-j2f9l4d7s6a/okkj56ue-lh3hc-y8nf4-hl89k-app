import { describe, expect, it } from 'vitest'
import {
  raceBoothItemSchema,
  raceBoothsResponseSchema,
  raceMapDetailResponseSchema,
  uploadRaceMapResponseSchema,
} from './buildMap.contract'

describe('buildMap contracts', () => {
  it('parses race map detail with mapImageUrl', () => {
    const raw = {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'OVC Race 2026',
      mapImageUrl: 'https://storage.blob.example/map.png',
      extraField: 'allowed_by_passthrough',
    }
    const parsed = raceMapDetailResponseSchema.parse(raw)
    expect(parsed.id).toBe(raw.id)
    expect(parsed.mapImageUrl).toBe(raw.mapImageUrl)
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
})
