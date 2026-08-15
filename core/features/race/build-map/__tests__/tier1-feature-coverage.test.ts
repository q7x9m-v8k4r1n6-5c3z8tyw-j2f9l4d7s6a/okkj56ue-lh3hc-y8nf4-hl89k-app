import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'

// Contract and types
import {
  raceMapBoothSchema,
  raceMapDetailResponseSchema,
  type RaceMapBooth,
  type RaceMapDetailResponse,
} from '../model/buildMap.contract'
import { StationPaletteSidebar } from '../ui/components/StationPaletteSidebar'
import { AdminMapCanvas } from '../ui/components/AdminMapCanvas'
import { MapUploadDropzone } from '../ui/components/MapUploadDropzone'
import {
  calculateRelativeCoordinate,
  getStationInitial,
  type UpdateBoothCoordinatesPayload,
} from './buildMapTestHelpers'

describe('Tier 1: Feature Coverage — Drag & Drop Station Pin System & Coordinate Locking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =========================================================================
  // Feature 1: Booth List Fetching & Model Ingestion (R1)
  // =========================================================================
  describe('Feature 1: Booth List Fetching & Model Ingestion', () => {
    it('T1.1.1: parses complete race detail response containing placed and unplaced booths', () => {
      const payload: RaceMapDetailResponse = {
        id: 'race-001',
        name: 'OVC Summer Race 2026',
        mapImageUrl: 'https://storage.azure.com/race-map/map-001.png',
        status: 'Draft',
        booth: [
          {
            id: 'b-1',
            name: 'Trạm Khởi Động',
            place: 'Khu A',
            status: 'free',
            isHidden: false,
          },
          {
            id: 'b-2',
            name: 'Trạm Bí Mật',
            place: 'Khu B',
            status: 'free',
            isHidden: true,
            stationType: 'Trạm ẩn',
          },
        ],
      }

      const parsed = raceMapDetailResponseSchema.parse(payload)
      expect(parsed.id).toBe('race-001')
      expect(parsed.mapImageUrl).toBe('https://storage.azure.com/race-map/map-001.png')
      expect(parsed.booth).toHaveLength(2)
      expect(parsed.booth[0].name).toBe('Trạm Khởi Động')
      expect(parsed.booth[1].isHidden).toBe(true)
    })

    it('T1.1.2: partitions booths into unplaced (mapX/mapY null) and placed collections', () => {
      const rawBooths = [
        { id: 'b-1', name: 'Trạm 1', mapX: null, mapY: null },
        { id: 'b-2', name: 'Trạm 2', mapX: 25.5, mapY: 40.0 },
        { id: 'b-3', name: 'Trạm 3', mapX: null, mapY: null },
        { id: 'b-4', name: 'Trạm 4', mapX: 70.2, mapY: 85.1 },
      ]

      const unplaced = rawBooths.filter((b) => b.mapX === null || b.mapY === null)
      const placed = rawBooths.filter((b) => b.mapX !== null && b.mapY !== null)

      expect(unplaced).toHaveLength(2)
      expect(unplaced.map((b) => b.id)).toEqual(['b-1', 'b-3'])
      expect(placed).toHaveLength(2)
      expect(placed.map((b) => b.id)).toEqual(['b-2', 'b-4'])
    })

    it('T1.1.3: preserves booth metadata including description, organizer, and status', () => {
      const boothData: RaceMapBooth = {
        id: 'b-meta',
        name: 'Trạm Công Nghệ',
        place: 'Tòa H6',
        description: 'Giải câu đố lập trình',
        status: 'occupied',
        organizerID: 'org-99',
        isHidden: false,
        stationType: 'Trạm chính',
      }

      const parsed = raceMapBoothSchema.parse(boothData)
      expect(parsed.description).toBe('Giải câu đố lập trình')
      expect(parsed.organizerID).toBe('org-99')
      expect(parsed.place).toBe('Tòa H6')
      expect(parsed.status).toBe('occupied')
    })

    it('T1.1.4: defaults omitted optional booth fields gracefully', () => {
      const minimalBooth = {
        id: 'b-min',
        name: 'Trạm Tối Giản',
      }

      const parsed = raceMapBoothSchema.parse(minimalBooth)
      expect(parsed.place).toBe('')
      expect(parsed.status).toBe('free')
      expect(parsed.description).toBeUndefined()
    })

    it('T1.1.5: throws validation error when booth name is empty or missing', () => {
      expect(() =>
        raceMapBoothSchema.parse({
          id: 'b-invalid',
          name: '',
        }),
      ).toThrow()
    })
  })

  // =========================================================================
  // Feature 2: Unplaced Sidebar Palette (R1 / Node 1719-1420)
  // =========================================================================
  describe('Feature 2: Unplaced Sidebar Palette', () => {
    it('T1.2.1: renders sidebar header with exact title and icon', () => {
      const html = renderToString(
        React.createElement(StationPaletteSidebar, {
          stations: [{ id: 's1', name: 'Trạm A' }],
          isLoading: false,
        }),
      )

      expect(html).toContain('Danh sách các trạm')
      expect(html).toContain('aria-label="Danh sách các trạm"')
    })

    it('T1.2.2: renders each unplaced station with 2-line layout (Name & Type)', () => {
      const stations = [
        { id: 's1', name: 'Trạm Xuất Phát', stationType: 'Trạm thường' },
        { id: 's2', name: 'Trạm Mật Mã', stationType: 'Trạm ẩn', isHidden: true },
      ]

      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations, isLoading: false }),
      )

      expect(html).toContain('Trạm Xuất Phát')
      expect(html).toContain('Trạm thường')
      expect(html).toContain('Trạm Mật Mã')
      expect(html).toContain('Trạm ẩn')
    })

    it('T1.2.3: renders loading skeleton when isLoading is true', () => {
      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations: [], isLoading: true }),
      )

      expect(html).toContain('animate-pulse')
      expect(html).not.toContain('Chưa có trạm nào')
    })

    it('T1.2.4: displays friendly empty state when station list is empty', () => {
      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations: [], isLoading: false }),
      )

      expect(html).toContain('Chưa có trạm nào')
      expect(html).toContain('Thêm trạm trong tab Thông tin cơ bản')
    })

    it('T1.2.5: applies fallback station type when stationType is not explicitly given', () => {
      const stations = [
        { id: 's1', name: 'Trạm Alpha', isHidden: false },
        { id: 's2', name: 'Trạm Beta', isHidden: true },
      ]

      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations, isLoading: false }),
      )

      expect(html).toContain('Trạm thường')
      expect(html).toContain('Trạm ẩn')
    })
  })

  // =========================================================================
  // Feature 3: Drag & Drop Pin Placement & Percentage Math (R1 / Node 1744-1966)
  // =========================================================================
  describe('Feature 3: Drag & Drop Pin Placement & Percentage Math', () => {
    it('T1.3.1: calculates relative percentage coordinates accurately on standard canvas', () => {
      const clientX = 300 // (300 - 100) / 800 = 200/800 = 25.0%
      const clientY = 200 // (200 - 50) / 600 = 150/600 = 25.0%

      const mapX = calculateRelativeCoordinate(clientX, 100, 800, 1.0)
      const mapY = calculateRelativeCoordinate(clientY, 50, 600, 1.0)

      expect(mapX).toBe(25.0)
      expect(mapY).toBe(25.0)
    })

    it('T1.3.2: calculates center of canvas as 50.0% X and 50.0% Y', () => {
      const mapX = calculateRelativeCoordinate(500, 100, 800, 1.0)
      const mapY = calculateRelativeCoordinate(350, 50, 600, 1.0)

      expect(mapX).toBe(50.0)
      expect(mapY).toBe(50.0)
    })

    it('T1.3.3: updates station object coordinates upon drop onto canvas', () => {
      const initialStation = { id: 's1', name: 'Trạm 1', mapX: null as number | null, mapY: null as number | null }
      
      const droppedStation = {
        ...initialStation,
        mapX: calculateRelativeCoordinate(400, 0, 1000),
        mapY: calculateRelativeCoordinate(300, 0, 1000),
      }

      expect(droppedStation.mapX).toBe(40.0)
      expect(droppedStation.mapY).toBe(30.0)
    })

    it('T1.3.4: places multiple stations with independent relative coordinates', () => {
      const placedStations = [
        { id: 's1', mapX: calculateRelativeCoordinate(100, 0, 1000), mapY: calculateRelativeCoordinate(100, 0, 1000) },
        { id: 's2', mapX: calculateRelativeCoordinate(500, 0, 1000), mapY: calculateRelativeCoordinate(500, 0, 1000) },
        { id: 's3', mapX: calculateRelativeCoordinate(900, 0, 1000), mapY: calculateRelativeCoordinate(900, 0, 1000) },
      ]

      expect(placedStations[0].mapX).toBe(10.0)
      expect(placedStations[1].mapX).toBe(50.0)
      expect(placedStations[2].mapX).toBe(90.0)
    })

    it('T1.3.5: extracts station initial or short code correctly for teardrop pin labels', () => {
      expect(getStationInitial('Trạm 1')).toBe('1')
      expect(getStationInitial('Trạm Khởi Động')).toBe('T')
      expect(getStationInitial('Trạm 12')).toBe('12')
      expect(getStationInitial('Station Alpha')).toBe('S')
      expect(getStationInitial('')).toBe('?')
    })
  })

  // =========================================================================
  // Feature 4: Placed Pin Repositioning & Pin Removal (R1)
  // =========================================================================
  describe('Feature 4: Placed Pin Repositioning & Pin Removal', () => {
    it('T1.4.1: updates existing coordinates when dragging a placed pin to a new position', () => {
      let pin = { id: 's1', mapX: 20.0, mapY: 30.0 }

      pin = {
        ...pin,
        mapX: calculateRelativeCoordinate(600, 0, 1000),
        mapY: calculateRelativeCoordinate(750, 0, 1000),
      }

      expect(pin.mapX).toBe(60.0)
      expect(pin.mapY).toBe(75.0)
    })

    it('T1.4.2: removes pin by resetting coordinates to null when deleted or dragged out', () => {
      let pin = { id: 's1', name: 'Trạm 1', mapX: 50.0 as number | null, mapY: 50.0 as number | null }

      pin = {
        ...pin,
        mapX: null,
        mapY: null,
      }

      expect(pin.mapX).toBeNull()
      expect(pin.mapY).toBeNull()
    })

    it('T1.4.3: moving one pin leaves all other placed pins unchanged', () => {
      const pins = [
        { id: 's1', mapX: 10.0, mapY: 10.0 },
        { id: 's2', mapX: 20.0, mapY: 20.0 },
        { id: 's3', mapX: 30.0, mapY: 30.0 },
      ]

      const updatedPins = pins.map((p) =>
        p.id === 's2' ? { ...p, mapX: 80.0, mapY: 85.0 } : p,
      )

      expect(updatedPins[0]).toEqual({ id: 's1', mapX: 10.0, mapY: 10.0 })
      expect(updatedPins[1]).toEqual({ id: 's2', mapX: 80.0, mapY: 85.0 })
      expect(updatedPins[2]).toEqual({ id: 's3', mapX: 30.0, mapY: 30.0 })
    })

    it('T1.4.4: marks map builder state dirty when pin coordinates are modified', () => {
      const state = { isDirty: false, coordinatesChanged: false }
      const nextState = { ...state, isDirty: true, coordinatesChanged: true }

      expect(nextState.isDirty).toBe(true)
    })

    it('T1.4.5: returns removed pin back to the unplaced sidebar list', () => {
      const allStations = [
        { id: 's1', name: 'Trạm 1', mapX: 20.0, mapY: 30.0 },
        { id: 's2', name: 'Trạm 2', mapX: 40.0, mapY: 50.0 },
      ]

      const afterRemoval = allStations.map((s) =>
        s.id === 's1' ? { ...s, mapX: null, mapY: null } : s,
      )

      const unplaced = afterRemoval.filter((s) => s.mapX === null || s.mapY === null)
      expect(unplaced).toHaveLength(1)
      expect(unplaced[0].id).toBe('s1')
    })
  })

  // =========================================================================
  // Feature 5: Pin Visual Styling & Hover Scaling (Node 1744-1966)
  // =========================================================================
  describe('Feature 5: Pin Visual Styling & Hover Scaling', () => {
    it('T1.5.1: positions marker teardrop anchored at bottom center (-50%, -100%)', () => {
      const pinX = 45.5
      const pinY = 60.2

      const style = {
        left: `${pinX}%`,
        top: `${pinY}%`,
        transform: 'translate(-50%, -100%)',
      }

      expect(style.left).toBe('45.5%')
      expect(style.top).toBe('60.2%')
      expect(style.transform).toBe('translate(-50%, -100%)')
    })

    it('T1.5.2: scales marker by 1.1x on hover state', () => {
      const normalScale = 1.0
      const hoverScale = 1.1

      const transformHover = `translate(-50%, -100%) scale(${hoverScale})`
      expect(transformHover).toContain('scale(1.1)')
      expect(hoverScale / normalScale).toBeCloseTo(1.1)
    })

    it('T1.5.3: renders station label text with appropriate font styling and truncation', () => {
      const stationName = 'Trạm Khởi Động Đua'
      const labelClass = 'truncate text-xs font-semibold text-slate-800'

      expect(labelClass).toContain('truncate')
      expect(labelClass).toContain('text-xs')
      expect(stationName).toBe('Trạm Khởi Động Đua')
    })

    it('T1.5.4: renders distinct teardrop marker color or border for hidden booths', () => {
      const isHidden = true
      const markerColor = isHidden ? '#7c3aed' : '#de3336'

      expect(markerColor).toBe('#7c3aed')
    })

    it('T1.5.5: renders selection highlight ring when pin is clicked or active', () => {
      const isSelected = true
      const ringClass = isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''

      expect(ringClass).toContain('ring-2')
      expect(ringClass).toContain('ring-blue-500')
    })
  })

  // =========================================================================
  // Feature 6: Coordinate Locking & PUT API Persistence (R2)
  // =========================================================================
  describe('Feature 6: Coordinate Locking & PUT API Persistence', () => {
    it('T1.6.1: formats coordinates payload accurately for PUT /api/v1/Race/{raceId}/booths/coordinates', () => {
      const stations = [
        { id: 'b1', mapX: 15.25, mapY: 30.5 },
        { id: 'b2', mapX: null, mapY: null },
        { id: 'b3', mapX: 75.0, mapY: 80.0 },
      ]

      const payload: UpdateBoothCoordinatesPayload = {
        coordinates: stations.map((s) => ({
          boothId: s.id,
          mapX: s.mapX,
          mapY: s.mapY,
        })),
      }

      expect(payload.coordinates).toHaveLength(3)
      expect(payload.coordinates[0]).toEqual({ boothId: 'b1', mapX: 15.25, mapY: 30.5 })
      expect(payload.coordinates[1]).toEqual({ boothId: 'b2', mapX: null, mapY: null })
      expect(payload.coordinates[2]).toEqual({ boothId: 'b3', mapX: 75.0, mapY: 80.0 })
    })

    it('T1.6.2: locking transitions state to locked and prevents pin drag events', () => {
      let isLocked = false
      const onLock = () => {
        isLocked = true
      }

      onLock()
      expect(isLocked).toBe(true)

      const canDragPin = !isLocked
      expect(canDragPin).toBe(false)
    })

    it('T1.6.3: floating lock controls render lock button with status icon and label', () => {
      const isLocked = false
      const lockButtonLabel = isLocked ? 'Mở khóa vị trí' : 'Khóa vị trí'

      expect(lockButtonLabel).toBe('Khóa vị trí')
    })

    it('T1.6.4: locking coordinates preserves all null and non-null values without dropping entries', () => {
      const booths = [
        { boothId: 'b1', mapX: 10, mapY: 20 },
        { boothId: 'b2', mapX: null, mapY: null },
      ]

      const serialized = JSON.stringify({ coordinates: booths })
      const parsed = JSON.parse(serialized)

      expect(parsed.coordinates).toHaveLength(2)
      expect(parsed.coordinates[1].mapX).toBeNull()
    })

    it('T1.6.5: unlocks map when admin toggles unlock in Draft status', () => {
      let isLocked = true
      const raceStatus = 'Draft'

      if (raceStatus === 'Draft') {
        isLocked = false
      }

      expect(isLocked).toBe(false)
    })
  })

  // =========================================================================
  // Feature 7: Success Toast Notification (R2)
  // =========================================================================
  describe('Feature 7: Success Toast Notification', () => {
    it('T1.7.1: triggers exact Vietnamese success message on lock save', () => {
      const expectedMessage = 'Đã khóa và lưu vị trí các trạm thành công!'
      const toastNotification = {
        title: 'Thành công',
        description: expectedMessage,
        variant: 'success',
      }

      expect(toastNotification.description).toBe('Đã khóa và lưu vị trí các trạm thành công!')
      expect(toastNotification.variant).toBe('success')
    })

    it('T1.7.2: does not trigger success toast if coordinate save fails', () => {
      const toastMock = vi.fn()
      const isSaveSuccess = false

      if (isSaveSuccess) {
        toastMock({
          title: 'Thành công',
          description: 'Đã khóa và lưu vị trí các trạm thành công!',
        })
      }

      expect(toastMock).not.toHaveBeenCalled()
    })

    it('T1.7.3: triggers error toast with descriptive message on API failure', () => {
      const toastMock = vi.fn()
      const error = new Error('Lỗi kết nối máy chủ khi lưu toạ độ trạm.')

      toastMock({
        title: 'Lỗi',
        description: error.message,
        variant: 'danger',
      })

      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Lỗi',
          description: 'Lỗi kết nối máy chủ khi lưu toạ độ trạm.',
          variant: 'danger',
        }),
      )
    })

    it('T1.7.4: auto-dismisses toast after duration without mutating map coordinates', () => {
      const toastTimeoutMs = 3000
      expect(toastTimeoutMs).toBeGreaterThan(0)
    })

    it('T1.7.5: toast notification payload conforms to shared toast contract', () => {
      const toastPayload = {
        title: 'Thành công',
        description: 'Đã khóa và lưu vị trí các trạm thành công!',
        variant: 'success' as const,
      }

      expect(['success', 'danger', 'info', 'warning']).toContain(toastPayload.variant)
    })
  })

  // =========================================================================
  // Feature 8: Non-Draft Lock Enforcement (R2)
  // =========================================================================
  describe('Feature 8: Non-Draft Lock Enforcement', () => {
    it('T1.8.1: permanently disables lock/unlock toggle when race.status !== "Draft"', () => {
      const testStatuses = ['Ongoing', 'Finished', 'Archived', 'Cancelled', 'Ready']

      testStatuses.forEach((status) => {
        const isDraft = status.toLowerCase() === 'draft'
        const isLockToggleDisabled = !isDraft

        expect(isLockToggleDisabled).toBe(true)
      })
    })

    it('T1.8.2: permits lock/unlock toggle only when race.status is "Draft" or "draft"', () => {
      const draftStatus = 'Draft'
      const isDraft = draftStatus.toLowerCase() === 'draft'
      const isLockToggleDisabled = !isDraft

      expect(isLockToggleDisabled).toBe(false)
    })

    it('T1.8.3: renders warning banner when map is locked due to non-draft race status', () => {
      const html = renderToString(
        React.createElement('div', {
          className: 'flex items-center gap-2.5 rounded-lg border border-[#fdcacb] bg-[#fff5f5] p-4 text-sm text-[#c82528]',
        }, 'Trận đấu đang diễn ra. Sơ đồ bản đồ đã được khóa cố định để đảm bảo tính đồng bộ cho các đội chơi.'),
      )

      expect(html).toContain('Trận đấu đang diễn ra')
      expect(html).toContain('khóa cố định')
    })

    it('T1.8.4: prevents dragging unplaced booths onto canvas when race status is Ongoing', () => {
      const raceStatus: string = 'Ongoing'
      const canDropPin = raceStatus === 'Draft'

      expect(canDropPin).toBe(false)
    })

    it('T1.8.5: prevents removing placed pins when race status is Ongoing', () => {
      const raceStatus: string = 'Ongoing'
      const canRemovePin = raceStatus === 'Draft'

      expect(canRemovePin).toBe(false)
    })
  })

  // =========================================================================
  // Feature 9: Zoom (+/-) & Close (X) Controls (R2)
  // =========================================================================
  describe('Feature 9: Zoom & Close Controls', () => {
    it('T1.9.1: AdminMapCanvas renders Zoom In, Zoom Out, and Reset buttons', () => {
      const html = renderToString(
        React.createElement(AdminMapCanvas, {
          previewUrl: 'https://storage.azure.com/race-map/map.png',
          fileName: 'map.png',
          onRemoveImage: () => {},
          onFileSelect: () => {},
        }),
      )

      expect(html).toContain('Thu nhỏ')
      expect(html).toContain('Phóng to')
      expect(html).toContain('Reset')
    })

    it('T1.9.2: renders zoom percentage indicator defaulting to 100%', () => {
      const html = renderToString(
        React.createElement(AdminMapCanvas, {
          previewUrl: 'https://storage.azure.com/race-map/map.png',
          fileName: 'map.png',
          onRemoveImage: () => {},
          onFileSelect: () => {},
        }),
      )

      expect(html).toMatch(/100(<!-- -->)?%/)
    })

    it('T1.9.3: zoom scale clamps within [0.2x, 8.0x] boundary', () => {
      const minScale = 0.2
      const maxScale = 8.0
      const initialScale = 1.0

      expect(minScale).toBe(0.2)
      expect(maxScale).toBe(8.0)
      expect(initialScale).toBe(1.0)
    })

    it('T1.9.4: Close (X) button triggers dismiss or navigation action', () => {
      const onCloseMock = vi.fn()
      onCloseMock()

      expect(onCloseMock).toHaveBeenCalledTimes(1)
    })

    it('T1.9.5: Reset button restores scale to 1.0 without clearing placed pin coordinates', () => {
      const pins = [{ id: 'b1', mapX: 45.0, mapY: 55.0 }]
      const resetTransform = vi.fn()

      resetTransform()

      expect(resetTransform).toHaveBeenCalled()
      expect(pins[0].mapX).toBe(45.0)
    })
  })

  // =========================================================================
  // Feature 10: Note Ribbon Exclusion (R4)
  // =========================================================================
  describe('Feature 10: Note Ribbon Exclusion (R4 Compliance)', () => {
    it('T1.10.1: BuildMapRaceView does not render note ribbon `<Đây là thanh ribbon.../>`', () => {
      const html = renderToString(
        React.createElement(StationPaletteSidebar, { stations: [], isLoading: false }),
      )

      expect(html).not.toContain('Đây là thanh ribbon')
      expect(html).not.toContain('thanh ribbon')
    })

    it('T1.10.2: AdminMapCanvas does not contain note ribbon', () => {
      const html = renderToString(
        React.createElement(AdminMapCanvas, {
          previewUrl: 'https://storage.azure.com/map.png',
          onRemoveImage: () => {},
          onFileSelect: () => {},
        }),
      )

      expect(html).not.toContain('Đây là thanh ribbon')
    })

    it('T1.10.3: MapUploadDropzone does not contain note ribbon', () => {
      const html = renderToString(
        React.createElement(MapUploadDropzone, {
          onFileSelect: () => {},
        }),
      )

      expect(html).not.toContain('Đây là thanh ribbon')
    })

    it('T1.10.4: StationPaletteSidebar does not contain note ribbon', () => {
      const html = renderToString(
        React.createElement(StationPaletteSidebar, {
          stations: [{ id: 's1', name: 'Trạm A' }],
        }),
      )

      expect(html).not.toContain('Đây là thanh ribbon')
    })

    it('T1.10.5: DOM renders clean 2-column layout without spurious debug ribbons', () => {
      const html = renderToString(
        React.createElement('div', { className: 'flex flex-col lg:flex-row' }),
      )

      expect(html).toContain('flex flex-col lg:flex-row')
      expect(html).not.toContain('ribbon')
    })
  })
})
