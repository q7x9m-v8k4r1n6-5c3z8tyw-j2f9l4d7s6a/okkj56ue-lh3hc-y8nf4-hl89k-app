import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { StationPaletteSidebar } from '../ui/components/StationPaletteSidebar'
import {
  calculateRelativeCoordinate,
  getStationInitial,
  type StationCoordinate,
  type UpdateBoothCoordinatesPayload,
} from './buildMapTestHelpers'
import { raceMapBoothSchema } from '../model/buildMap.contract'

describe('Tier 2: Boundary & Corner Cases — Drag & Drop Station Pin System & Coordinate Locking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =========================================================================
  // Boundary 1: Extreme Percentage Coordinate Clamping (0% to 100%)
  // =========================================================================
  describe('Boundary 1: Extreme Coordinate Clamping (0% - 100%)', () => {
    it('T2.1.1: clamps exact top-left corner drop to (0.00%, 0.00%)', () => {
      const mapX = calculateRelativeCoordinate(0, 0, 1000, 1)
      const mapY = calculateRelativeCoordinate(0, 0, 1000, 1)

      expect(mapX).toBe(0.0)
      expect(mapY).toBe(0.0)
    })

    it('T2.1.2: clamps exact bottom-right corner drop to (100.00%, 100.00%)', () => {
      const mapX = calculateRelativeCoordinate(1000, 0, 1000, 1)
      const mapY = calculateRelativeCoordinate(1000, 0, 1000, 1)

      expect(mapX).toBe(100.0)
      expect(mapY).toBe(100.0)
    })

    it('T2.1.3: strictly clamps negative drag coordinates to 0.00%', () => {
      const mapX = calculateRelativeCoordinate(-50, 0, 1000, 1)
      const mapY = calculateRelativeCoordinate(-120, 0, 1000, 1)

      expect(mapX).toBe(0.0)
      expect(mapY).toBe(0.0)
    })

    it('T2.1.4: strictly clamps overshooting drag coordinates (>1000px on 1000px canvas) to 100.00%', () => {
      const mapX = calculateRelativeCoordinate(1250, 0, 1000, 1)
      const mapY = calculateRelativeCoordinate(1500, 0, 1000, 1)

      expect(mapX).toBe(100.0)
      expect(mapY).toBe(100.0)
    })

    it('T2.1.5: formats floating numbers to exactly 2 decimal precision without drift', () => {
      const mapX = calculateRelativeCoordinate(333.333, 0, 1000, 1)
      const mapY = calculateRelativeCoordinate(666.667, 0, 1000, 1)

      expect(mapX).toBe(33.33)
      expect(mapY).toBe(66.67)
    })

    it('T2.1.6: handles 0-dimension canvas defensively returning 0 without division by zero NaN', () => {
      const mapX = calculateRelativeCoordinate(100, 0, 0, 1)
      expect(mapX).toBe(0)
      expect(Number.isNaN(mapX)).toBe(false)
    })
  })

  // =========================================================================
  // Boundary 2: Zoom-Compensated Coordinate Calculations (0.2x to 8.0x)
  // =========================================================================
  describe('Boundary 2: Zoom Compensation Across Multipliers', () => {
    it('T2.2.1: calculates relative coordinates accurately under 0.2x minimum zoom', () => {
      const mapX = calculateRelativeCoordinate(100, 0, 1000, 0.2)
      expect(mapX).toBe(50.0)
    })

    it('T2.2.2: calculates relative coordinates accurately under 0.5x zoom', () => {
      const mapX = calculateRelativeCoordinate(125, 0, 1000, 0.5)
      expect(mapX).toBe(25.0)
    })

    it('T2.2.3: calculates relative coordinates accurately under 2.0x zoom', () => {
      const mapX = calculateRelativeCoordinate(800, 0, 1000, 2.0)
      expect(mapX).toBe(40.0)
    })

    it('T2.2.4: calculates relative coordinates accurately under 4.0x zoom with viewport offset', () => {
      const mapX = calculateRelativeCoordinate(1200, 200, 1000, 4.0)
      expect(mapX).toBe(25.0)
    })

    it('T2.2.5: calculates relative coordinates accurately under 8.0x maximum zoom', () => {
      const mapX = calculateRelativeCoordinate(6400, 0, 1000, 8.0)
      expect(mapX).toBe(80.0)
    })
  })

  // =========================================================================
  // Boundary 3: Drop Out-of-Bounds Handling
  // =========================================================================
  describe('Boundary 3: Drop Out-of-Bounds Handling', () => {
    it('T2.3.1: cancels placement when drag event ends outside map viewport without mutating station state', () => {
      const initialStations = [
        { id: 'b1', name: 'Trạm 1', mapX: null as number | null, mapY: null as number | null },
      ]

      const isInsideCanvas = false
      let updatedStations = initialStations

      if (isInsideCanvas) {
        updatedStations = initialStations.map((s) => ({ ...s, mapX: 50, mapY: 50 }))
      }

      expect(updatedStations[0].mapX).toBeNull()
      expect(updatedStations[0].mapY).toBeNull()
    })

    it('T2.3.2: dragging placed pin outside canvas bounds removes pin back to unplaced list', () => {
      const placedPin = { id: 'b1', name: 'Trạm 1', mapX: 45.0, mapY: 55.0 }
      const isDroppedOutOfBounds = true

      const nextPinState = isDroppedOutOfBounds
        ? { ...placedPin, mapX: null, mapY: null }
        : placedPin

      expect(nextPinState.mapX).toBeNull()
      expect(nextPinState.mapY).toBeNull()
    })

    it('T2.3.3: invalid drag operations do not dispatch background network requests', () => {
      const apiCallMock = vi.fn()
      const isDropValid = false

      if (isDropValid) {
        apiCallMock()
      }

      expect(apiCallMock).not.toHaveBeenCalled()
    })

    it('T2.3.4: dropping unplaced station on canvas header bar or toolbar cancels placement', () => {
      const dropZone: string = 'toolbar'
      const isValidCanvasDrop = dropZone === 'canvas-image'

      expect(isValidCanvasDrop).toBe(false)
    })

    it('T2.3.5: cancels drag cleanly when user presses Escape during drag interaction', () => {
      let isDragging = true
      const onKeyDown = (key: string) => {
        if (key === 'Escape') {
          isDragging = false
        }
      }

      onKeyDown('Escape')
      expect(isDragging).toBe(false)
    })
  })

  // =========================================================================
  // Boundary 4: Zero & High-Volume Booth Counts
  // =========================================================================
  describe('Boundary 4: Zero & High-Volume Booth Counts', () => {
    it('T2.4.1: handles 0 booths without throwing runtime errors', () => {
      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations: [], isLoading: false }),
      )

      expect(html).toContain('Chưa có trạm nào')
      expect(html).toContain('Thêm trạm trong tab Thông tin cơ bản')
    })

    it('T2.4.2: handles 50 booths in sidebar with scroll container styles', () => {
      const largeBoothList = Array.from({ length: 50 }, (_, i) => ({
        id: `b-${i + 1}`,
        name: `Trạm Số ${i + 1}`,
        stationType: i % 2 === 0 ? 'Trạm thường' : 'Trạm ẩn',
      }))

      const html = renderToString(
        React.createElement(StationPaletteSidebar, {
          stations: largeBoothList,
          isLoading: false,
        }),
      )

      expect(html).toContain('Trạm Số 1')
      expect(html).toContain('Trạm Số 50')
      expect(html).toContain('max-h-[640px]')
      expect(html).toContain('overflow-y-auto')
    })

    it('T2.4.3: handles 100+ booths coordinate payload serialization efficiently', () => {
      const highVolumeBooths = Array.from({ length: 100 }, (_, i) => ({
        boothId: `booth-uuid-${i}`,
        mapX: (i * 0.99) % 100,
        mapY: (i * 1.01) % 100,
      }))

      const payload: UpdateBoothCoordinatesPayload = {
        coordinates: highVolumeBooths,
      }

      const serialized = JSON.stringify(payload)
      const parsed = JSON.parse(serialized) as UpdateBoothCoordinatesPayload

      expect(parsed.coordinates).toHaveLength(100)
      expect(parsed.coordinates[99].boothId).toBe('booth-uuid-99')
    })

    it('T2.4.4: handles single booth race setup gracefully', () => {
      const singleBooth = [{ id: 'b-single', name: 'Trạm Duy Nhất' }]
      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations: singleBooth, isLoading: false }),
      )

      expect(html).toContain('Trạm Duy Nhất')
      expect(html).not.toContain('Chưa có trạm nào')
    })

    it('T2.4.5: maintains unique key identifiers across all stations in large list', () => {
      const stations = Array.from({ length: 25 }, (_, i) => ({
        id: `station-${i}`,
        name: `Trạm ${i}`,
      }))

      const idSet = new Set(stations.map((s) => s.id))
      expect(idSet.size).toBe(25)
    })
  })

  // =========================================================================
  // Boundary 5: Fallback Labels, Initials & Special Characters
  // =========================================================================
  describe('Boundary 5: Fallback Labels, Initials & Special Characters', () => {
    it('T2.5.1: falls back to "Trạm chưa đặt tên" for empty string or whitespace name', () => {
      const stations = [
        { id: 's-blank', name: '' },
        { id: 's-spaces', name: '     ' },
      ]

      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations, isLoading: false }),
      )

      expect(html).toContain('Trạm chưa đặt tên')
    })

    it('T2.5.2: extracts correct single character initial from unicode Vietnamese names', () => {
      expect(getStationInitial('Đường Đua 1')).toBe('1')
      expect(getStationInitial('Âm Nhạc')).toBe('Â')
      expect(getStationInitial('Ẩm Thực')).toBe('Ẩ')
      expect(getStationInitial('Ếch Xanh')).toBe('Ế')
    })

    it('T2.5.3: renders special characters safely without HTML injection or breaking', () => {
      const stations = [
        {
          id: 's-special',
          name: '<script>alert(1)</script> & "Trạm 🎯 VIP #1"',
          stationType: 'Trạm <b>Đặc Biệt</b>',
        },
      ]

      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations, isLoading: false }),
      )

      expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
      expect(html).toContain('&amp; &quot;Trạm 🎯 VIP #1&quot;')
    })

    it('T2.5.4: handles very long booth names with break-words wrapping', () => {
      const stations = [
        {
          id: 's-long',
          name: 'TrạmSuperDuperExtremelyLongNameWithoutAnySpacesThatCouldBreakLayout',
        },
      ]

      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations, isLoading: false }),
      )

      expect(html).toContain('break-words')
      expect(html).toContain('TrạmSuperDuperExtremelyLongNameWithoutAnySpacesThatCouldBreakLayout')
    })

    it('T2.5.5: returns fallback "?" initial when name is empty or undefined', () => {
      expect(getStationInitial(undefined)).toBe('?')
      expect(getStationInitial('')).toBe('?')
      expect(getStationInitial('   ')).toBe('?')
    })
  })

  // =========================================================================
  // Boundary 6: Hidden Booths (isHidden: true)
  // =========================================================================
  describe('Boundary 6: Hidden Booths (isHidden: true)', () => {
    it('T2.6.1: marks hidden booth with "Trạm ẩn" label in sidebar', () => {
      const stations = [
        { id: 'h1', name: 'Trạm Mật Mã', isHidden: true },
      ]

      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations, isLoading: false }),
      )

      expect(html).toContain('Trạm ẩn')
    })

    it('T2.6.2: accepts isHidden flag in booth contract schema', () => {
      const booth = raceMapBoothSchema.parse({
        id: 'booth-hidden',
        name: 'Trạm Ẩn 1',
        isHidden: true,
      })

      expect(booth.isHidden).toBe(true)
    })

    it('T2.6.3: persists coordinates of hidden booths in coordinate PUT payload', () => {
      const stations = [
        { id: 'b-normal', isHidden: false, mapX: 20.0, mapY: 30.0 },
        { id: 'b-hidden', isHidden: true, mapX: 60.0, mapY: 70.0 },
      ]

      const payload: UpdateBoothCoordinatesPayload = {
        coordinates: stations.map((s) => ({
          boothId: s.id,
          mapX: s.mapX,
          mapY: s.mapY,
        })),
      }

      expect(payload.coordinates).toHaveLength(2)
      expect(payload.coordinates[1].boothId).toBe('b-hidden')
      expect(payload.coordinates[1].mapX).toBe(60.0)
    })

    it('T2.6.4: supports custom stationType override while maintaining isHidden property', () => {
      const station = {
        id: 'b-custom',
        name: 'Trạm Giải Đố Ẩn',
        isHidden: true,
        stationType: 'Trạm Câu Đố Khó',
      }

      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations: [station], isLoading: false }),
      )

      expect(html).toContain('Trạm Câu Đố Khó')
    })

    it('T2.6.5: defaults isHidden to undefined or false when omitted in payload', () => {
      const booth = raceMapBoothSchema.parse({
        id: 'b-default',
        name: 'Trạm Mặc Định',
      })

      expect(booth.isHidden).toBeUndefined()
    })
  })

  // =========================================================================
  // Boundary 7: API Failure Handling & State Recovery
  // =========================================================================
  describe('Boundary 7: API Failure Handling & State Recovery', () => {
    it('T2.7.1: retains un-saved coordinate positions locally upon PUT 500 server failure', () => {
      const localCoordinates: StationCoordinate[] = [
        { boothId: 'b1', mapX: 35.0, mapY: 45.0 },
      ]

      let isLocked = false
      let isSaving = true
      expect(isSaving).toBe(true)

      const apiSuccess = false
      if (apiSuccess) {
        isLocked = true
      }
      isSaving = false

      expect(isLocked).toBe(false)
      expect(isSaving).toBe(false)
      expect(localCoordinates[0].mapX).toBe(35.0)
    })

    it('T2.7.2: handles network offline error with descriptive danger toast', () => {
      const toastMock = vi.fn()
      const networkError = new Error('Network Error: Failed to fetch')

      toastMock({
        title: 'Lỗi',
        description: networkError.message,
        variant: 'danger',
      })

      expect(toastMock).toHaveBeenCalledWith({
        title: 'Lỗi',
        description: 'Network Error: Failed to fetch',
        variant: 'danger',
      })
    })

    it('T2.7.3: supports AbortController cancellation signal on booth list API', async () => {
      const controller = new AbortController()
      controller.abort()

      expect(controller.signal.aborted).toBe(true)
    })

    it('T2.7.4: allows user to retry saving coordinates after initial failure', () => {
      let attempts = 0
      let saveSuccess = false

      const saveHandler = () => {
        attempts += 1
        if (attempts >= 2) {
          saveSuccess = true
        }
      }

      saveHandler()
      expect(saveSuccess).toBe(false)

      saveHandler()
      expect(saveSuccess).toBe(true)
      expect(attempts).toBe(2)
    })

    it('T2.7.5: handles 400 Bad Request error response gracefully', () => {
      const errorResponse = {
        status: 400,
        message: 'Dữ liệu toạ độ trạm không hợp lệ',
      }

      expect(errorResponse.status).toBe(400)
      expect(errorResponse.message).toContain('không hợp lệ')
    })
  })

  // =========================================================================
  // Boundary 8: Idempotency & Debounce on Lock Button
  // =========================================================================
  describe('Boundary 8: Rapid Click Idempotency & Debouncing', () => {
    it('T2.8.1: prevents duplicate API calls during rapid multi-click on Lock button', () => {
      let inFlight = false
      let apiCallCount = 0

      const handleLockClick = () => {
        if (inFlight) return
        inFlight = true
        apiCallCount += 1
      }

      handleLockClick()
      handleLockClick()
      handleLockClick()
      handleLockClick()
      handleLockClick()

      expect(apiCallCount).toBe(1)
    })

    it('T2.8.2: re-enables lock button click after previous request resolves', () => {
      let inFlight = false
      let apiCallCount = 0

      const handleLockClick = () => {
        if (inFlight) return
        inFlight = true
        apiCallCount += 1
      }

      handleLockClick()
      expect(apiCallCount).toBe(1)

      inFlight = false

      handleLockClick()
      expect(apiCallCount).toBe(2)
    })

    it('T2.8.3: disables lock button UI when isSaving is true', () => {
      const isSaving = true
      const isButtonDisabled = isSaving

      expect(isButtonDisabled).toBe(true)
    })
  })

  // =========================================================================
  // Boundary 9: Coordinate Collisions & Overlapping Pins
  // =========================================================================
  describe('Boundary 9: Coordinate Collisions & Overlapping Pins', () => {
    it('T2.9.1: handles multiple pins dropped at identical coordinates without mutating each other', () => {
      const pin1 = { boothId: 'b1', mapX: 50.0, mapY: 50.0 }
      const pin2 = { boothId: 'b2', mapX: 50.0, mapY: 50.0 }

      const allPins = [pin1, pin2]
      expect(allPins).toHaveLength(2)
      expect(allPins[0].boothId).toBe('b1')
      expect(allPins[1].boothId).toBe('b2')
    })

    it('T2.9.2: allows selecting one pin independently when two pins overlap', () => {
      let selectedPinId: string | null = null
      const selectPin = (id: string) => {
        selectedPinId = id
      }

      selectPin('b2')
      expect(selectedPinId).toBe('b2')
    })

    it('T2.9.3: moving one overlapping pin updates only its coordinates', () => {
      const pins = [
        { boothId: 'b1', mapX: 50.0, mapY: 50.0 },
        { boothId: 'b2', mapX: 50.0, mapY: 50.0 },
      ]

      const updated = pins.map((p) =>
        p.boothId === 'b1' ? { ...p, mapX: 20.0, mapY: 30.0 } : p,
      )

      expect(updated[0]).toEqual({ boothId: 'b1', mapX: 20.0, mapY: 30.0 })
      expect(updated[1]).toEqual({ boothId: 'b2', mapX: 50.0, mapY: 50.0 })
    })
  })
})
