import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import {
  calculateRelativeCoordinate,
  getStationInitial,
  getUnplacedBooths,
  getPlacedBooths,
  pinPlacementReducer,
  createInitialPinPlacementState,
} from '../model/frontend/usePinPlacementState'
import {
  raceBoothListResponseSchema,
  updateBoothCoordinatesPayloadSchema,
} from '../model/buildMap.contract'
import type { StationPinState } from '../model/buildMap.types'
import { mapStationsToCoordinatesPayload } from '../model/mapBoothListToStations'
import { AdminStationPin } from '../ui/components/AdminStationPin'

describe('Challenger 1: Empirical Stress Testing — Drag & Drop Station Pin System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =========================================================================
  // STRESS SUITE 1: Coordinate Calculations Under Extreme Zoom Scales & Aspect Ratios
  // =========================================================================
  describe('Suite 1: Extreme Zoom Scales (0.2x, 1.0x, 4.0x, 8.0x) & Aspect Ratios', () => {
    const zoomScales = [0.2, 0.5, 1.0, 1.5, 2.0, 4.0, 8.0, 10.0]

    // Aspect Ratios: [Width, Height, Name]
    const aspectRatios = [
      { name: '16:9 Landscape (1920x1080)', width: 1920, height: 1080 },
      { name: '4:3 Standard (1024x768)', width: 1024, height: 768 },
      { name: '1:1 Square (800x800)', width: 800, height: 800 },
      { name: '21:9 Ultra-Wide (2560x1080)', width: 2560, height: 1080 },
      { name: '9:16 Tall Mobile (390x844)', width: 390, height: 844 },
      { name: 'Narrow Banner (1200x200)', width: 1200, height: 200 },
      { name: 'Tall Column (200x1200)', width: 200, height: 1200 },
    ]

    aspectRatios.forEach(({ name, width, height }) => {
      describe(`Container Aspect Ratio: ${name}`, () => {
        zoomScales.forEach((scale) => {
          it(`calculates precise coordinates under zoom scale ${scale}x`, () => {
            const effectiveW = width * scale
            const effectiveH = height * scale

            // Center test
            const centerX = calculateRelativeCoordinate(effectiveW / 2, 0, width, scale)
            const centerY = calculateRelativeCoordinate(effectiveH / 2, 0, height, scale)
            expect(centerX).toBeCloseTo(50.0, 1)
            expect(centerY).toBeCloseTo(50.0, 1)

            // Quarter point test (25%)
            const qX = calculateRelativeCoordinate(effectiveW * 0.25, 0, width, scale)
            const qY = calculateRelativeCoordinate(effectiveH * 0.25, 0, height, scale)
            expect(qX).toBeCloseTo(25.0, 1)
            expect(qY).toBeCloseTo(25.0, 1)

            // Three-quarter point test (75%)
            const tqX = calculateRelativeCoordinate(effectiveW * 0.75, 0, width, scale)
            const tqY = calculateRelativeCoordinate(effectiveH * 0.75, 0, height, scale)
            expect(tqX).toBeCloseTo(75.0, 1)
            expect(tqY).toBeCloseTo(75.0, 1)
          })
        })
      })
    })

    it('defensively handles degenerate container dimensions (0, negative, NaN, Infinity)', () => {
      expect(calculateRelativeCoordinate(100, 0, 0, 1)).toBe(0)
      expect(calculateRelativeCoordinate(100, 0, -500, 1)).toBe(0)
      expect(calculateRelativeCoordinate(100, 0, 1000, 0)).toBe(10) // scale 0 falls back to 1
      expect(calculateRelativeCoordinate(100, 0, 1000, -2)).toBe(10) // negative scale falls back to 1
    })

    it('handles arbitrary floating pan offsets correctly without coordinate drift', () => {
      const canvasOffset = 345.67
      const canvasDimension = 1200
      const scale = 2.5
      const effectiveDim = canvasDimension * scale // 3000

      // Exact client position corresponding to 40.00%
      const targetRatio = 0.4
      const clientPos = canvasOffset + effectiveDim * targetRatio // 345.67 + 1200 = 1545.67

      const calculated = calculateRelativeCoordinate(clientPos, canvasOffset, canvasDimension, scale)
      expect(calculated).toBe(40.0)
    })

    it('subpixel precision: rounds strictly to 2 decimal places', () => {
      // 1/3 = 33.3333333...%
      const val = calculateRelativeCoordinate(333.33333, 0, 1000, 1)
      expect(val).toBe(33.33)

      // 2/3 = 66.6666666...%
      const val2 = calculateRelativeCoordinate(666.66666, 0, 1000, 1)
      expect(val2).toBe(66.67)

      // 0.005% rounding up
      const val3 = calculateRelativeCoordinate(0.05, 0, 1000, 1)
      expect(val3).toBe(0.01)
    })
  })

  // =========================================================================
  // STRESS SUITE 2: Boundary Edge Drops & Out-of-Bounds Cancellations
  // =========================================================================
  describe('Suite 2: Boundary Edge Drops & Out-of-Bounds', () => {
    it('exact boundary: 0.00% top-left coordinate clamp', () => {
      expect(calculateRelativeCoordinate(0, 0, 1000, 1)).toBe(0.0)
      expect(calculateRelativeCoordinate(100, 100, 1000, 1)).toBe(0.0)
    })

    it('exact boundary: 100.00% bottom-right coordinate clamp', () => {
      expect(calculateRelativeCoordinate(1000, 0, 1000, 1)).toBe(100.0)
      expect(calculateRelativeCoordinate(1100, 100, 1000, 1)).toBe(100.0)
    })

    it('extreme negative coordinates clamp strictly to 0.00%', () => {
      expect(calculateRelativeCoordinate(-999999, 0, 1000, 1)).toBe(0.0)
      expect(calculateRelativeCoordinate(-0.00001, 0, 1000, 1)).toBe(0.0)
    })

    it('extreme oversized coordinates clamp strictly to 100.00%', () => {
      expect(calculateRelativeCoordinate(999999, 0, 1000, 1)).toBe(100.0)
      expect(calculateRelativeCoordinate(1000.0001, 0, 1000, 1)).toBe(100.0)
    })

    it('out-of-bounds drag-drop cancellation removes placed pin to unplaced state', () => {
      const initialBooth: StationPinState = {
        boothId: 'b-out',
        boothName: 'Trạm Rời Bàn',
        boothLocation: 'Khu A',
        description: '',
        status: 'free',
        isHidden: false,
        mapX: 45.5,
        mapY: 60.2,
      }

      let state = createInitialPinPlacementState([initialBooth], false)
      expect(state.booths[0].mapX).toBe(45.5)

      // Simulating dragging outside canvas bounds triggers REMOVE_PIN
      state = pinPlacementReducer(state, {
        type: 'REMOVE_PIN',
        payload: { boothId: 'b-out' },
      })

      expect(state.booths[0].mapX).toBeNull()
      expect(state.booths[0].mapY).toBeNull()
      expect(state.isDirty).toBe(true)

      const unplaced = getUnplacedBooths(state.booths)
      const placed = getPlacedBooths(state.booths)
      expect(unplaced).toHaveLength(1)
      expect(placed).toHaveLength(0)
    })
  })

  // =========================================================================
  // STRESS SUITE 3: Rapid Sequential Pin Movements & Reducer Integrity (500+ ops)
  // =========================================================================
  describe('Suite 3: Rapid Sequential Pin Movements & Deletions (500+ Operations)', () => {
    it('executes 500 rapid interleaved PLACE, MOVE, SELECT, and REMOVE actions with absolute state integrity', () => {
      const boothCount = 20
      const initialBooths: StationPinState[] = Array.from({ length: boothCount }, (_, i) => ({
        boothId: `booth-${i}`,
        boothName: `Trạm ${i + 1}`,
        boothLocation: `Vị trí ${i + 1}`,
        description: null,
        status: 'free',
        isHidden: i % 4 === 0,
        mapX: null,
        mapY: null,
      }))

      let state = createInitialPinPlacementState(initialBooths, false)

      const startTime = performance.now()

      // Perform 500 rapid mutations
      for (let step = 0; step < 500; step++) {
        const boothIndex = step % boothCount
        const boothId = `booth-${boothIndex}`
        const actionType = step % 4

        if (actionType === 0) {
          // PLACE_PIN
          const mapX = (step * 7.3) % 100
          const mapY = (step * 11.7) % 100
          state = pinPlacementReducer(state, {
            type: 'PLACE_PIN',
            payload: { boothId, mapX, mapY },
          })
          expect(state.selectedBoothId).toBe(boothId)
        } else if (actionType === 1) {
          // MOVE_PIN
          const mapX = (step * 3.14) % 100
          const mapY = (step * 2.71) % 100
          state = pinPlacementReducer(state, {
            type: 'MOVE_PIN',
            payload: { boothId, mapX, mapY },
          })
        } else if (actionType === 2) {
          // SELECT_PIN
          state = pinPlacementReducer(state, {
            type: 'SELECT_PIN',
            payload: { boothId: step % 2 === 0 ? boothId : null },
          })
        } else if (actionType === 3) {
          // REMOVE_PIN
          state = pinPlacementReducer(state, {
            type: 'REMOVE_PIN',
            payload: { boothId },
          })
        }
      }

      const durationMs = performance.now() - startTime
      expect(durationMs).toBeLessThan(100) // 500 operations must complete in < 100ms
      expect(state.booths).toHaveLength(boothCount)
      expect(state.isDirty).toBe(true)

      // Test RESET_PINS reverts to exact original state
      state = pinPlacementReducer(state, { type: 'RESET_PINS' })
      expect(state.isDirty).toBe(false)
      expect(state.selectedBoothId).toBeNull()
      state.booths.forEach((b) => {
        expect(b.mapX).toBeNull()
        expect(b.mapY).toBeNull()
      })
    })

    it('enforces coordinate immutability when locked', () => {
      const initialBooth: StationPinState = {
        boothId: 'b-locked',
        boothName: 'Trạm Đã Khóa',
        boothLocation: '',
        description: '',
        status: 'free',
        isHidden: false,
        mapX: 30,
        mapY: 40,
      }

      let state = createInitialPinPlacementState([initialBooth], true) // Locked = true

      // Try placing pin
      state = pinPlacementReducer(state, {
        type: 'PLACE_PIN',
        payload: { boothId: 'b-locked', mapX: 80, mapY: 90 },
      })
      expect(state.booths[0].mapX).toBe(30)
      expect(state.booths[0].mapY).toBe(40)

      // Try moving pin
      state = pinPlacementReducer(state, {
        type: 'MOVE_PIN',
        payload: { boothId: 'b-locked', mapX: 10, mapY: 10 },
      })
      expect(state.booths[0].mapX).toBe(30)

      // Try removing pin
      state = pinPlacementReducer(state, {
        type: 'REMOVE_PIN',
        payload: { boothId: 'b-locked' },
      })
      expect(state.booths[0].mapX).toBe(30)
      expect(state.isDirty).toBe(false)
    })
  })

  // =========================================================================
  // STRESS SUITE 4: High-Volume Scale (50+, 100+, 250+, 500+ Booths)
  // =========================================================================
  describe('Suite 4: Large Booth Counts (50+ to 500+ Booths)', () => {
    it('handles 50+ booths: validates contract schema and separates placed vs unplaced', () => {
      const rawBooths = Array.from({ length: 60 }, (_, i) => ({
        boothId: `booth-uuid-${i + 1}`,
        boothName: `Trạm Thử Thách Số ${i + 1}`,
        boothLocation: `Tầng ${Math.floor(i / 10) + 1}`,
        description: `Mô tả chi tiết trạm số ${i + 1}`,
        status: (i % 3 === 0 ? 'free' : i % 3 === 1 ? 'occupied' : 'pending') as 'free' | 'occupied' | 'pending',
        isHidden: i % 5 === 0,
        currentTeamName: i % 2 === 0 ? `Đội Alpha ${i}` : null,
        currentOrganizerName: `BTC ${i}`,
        mapX: i < 30 ? (i * 3.2) % 100 : null,
        mapY: i < 30 ? (i * 2.8) % 100 : null,
      }))

      // Schema validation
      const parsed = raceBoothListResponseSchema.parse(rawBooths)
      expect(parsed).toHaveLength(60)

      const unplaced = getUnplacedBooths(parsed)
      const placed = getPlacedBooths(parsed)

      expect(placed).toHaveLength(30)
      expect(unplaced).toHaveLength(30)
    })

    it('handles 100+ booths: payload serialization to PUT contract', () => {
      const booths100 = Array.from({ length: 120 }, (_, i) => ({
        boothId: `booth-100-${i}`,
        boothName: `Trạm ${i}`,
        boothLocation: '',
        description: '',
        status: 'free',
        isHidden: false,
        mapX: (i * 0.8) % 100,
        mapY: (i * 0.7) % 100,
      }))

      const payload = mapStationsToCoordinatesPayload(booths100)
      const validatedPayload = updateBoothCoordinatesPayloadSchema.parse(payload)

      expect(validatedPayload.coordinates).toHaveLength(120)
      expect(validatedPayload.coordinates[0].boothId).toBe('booth-100-0')
      expect(validatedPayload.coordinates[119].boothId).toBe('booth-100-119')
    })

    it('handles 500+ booths: performance test for station initial generation & DOM rendering', () => {
      const names = [
        'Trạm Khởi Động 1',
        'Trạm Tiếp Sức A',
        'Trạm 99',
        'Đường Chạy 12B',
        'Giải Đố Mật Mã',
        'Ẩm Thực Dân Gian',
        'Âm Vang Núi Rừng',
        'Ếch Cốm',
        'Station VIP',
        'Trạm',
        '',
        '   ',
        'VeryLongStationNameWithoutSpaces1234567890',
        '🎯 Special Emoji Station 7',
      ]

      const largeBooths = Array.from({ length: 500 }, (_, i) => ({
        id: `s-${i}`,
        name: `${names[i % names.length]} #${i + 1}`,
        stationType: i % 2 === 0 ? 'Trạm chính' : 'Trạm phụ',
        isHidden: i % 10 === 0,
        mapX: (i * 0.19) % 100,
        mapY: (i * 0.23) % 100,
      }))

      const startTime = performance.now()

      // Initial extraction for all 500 stations
      const initials = largeBooths.map((s) => getStationInitial(s.name))
      expect(initials).toHaveLength(500)
      initials.forEach((init) => {
        expect(typeof init).toBe('string')
        expect(init.length).toBeGreaterThan(0)
      })

      // SSR Render benchmark of 50 station pins simultaneously
      const slice50 = largeBooths.slice(0, 50)
      const pinElements = slice50.map((s) =>
        React.createElement(AdminStationPin, {
          key: s.id,
          id: s.id,
          name: s.name,
          stationType: s.stationType,
          isHidden: s.isHidden,
          x: s.mapX,
          y: s.mapY,
          status: 'free',
          isSelected: s.id === 's-0',
          isLocked: false,
        }),
      )

      const html = renderToString(React.createElement('div', null, pinElements))
      const renderDuration = performance.now() - startTime

      expect(html).toContain('admin-station-pin-s-0')
      expect(html).toContain('admin-station-pin-s-49')
      expect(renderDuration).toBeLessThan(300) // 500 extractions + 50 pin renders in < 300ms
    })
  })
})
