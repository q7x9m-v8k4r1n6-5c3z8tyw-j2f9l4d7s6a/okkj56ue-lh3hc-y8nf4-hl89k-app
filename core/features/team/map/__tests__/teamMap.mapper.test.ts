import { describe, expect, it } from 'vitest'
import { mapRaceDetailToMapData } from '../model/teamMap.mapper'
import type { TeamMapDetailResponse } from '../model/teamMap.contract'

describe('mapRaceDetailToMapData', () => {
  it('returns empty MapData when response is null or undefined', () => {
    expect(mapRaceDetailToMapData(null)).toEqual({
      backgroundImageUrl: '',
      stations: [],
      isHideBoothDescription: false,
      isDisabledBoothStatus: false,
    })
    expect(mapRaceDetailToMapData(undefined)).toEqual({
      backgroundImageUrl: '',
      stations: [],
      isHideBoothDescription: false,
      isDisabledBoothStatus: false,
    })
  })

  it('maps backgroundImageUrl from race.mapImageUrl or falls back to empty string', () => {
    const withMap = mapRaceDetailToMapData({
      mapImageUrl: 'https://example.com/map.png',
      booth: [],
    })
    expect(withMap.backgroundImageUrl).toBe('https://example.com/map.png')

    const withoutMap = mapRaceDetailToMapData({
      mapImageUrl: null,
      booth: [],
    })
    expect(withoutMap.backgroundImageUrl).toBe('')
  })

  it('filters out 100% of secret booths (isHidden === true)', () => {
    const response: TeamMapDetailResponse = {
      mapImageUrl: 'https://example.com/map.png',
      booth: [
        {
          id: 'b-public-1',
          name: 'Trạm Công Khai 1',
          place: 'Sảnh chính',
          description: 'Mô tả 1',
          isHidden: false,
          status: 'free',
          mapX: 20,
          mapY: 30,
        },
        {
          id: 'b-secret-1',
          name: 'Trạm Bí Mật 1',
          place: 'Hầm bí mật',
          description: 'Mô tả bí mật',
          isHidden: true,
          status: 'free',
          mapX: 40,
          mapY: 50,
        },
        {
          id: 'b-secret-2',
          name: 'Trạm Bí Mật 2',
          place: 'Phòng kín',
          description: 'Mô tả bí mật 2',
          isHidden: true,
          status: 'occupied',
          mapX: 60,
          mapY: 70,
        },
        {
          id: 'b-public-2',
          name: 'Trạm Công Khai 2',
          place: 'Sân thượng',
          description: 'Mô tả 2',
          isHidden: false,
          status: 'occupied',
          mapX: 80,
          mapY: 90,
        },
      ],
    }

    const result = mapRaceDetailToMapData(response)

    expect(result.stations).toHaveLength(2)
    expect(result.stations.map((s) => s.id)).toEqual(['b-public-1', 'b-public-2'])
    expect(result.stations.some((s) => s.id === 'b-secret-1')).toBe(false)
    expect(result.stations.some((s) => s.id === 'b-secret-2')).toBe(false)
  })

  it('filters out booths lacking coordinates (mapX == null or mapY == null)', () => {
    const response: TeamMapDetailResponse = {
      mapImageUrl: 'https://example.com/map.png',
      booth: [
        {
          id: 'b-valid-1',
          name: 'Trạm Đủ Toạ Độ',
          place: 'Khu A',
          description: 'Mô tả',
          isHidden: false,
          status: 'free',
          mapX: 15,
          mapY: 25,
        },
        {
          id: 'b-no-x',
          name: 'Trạm Thiếu X',
          place: 'Khu B',
          description: 'Mô tả',
          isHidden: false,
          status: 'free',
          mapX: null,
          mapY: 30,
        },
        {
          id: 'b-no-y',
          name: 'Trạm Thiếu Y',
          place: 'Khu C',
          description: 'Mô tả',
          isHidden: false,
          status: 'free',
          mapX: 45,
          mapY: null,
        },
        {
          id: 'b-no-xy',
          name: 'Trạm Thiếu Cả Hai',
          place: 'Khu D',
          description: 'Mô tả',
          isHidden: false,
          status: 'free',
          mapX: null,
          mapY: null,
        },
      ],
    }

    const result = mapRaceDetailToMapData(response)

    expect(result.stations).toHaveLength(1)
    expect(result.stations[0].id).toBe('b-valid-1')
  })

  it('preserves boundary coordinates (mapX: 0, mapY: 0)', () => {
    const response: TeamMapDetailResponse = {
      mapImageUrl: 'https://example.com/map.png',
      booth: [
        {
          id: 'b-zero',
          name: 'Trạm Góc Toạ Độ',
          place: 'Góc 0,0',
          description: 'Tại góc',
          isHidden: false,
          status: 'free',
          mapX: 0,
          mapY: 0,
        },
      ],
    }

    const result = mapRaceDetailToMapData(response)

    expect(result.stations).toHaveLength(1)
    expect(result.stations[0].x).toBe(0)
    expect(result.stations[0].y).toBe(0)
  })

  it('strictly maps booth status to only two states: occupied and free', () => {
    const response: TeamMapDetailResponse = {
      mapImageUrl: 'https://example.com/map.png',
      booth: [
        {
          id: 'b-occupied',
          name: 'Trạm Bận',
          place: 'Khu 1',
          description: '',
          isHidden: false,
          status: 'occupied',
          mapX: 10,
          mapY: 10,
        },
        {
          id: 'b-free',
          name: 'Trạm Rảnh',
          place: 'Khu 2',
          description: '',
          isHidden: false,
          status: 'free',
          mapX: 20,
          mapY: 20,
        },
        {
          id: 'b-active',
          name: 'Trạm Active',
          place: 'Khu 3',
          description: '',
          isHidden: false,
          status: 'active',
          mapX: 30,
          mapY: 30,
        },
        {
          id: 'b-completed',
          name: 'Trạm Completed',
          place: 'Khu 4',
          description: '',
          isHidden: false,
          status: 'completed',
          mapX: 40,
          mapY: 40,
        },
        {
          id: 'b-unknown',
          name: 'Trạm Unknown',
          place: 'Khu 5',
          description: '',
          isHidden: false,
          status: 'something_else',
          mapX: 50,
          mapY: 50,
        },
      ],
    }

    const result = mapRaceDetailToMapData(response)

    expect(result.stations).toHaveLength(5)
    expect(result.stations.find((s) => s.id === 'b-occupied')?.status).toBe('occupied')
    expect(result.stations.find((s) => s.id === 'b-free')?.status).toBe('free')
    expect(result.stations.find((s) => s.id === 'b-active')?.status).toBe('free')
    expect(result.stations.find((s) => s.id === 'b-completed')?.status).toBe('free')
    expect(result.stations.find((s) => s.id === 'b-unknown')?.status).toBe('free')
  })

  it('correctly maps name, place, and description fields', () => {
    const response: TeamMapDetailResponse = {
      mapImageUrl: 'https://example.com/map.png',
      booth: [
        {
          id: 'b-info',
          name: 'Trạm Khởi Động',
          place: 'Khu vực quảng trường',
          description: 'Tìm mật thư tại đài phun nước.',
          isHidden: false,
          status: 'occupied',
          mapX: 35.5,
          mapY: 42.8,
        },
      ],
    }

    const result = mapRaceDetailToMapData(response)

    expect(result.stations[0]).toEqual({
      id: 'b-info',
      name: 'Trạm Khởi Động',
      place: 'Khu vực quảng trường',
      description: 'Tìm mật thư tại đài phun nước.',
      x: 35.5,
      y: 42.8,
      status: 'occupied',
    })
  })

  it('maps case-insensitive and whitespace padded status safely', () => {
    const response: TeamMapDetailResponse = {
      mapImageUrl: 'https://example.com/map.png',
      booth: [
        {
          id: 'b-case',
          name: 'Trạm Test Case',
          place: '',
          description: '',
          isHidden: false,
          status: '  OCCUPIED  ',
          mapX: 10,
          mapY: 20,
        },
      ],
    }

    const result = mapRaceDetailToMapData(response)
    expect(result.stations[0].status).toBe('occupied')
  })

  it('filters out non-finite coordinates (Infinity, -Infinity)', () => {
    const response: TeamMapDetailResponse = {
      mapImageUrl: 'https://example.com/map.png',
      booth: [
        {
          id: 'b-inf-x',
          name: 'Trạm Vô Cực X',
          place: '',
          description: '',
          isHidden: false,
          status: 'free',
          mapX: Infinity,
          mapY: 20,
        },
        {
          id: 'b-inf-y',
          name: 'Trạm Vô Cực Y',
          place: '',
          description: '',
          isHidden: false,
          status: 'free',
          mapX: 20,
          mapY: -Infinity,
        },
      ],
    }

    const result = mapRaceDetailToMapData(response)
    expect(result.stations).toHaveLength(0)
  })

  it('clamps out-of-bounds coordinates to [0, 100] range', () => {
    const response: TeamMapDetailResponse = {
      mapImageUrl: 'https://example.com/map.png',
      booth: [
        {
          id: 'b-clamp-1',
          name: 'Trạm Quá Biên',
          place: '',
          description: '',
          isHidden: false,
          status: 'free',
          mapX: -15,
          mapY: 135,
        },
      ],
    }

    const result = mapRaceDetailToMapData(response)
    expect(result.stations).toHaveLength(1)
    expect(result.stations[0].x).toBe(0)
    expect(result.stations[0].y).toBe(100)
  })

  it('normalizes whitespace-only mapImageUrl to empty string', () => {
    const response: TeamMapDetailResponse = {
      mapImageUrl: '   ',
      booth: [],
    }

    const result = mapRaceDetailToMapData(response)
    expect(result.backgroundImageUrl).toBe('')
  })

  it('defensively filters booths with string "true" or numeric 1 isHidden flags', () => {
    const rawResponse = {
      mapImageUrl: 'https://example.com/map.png',
      booth: [
        {
          id: 'b-raw-str-hidden',
          name: 'Trạm Ẩn String',
          place: '',
          description: '',
          isHidden: 'true' as unknown as boolean,
          status: 'free',
          mapX: 20,
          mapY: 30,
        },
        {
          id: 'b-raw-num-hidden',
          name: 'Trạm Ẩn Number',
          place: '',
          description: '',
          isHidden: 1 as unknown as boolean,
          status: 'free',
          mapX: 40,
          mapY: 50,
        },
        {
          id: 'b-raw-public',
          name: 'Trạm Công Khai',
          place: '',
          description: '',
          isHidden: false,
          status: 'free',
          mapX: 60,
          mapY: 70,
        },
      ],
    } as unknown as TeamMapDetailResponse

    const result = mapRaceDetailToMapData(rawResponse)
    expect(result.stations).toHaveLength(1)
    expect(result.stations[0].id).toBe('b-raw-public')
  })

  it('generates unique fallback id when booth id is empty or whitespace', () => {
    const response: TeamMapDetailResponse = {
      mapImageUrl: 'https://example.com/map.png',
      booth: [
        {
          id: '',
          name: 'Trạm Không ID 1',
          place: '',
          description: '',
          isHidden: false,
          status: 'free',
          mapX: 10,
          mapY: 20,
        },
        {
          id: '   ',
          name: 'Trạm Không ID 2',
          place: '',
          description: '',
          isHidden: false,
          status: 'free',
          mapX: 30,
          mapY: 40,
        },
      ],
    }

    const result = mapRaceDetailToMapData(response)
    expect(result.stations).toHaveLength(2)
    expect(result.stations[0].id).toBe('station-1')
    expect(result.stations[1].id).toBe('station-2')
  })

  describe('map settings synchronization', () => {
    const mixedBooths = [
      {
        id: 'b-public-free',
        name: 'Trạm Công Khai Rảnh',
        place: 'Khu A',
        description: 'Mô tả A',
        isHidden: false,
        status: 'free',
        mapX: 20,
        mapY: 30,
      },
      {
        id: 'b-public-occupied',
        name: 'Trạm Công Khai Bận',
        place: 'Khu B',
        description: 'Mô tả B',
        isHidden: false,
        status: 'occupied',
        mapX: 40,
        mapY: 50,
      },
      {
        id: 'b-hidden-free',
        name: 'Trạm Ẩn Rảnh',
        place: 'Hầm bí mật',
        description: 'Mô tả ẩn 1',
        isHidden: true,
        status: 'free',
        mapX: 60,
        mapY: 70,
      },
      {
        id: 'b-hidden-occupied',
        name: 'Trạm Ẩn Bận',
        place: 'Gác xép',
        description: 'Mô tả ẩn 2',
        isHidden: true,
        status: 'occupied',
        mapX: 80,
        mapY: 90,
      },
    ]

    it('shows hidden stations like normal stations when isShowHiddenBooths is true', () => {
      const response: TeamMapDetailResponse = {
        mapImageUrl: 'https://example.com/map.png',
        isShowHiddenBooths: true,
        booth: mixedBooths,
      }

      const result = mapRaceDetailToMapData(response)

      // All 4 stations must be included (both public and hidden)
      expect(result.stations).toHaveLength(4)
      expect(result.stations.map((s) => s.id)).toEqual([
        'b-public-free',
        'b-public-occupied',
        'b-hidden-free',
        'b-hidden-occupied',
      ])

      // Hidden stations display their actual status (free/occupied)
      const hiddenFree = result.stations.find((s) => s.id === 'b-hidden-free')
      const hiddenOccupied = result.stations.find((s) => s.id === 'b-hidden-occupied')
      expect(hiddenFree?.status).toBe('free')
      expect(hiddenOccupied?.status).toBe('occupied')
    })

    it('filters out hidden stations when isShowHiddenBooths is false or omitted', () => {
      const response: TeamMapDetailResponse = {
        mapImageUrl: 'https://example.com/map.png',
        isShowHiddenBooths: false,
        booth: mixedBooths,
      }

      const result = mapRaceDetailToMapData(response)

      // Only 2 public stations must be returned
      expect(result.stations).toHaveLength(2)
      expect(result.stations.map((s) => s.id)).toEqual([
        'b-public-free',
        'b-public-occupied',
      ])
    })

    it('forces all station pins to occupied (Red) when isDisabledBoothStatus is true', () => {
      const response: TeamMapDetailResponse = {
        mapImageUrl: 'https://example.com/map.png',
        isDisabledBoothStatus: true,
        booth: mixedBooths,
      }

      const result = mapRaceDetailToMapData(response)

      expect(result.stations.length).toBeGreaterThan(0)
      for (const station of result.stations) {
        expect(station.status).toBe('occupied')
      }
    })

    it('preserves normal free/occupied status when isDisabledBoothStatus is false', () => {
      const response: TeamMapDetailResponse = {
        mapImageUrl: 'https://example.com/map.png',
        isDisabledBoothStatus: false,
        booth: mixedBooths,
      }

      const result = mapRaceDetailToMapData(response)

      const freeStation = result.stations.find((s) => s.id === 'b-public-free')
      const occupiedStation = result.stations.find((s) => s.id === 'b-public-occupied')
      expect(freeStation?.status).toBe('free')
      expect(occupiedStation?.status).toBe('occupied')
    })

    it('propagates isHideBoothDescription flag into returned MapData', () => {
      const withHideDesc = mapRaceDetailToMapData({
        mapImageUrl: 'https://example.com/map.png',
        isHideBoothDescription: true,
        booth: [],
      })
      expect(withHideDesc.isHideBoothDescription).toBe(true)

      const withoutHideDesc = mapRaceDetailToMapData({
        mapImageUrl: 'https://example.com/map.png',
        isHideBoothDescription: false,
        booth: [],
      })
      expect(withoutHideDesc.isHideBoothDescription).toBe(false)
    })

    it('propagates isDisabledBoothStatus flag into returned MapData', () => {
      const withDisabled = mapRaceDetailToMapData({
        mapImageUrl: 'https://example.com/map.png',
        isDisabledBoothStatus: true,
        booth: [],
      })
      expect(withDisabled.isDisabledBoothStatus).toBe(true)

      const withoutDisabled = mapRaceDetailToMapData({
        mapImageUrl: 'https://example.com/map.png',
        isDisabledBoothStatus: false,
        booth: [],
      })
      expect(withoutDisabled.isDisabledBoothStatus).toBe(false)
    })
  })
})
