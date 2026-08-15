import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import {
  mapBoothStatus,
  mapBoothToStationPin,
  mapTeamMapData,
} from '../model/mapTeamMapData'
import { TeamMapEmptyState } from '../ui/components/TeamMapEmptyState'
import { StationPinItem } from '../ui/components/StationPinItem'
import type { TeamMapRaceDetail, TeamMapBoothItem } from '../model/teamMap.contract'

describe('Challenger 2: Team Map Real Data Sync & Mock Decoupling Empirical Stress Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createBooth = (overrides: Partial<TeamMapBoothItem>): TeamMapBoothItem => ({
    boothId: 'b-default',
    boothName: 'Trạm Mặc Định',
    boothLocation: 'Vị trí A',
    description: 'Mô tả trạm',
    status: 'free',
    isHidden: false,
    currentTeamName: null,
    currentOrganizerName: null,
    mapX: 20,
    mapY: 30,
    ...overrides,
  })

  // =========================================================================
  // 1. EMPTY STATE TRIGGER CONDITIONS & BANNER RENDERING
  // =========================================================================
  describe('1. Empty State Banner Trigger Conditions & Exact Copy Verification', () => {
    const REQUIRED_EMPTY_MESSAGE = 'Ban tổ chức chưa công bố sơ đồ bản đồ trận đấu'
    const REQUIRED_SUBTITLE = 'Vui lòng quay lại sau khi ban tổ chức cập nhật bản đồ và vị trí các trạm thi đấu.'

    it('renders exact required Vietnamese empty state copy', () => {
      const html = renderToString(React.createElement(TeamMapEmptyState))
      expect(html).toContain(REQUIRED_EMPTY_MESSAGE)
      expect(html).toContain(REQUIRED_SUBTITLE)
    })

    it('triggers isEmpty when raceDetail is null/undefined', () => {
      const mappedNull = mapTeamMapData(null, [])
      expect(mappedNull.isEmpty).toBe(true)
      expect(mappedNull.stations).toHaveLength(0)

      const mappedUndef = mapTeamMapData(undefined, undefined)
      expect(mappedUndef.isEmpty).toBe(true)
      expect(mappedUndef.stations).toHaveLength(0)
    })

    it('triggers isEmpty when mapImageUrl is null, empty string, or whitespace', () => {
      const raceDetailNoMap: TeamMapRaceDetail = {
        id: 'r-1',
        raceName: 'Giải Chạy Tiếp Sức',
        status: 'Draft',
        mapImageUrl: null,
      }
      const booths: TeamMapBoothItem[] = [
        createBooth({
          boothId: 'b-1',
          boothName: 'Trạm 1',
          boothLocation: 'Khu A',
          status: 'free',
          isHidden: false,
          mapX: 20,
          mapY: 30,
        }),
      ]

      const mapped1 = mapTeamMapData(raceDetailNoMap, booths)
      expect(mapped1.isEmpty).toBe(true)

      const mapped2 = mapTeamMapData({ ...raceDetailNoMap, mapImageUrl: '' }, booths)
      expect(mapped2.isEmpty).toBe(true)

      const mapped3 = mapTeamMapData({ ...raceDetailNoMap, mapImageUrl: '   ' }, booths)
      expect(mapped3.isEmpty).toBe(true)
    })

    it('triggers isEmpty when booths list is empty', () => {
      const raceDetail: TeamMapRaceDetail = {
        id: 'r-1',
        raceName: 'Giải Chạy',
        status: 'Ongoing',
        mapImageUrl: 'https://example.com/map.png',
      }
      const mapped = mapTeamMapData(raceDetail, [])
      expect(mapped.isEmpty).toBe(true)
      expect(mapped.stations).toHaveLength(0)
    })

    it('triggers isEmpty when all booths are unplaced (mapX or mapY is null)', () => {
      const raceDetail: TeamMapRaceDetail = {
        id: 'r-1',
        raceName: 'Giải Chạy',
        status: 'Ongoing',
        mapImageUrl: 'https://example.com/map.png',
      }
      const booths: TeamMapBoothItem[] = [
        createBooth({
          boothId: 'b-1',
          boothName: 'Trạm 1',
          mapX: null,
          mapY: null,
        }),
        createBooth({
          boothId: 'b-2',
          boothName: 'Trạm 2',
          mapX: 20,
          mapY: null,
        }),
      ]
      const mapped = mapTeamMapData(raceDetail, booths)
      expect(mapped.isEmpty).toBe(true)
      expect(mapped.stations).toHaveLength(0)
    })

    it('triggers isEmpty when all placed booths are marked as isHidden: true', () => {
      const raceDetail: TeamMapRaceDetail = {
        id: 'r-1',
        raceName: 'Giải Chạy Bí Mật',
        status: 'Ongoing',
        mapImageUrl: 'https://example.com/map.png',
      }
      const booths: TeamMapBoothItem[] = [
        createBooth({
          boothId: 'b-hidden-1',
          boothName: 'Trạm Ẩn 1',
          isHidden: true,
          mapX: 25,
          mapY: 35,
        }),
        createBooth({
          boothId: 'b-hidden-2',
          boothName: 'Trạm Ẩn 2',
          isHidden: true,
          mapX: 55,
          mapY: 65,
        }),
      ]
      const mapped = mapTeamMapData(raceDetail, booths)
      expect(mapped.isEmpty).toBe(true)
      expect(mapped.stations).toHaveLength(0)
    })

    it('returns isEmpty: false when map image exists and at least one visible placed booth exists', () => {
      const raceDetail: TeamMapRaceDetail = {
        id: 'r-1',
        raceName: 'Giải Chạy Chính Thức',
        status: 'Ongoing',
        mapImageUrl: 'https://example.com/map.png',
      }
      const booths: TeamMapBoothItem[] = [
        createBooth({
          boothId: 'b-hidden',
          boothName: 'Trạm Ẩn',
          isHidden: true,
          mapX: 25,
          mapY: 35,
        }),
        createBooth({
          boothId: 'b-visible',
          boothName: 'Trạm Thường',
          isHidden: false,
          mapX: 55,
          mapY: 65,
        }),
      ]
      const mapped = mapTeamMapData(raceDetail, booths)
      expect(mapped.isEmpty).toBe(false)
      expect(mapped.stations).toHaveLength(1)
      expect(mapped.stations[0].id).toBe('b-visible')
    })
  })

  // =========================================================================
  // 2. REAL DATA STATUS NORMALIZATION & PIN MAPPING
  // =========================================================================
  describe('2. Real Data Status Normalization & Pin Item Rendering', () => {
    it('normalizes various raw status strings correctly to StationStatus', () => {
      expect(mapBoothStatus('completed')).toBe('completed')
      expect(mapBoothStatus('COMPLETED')).toBe('completed')
      expect(mapBoothStatus('occupied')).toBe('completed')
      expect(mapBoothStatus('locked')).toBe('locked')
      expect(mapBoothStatus('LOCKED')).toBe('locked')
      expect(mapBoothStatus('pending')).toBe('pending')
      expect(mapBoothStatus('free')).toBe('active')
      expect(mapBoothStatus('active')).toBe('active')
      expect(mapBoothStatus('')).toBe('active')
      expect(mapBoothStatus(undefined)).toBe('active')
    })

    it('maps location as code label when available, falling back to name', () => {
      const pinWithLocation = mapBoothToStationPin({
        boothId: 'b-loc',
        boothName: 'Trạm Thử Thách Số 5',
        boothLocation: 'T5',
        mapX: 10,
        mapY: 20,
      })
      expect(pinWithLocation?.code).toBe('T5')

      const pinWithoutLocation = mapBoothToStationPin({
        boothId: 'b-noloc',
        boothName: 'Trạm Thử Thách 9',
        boothLocation: '',
        mapX: 10,
        mapY: 20,
      })
      expect(pinWithoutLocation?.code).toBe('9')
    })

    it('renders StationPinItem with precise absolute percentage positioning style', () => {
      const pin = {
        id: 'pin-test',
        name: 'Trạm Cổng Đông',
        code: 'CD',
        x: 42.75,
        y: 88.5,
        status: 'active' as const,
        points: 100,
        description: 'Vị trí kiểm tra',
      }

      const html = renderToString(
        React.createElement(StationPinItem, {
          pin,
          isSelected: false,
          onClick: vi.fn(),
        }),
      )

      expect(html).toContain('left:42.75%')
      expect(html).toContain('top:88.5%')
      expect(html).toContain('CD')
    })
  })
})
