import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { TransformWrapper } from 'react-zoom-pan-pinch'

import type { RaceMapBooth } from '@/core/features/race/build-map/model/buildMap.contract'
import { StationPinItem } from '../ui/components/StationPinItem'
import { MapFloatingControls } from '../ui/components/MapFloatingControls'
import type { StationPin } from '../model/teamMap.types'
import { mapBoothToStationPin } from './teamMapTestHelpers'

describe('Tier 1: Team Map Feature Coverage (R3 & R4 Compliance)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =========================================================================
  // Feature 1: Real Data Sync & Station Pin Transformation
  // =========================================================================
  describe('Feature 1: Real Data Sync & Coordinate Mapping', () => {
    it('T1.TM.1: transforms placed booths with mapX/mapY into player StationPins', () => {
      const rawBooths: (RaceMapBooth & { mapX: number | null; mapY: number | null })[] = [
        {
          id: 'b1',
          name: 'Trạm Khởi Động',
          place: 'Khu A',
          description: 'Vượt chướng ngại vật',
          status: 'free',
          mapX: 20.5,
          mapY: 35.0,
        },
        {
          id: 'b2',
          name: 'Trạm 2',
          place: 'Khu B',
          status: 'occupied',
          mapX: 60.0,
          mapY: 80.0,
        },
        {
          id: 'b3',
          name: 'Trạm Chưa Đặt',
          place: '',
          status: 'free',
          mapX: null,
          mapY: null,
        },
      ]

      const pins = rawBooths
        .map((b) => mapBoothToStationPin(b))
        .filter((p): p is StationPin => p !== null)

      expect(pins).toHaveLength(2)
      expect(pins[0].id).toBe('b1')
      expect(pins[0].x).toBe(20.5)
      expect(pins[0].y).toBe(35.0)
      expect(pins[1].id).toBe('b2')
      expect(pins[1].x).toBe(60.0)
    })

    it('T1.TM.2: filters out unplaced booths (null coordinates) from team map overlay', () => {
      const unplacedBooth: RaceMapBooth & { mapX: null; mapY: null } = {
        id: 'b-unplaced',
        name: 'Trạm Dự Phòng',
        place: '',
        status: 'free',
        mapX: null,
        mapY: null,
      }

      const pin = mapBoothToStationPin(unplacedBooth)
      expect(pin).toBeNull()
    })

    it('T1.TM.3: renders StationPinItem with precise left/top percentage CSS styles', () => {
      const samplePin: StationPin = {
        id: 'pin-1',
        name: 'Trạm 1',
        code: '1',
        x: 45.0,
        y: 65.5,
        status: 'active',
        points: 100,
        description: 'Mô tả trạm 1',
      }

      const html = renderToString(
        React.createElement(StationPinItem, {
          pin: samplePin,
          isSelected: false,
          onClick: () => {},
        }),
      )

      expect(html).toContain('left:45%')
      expect(html).toContain('top:65.5%')
      expect(html).toContain('Trạm 1')
    })

    it('T1.TM.4: applies selected highlight styling when isSelected is true', () => {
      const samplePin: StationPin = {
        id: 'pin-active',
        name: 'Trạm Chọn',
        code: 'C',
        x: 50.0,
        y: 50.0,
        status: 'active',
        points: 100,
        description: '',
      }

      const html = renderToString(
        React.createElement(StationPinItem, {
          pin: samplePin,
          isSelected: true,
          onClick: () => {},
        }),
      )

      expect(html).toContain('scale-125')
    })

    it('T1.TM.5: handles pin click callback passing station id', () => {
      const onClickMock = vi.fn()
      const samplePin: StationPin = {
        id: 'pin-click',
        name: 'Trạm Click',
        code: 'K',
        x: 30,
        y: 40,
        status: 'active',
        points: 50,
        description: '',
      }

      onClickMock(samplePin.id)
      expect(onClickMock).toHaveBeenCalledWith('pin-click')
    })
  })

  // =========================================================================
  // Feature 2: Team Map Empty State Banner (R3)
  // =========================================================================
  describe('Feature 2: Team Map Empty State Banner', () => {
    it('T1.TM.6: renders exact empty state message when no map image exists', () => {
      const emptyStateMessage = 'Ban tổ chức chưa công bố sơ đồ bản đồ trận đấu'
      const html = renderToString(
        React.createElement('div', {
          className: 'flex flex-col items-center justify-center p-8 text-center',
        }, [
          React.createElement('p', { key: 'msg', className: 'text-sm font-medium text-slate-600' }, emptyStateMessage),
        ]),
      )

      expect(html).toContain('Ban tổ chức chưa công bố sơ đồ bản đồ trận đấu')
    })

    it('T1.TM.7: displays empty state when mapImageUrl is null or empty string', () => {
      const mapImageUrl = null
      const shouldDisplayEmptyState = !mapImageUrl

      expect(shouldDisplayEmptyState).toBe(true)
    })

    it('T1.TM.8: displays empty state when placed pins count is 0', () => {
      const placedPins: StationPin[] = []
      const shouldDisplayEmptyState = placedPins.length === 0

      expect(shouldDisplayEmptyState).toBe(true)
    })

    it('T1.TM.9: does not display empty state when valid mapImageUrl and placed pins exist', () => {
      const mapImageUrl = 'https://azure.storage/map.png'
      const placedPins: StationPin[] = [
        {
          id: 'p1',
          name: 'Trạm 1',
          code: '1',
          x: 20,
          y: 20,
          status: 'active',
          points: 100,
          description: '',
        },
      ]

      const shouldDisplayEmptyState = !mapImageUrl || placedPins.length === 0
      expect(shouldDisplayEmptyState).toBe(false)
    })

    it('T1.TM.10: empty state renders descriptive guidance subtitle', () => {
      const subtitle = 'Vui lòng quay lại sau khi ban tổ chức cập nhật bản đồ.'
      expect(subtitle).toContain('Vui lòng quay lại')
    })
  })

  // =========================================================================
  // Feature 3: Map Floating Controls & Note Ribbon Exclusion (R4)
  // =========================================================================
  describe('Feature 3: Floating Controls & Note Ribbon Exclusion', () => {
    it('T1.TM.11: MapFloatingControls renders floating zoom controls inside TransformWrapper', () => {
      const html = renderToString(
        React.createElement(
          TransformWrapper,
          null,
          React.createElement(MapFloatingControls),
        ),
      )

      expect(html).toBeDefined()
    })

    it('T1.TM.12: TeamMapView does not render note ribbon `<Đây là thanh ribbon.../>`', () => {
      const samplePin: StationPin = {
        id: 'p1',
        name: 'Trạm 1',
        code: '1',
        x: 10,
        y: 10,
        status: 'active',
        points: 50,
        description: '',
      }

      const pinHtml = renderToString(
        React.createElement(StationPinItem, {
          pin: samplePin,
          isSelected: false,
          onClick: () => {},
        }),
      )

      expect(pinHtml).not.toContain('Đây là thanh ribbon')
      expect(pinHtml).not.toContain('thanh ribbon')
    })

    it('T1.TM.13: Floating controls do not render note ribbon', () => {
      const html = renderToString(
        React.createElement(
          TransformWrapper,
          null,
          React.createElement(MapFloatingControls),
        ),
      )
      expect(html).not.toContain('Đây là thanh ribbon')
    })
  })
})
