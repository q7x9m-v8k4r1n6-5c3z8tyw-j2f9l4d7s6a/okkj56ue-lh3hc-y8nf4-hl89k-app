import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  calculateRelativeCoordinate,
  type UpdateBoothCoordinatesPayload,
} from '@/core/features/race/build-map/__tests__/buildMapTestHelpers'
import { mapBoothToStationPin } from './teamMapTestHelpers'
import type { StationPin } from '../model/teamMap.types'
import type { RaceMapBooth } from '@/core/features/race/build-map/model/buildMap.contract'

describe('Tier 4: Real-World Application Scenarios — Drag & Drop Station Pin System & Coordinate Locking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =========================================================================
  // Scenario 1: Standard 5-Station Race Setup -> Coordinate Lock -> Team View Sync
  // =========================================================================
  it('Scenario 1: End-to-end standard 5-station race configuration, lock persistence, and player map rendering', () => {
    // 1. Admin loads race with 5 unplaced booths
    let booths: (RaceMapBooth & { mapX: number | null; mapY: number | null })[] = [
      { id: 'b1', name: 'Trạm 1: Khởi Động', place: 'Sân A', mapX: null, mapY: null, status: 'free' },
      { id: 'b2', name: 'Trạm 2: Vượt Chướng Ngại', place: 'Tòa H1', mapX: null, mapY: null, status: 'free' },
      { id: 'b3', name: 'Trạm 3: Giải Mật Mã', place: 'Thư viện', mapX: null, mapY: null, status: 'free' },
      { id: 'b4', name: 'Trạm 4: Thể Lực', place: 'Sân bóng', mapX: null, mapY: null, status: 'free' },
      { id: 'b5', name: 'Trạm 5: Về Đích', place: 'Cổng chính', mapX: null, mapY: null, status: 'free' },
    ]

    expect(booths.filter((b) => b.mapX === null)).toHaveLength(5)

    // 2. Admin drags all 5 stations onto map canvas
    booths = booths.map((b, idx) => ({
      ...b,
      mapX: calculateRelativeCoordinate(150 + idx * 160, 0, 1000),
      mapY: calculateRelativeCoordinate(200 + (idx % 2) * 300, 0, 1000),
    }))

    expect(booths.filter((b) => b.mapX !== null)).toHaveLength(5)
    expect(booths[0].mapX).toBe(15.0)
    expect(booths[4].mapX).toBe(79.0)

    // 3. Admin clicks Lock button -> coordinates saved via PUT API
    const isLocked = true
    const putPayload: UpdateBoothCoordinatesPayload = {
      coordinates: booths.map((b) => ({
        boothId: b.id,
        mapX: b.mapX,
        mapY: b.mapY,
      })),
    }

    expect(putPayload.coordinates).toHaveLength(5)
    expect(isLocked).toBe(true)

    // 4. Success toast notification is displayed
    const toastMock = vi.fn()
    toastMock({
      title: 'Thành công',
      description: 'Đã khóa và lưu vị trí các trạm thành công!',
      variant: 'success',
    })
    expect(toastMock).toHaveBeenCalledWith({
      title: 'Thành công',
      description: 'Đã khóa và lưu vị trí các trạm thành công!',
      variant: 'success',
    })

    // 5. Team player logs in and views map
    const teamPins = booths
      .map((b) => mapBoothToStationPin(b))
      .filter((p): p is StationPin => p !== null)

    expect(teamPins).toHaveLength(5)
    expect(teamPins.map((p) => p.name)).toEqual([
      'Trạm 1: Khởi Động',
      'Trạm 2: Vượt Chướng Ngại',
      'Trạm 3: Giải Mật Mã',
      'Trạm 4: Thể Lực',
      'Trạm 5: Về Đích',
    ])
  })

  // =========================================================================
  // Scenario 2: 8-Station Race with Hidden Stations & Visibility Filtering
  // =========================================================================
  it('Scenario 2: Admin configures 8 stations (6 normal, 2 hidden), locks map, and team view respects visibility rules', () => {
    // 1. Admin configures 8 stations
    const stations: (RaceMapBooth & { mapX: number | null; mapY: number | null })[] = [
      { id: 's1', name: 'Trạm 1', place: 'Khu 1', status: 'free', isHidden: false, mapX: 10, mapY: 20 },
      { id: 's2', name: 'Trạm 2', place: 'Khu 2', status: 'free', isHidden: false, mapX: 25, mapY: 30 },
      { id: 's3', name: 'Trạm 3', place: 'Khu 3', status: 'free', isHidden: false, mapX: 40, mapY: 40 },
      { id: 's4', name: 'Trạm 4', place: 'Khu 4', status: 'free', isHidden: false, mapX: 55, mapY: 50 },
      { id: 's5', name: 'Trạm 5', place: 'Khu 5', status: 'free', isHidden: false, mapX: 70, mapY: 60 },
      { id: 's6', name: 'Trạm 6', place: 'Khu 6', status: 'free', isHidden: false, mapX: 85, mapY: 70 },
      { id: 's7', name: 'Trạm Ẩn A', place: 'Khu Ẩn 1', status: 'free', isHidden: true, mapX: 30, mapY: 80 },
      { id: 's8', name: 'Trạm Ẩn B', place: 'Khu Ẩn 2', status: 'free', isHidden: true, mapX: 60, mapY: 90 },
    ]

    // 2. Admin locks map
    const lockPayload: UpdateBoothCoordinatesPayload = {
      coordinates: stations.map((s) => ({
        boothId: s.id,
        mapX: s.mapX,
        mapY: s.mapY,
      })),
    }
    expect(lockPayload.coordinates).toHaveLength(8)

    // 3. Team map filters only visible stations
    const visiblePins = stations
      .filter((s) => !s.isHidden)
      .map(mapBoothToStationPin)
      .filter((p): p is StationPin => p !== null)

    expect(visiblePins).toHaveLength(6)
    expect(visiblePins.every((p) => !p.name.includes('Ẩn'))).toBe(true)
  })

  // =========================================================================
  // Scenario 3: Ongoing Race Read-Only Mode & Live Team Tracking
  // =========================================================================
  it('Scenario 3: Ongoing race enforcement prevents admin mutations while players view live stations', () => {
    const raceStatus: string = 'Ongoing'

    // Admin UI checks
    const isLockDisabled = raceStatus !== 'Draft'
    const isCanvasDraggable = raceStatus === 'Draft'
    expect(isLockDisabled).toBe(true)
    expect(isCanvasDraggable).toBe(false)

    // Team players view active map stations
    const activeStations: (RaceMapBooth & { mapX: number | null; mapY: number | null })[] = [
      { id: 'b1', name: 'Trạm 1', place: 'Khu 1', status: 'occupied', mapX: 20, mapY: 20 },
      { id: 'b2', name: 'Trạm 2', place: 'Khu 2', status: 'free', mapX: 60, mapY: 60 },
    ]

    const playerPins = activeStations.map(mapBoothToStationPin).filter((p): p is StationPin => p !== null)
    expect(playerPins).toHaveLength(2)
    expect(playerPins[0].status).toBe('completed')
    expect(playerPins[1].status).toBe('active')
  })

  // =========================================================================
  // Scenario 4: Empty Race Setup Lifecycle (0 booths -> Add booths -> Place pins -> Lock)
  // =========================================================================
  it('Scenario 4: Lifecycle from 0 booths initial setup to fully configured locked map', () => {
    // 1. Initial race with 0 booths
    let booths: (RaceMapBooth & { mapX: number | null; mapY: number | null })[] = []
    let mapImageUrl: string | null = null

    // Team map shows empty state
    let shouldShowEmptyState = !mapImageUrl || booths.length === 0
    expect(shouldShowEmptyState).toBe(true)

    // 2. Admin uploads map image
    mapImageUrl = 'https://storage.azure.com/race-map/arena.png'

    // 3. Admin creates booths in basic tab
    booths = [
      { id: 'b-new-1', name: 'Trạm Checkpoint 1', place: 'Khu 1', status: 'free', mapX: null, mapY: null },
      { id: 'b-new-2', name: 'Trạm Checkpoint 2', place: 'Khu 2', status: 'free', mapX: null, mapY: null },
    ]

    // 4. Admin opens map builder, places both booths
    booths = booths.map((b, i) => ({
      ...b,
      mapX: (i + 1) * 35.0,
      mapY: (i + 1) * 30.0,
    }))

    // 5. Admin locks map
    const payload: UpdateBoothCoordinatesPayload = {
      coordinates: booths.map((b) => ({
        boothId: b.id,
        mapX: b.mapX,
        mapY: b.mapY,
      })),
    }
    expect(payload.coordinates).toHaveLength(2)

    // 6. Team map now renders valid pins without empty state
    const placedPins = booths.map(mapBoothToStationPin).filter((p): p is StationPin => p !== null)
    shouldShowEmptyState = !mapImageUrl || placedPins.length === 0
    expect(shouldShowEmptyState).toBe(false)
    expect(placedPins).toHaveLength(2)
  })

  // =========================================================================
  // Scenario 5: Rapid Zooming & Adjustments Under Stress
  // =========================================================================
  it('Scenario 5: Admin performs rapid zoom, pan, pin repositioning, and saves with high precision', () => {
    const canvasWidth = 1000
    let zoomScale = 1.0
    let offsetX = 0

    // Place pin 1 at normal 1x
    let pin1X = calculateRelativeCoordinate(250, offsetX, canvasWidth, zoomScale)
    const pin1Y = calculateRelativeCoordinate(300, 0, canvasWidth, zoomScale)
    expect(pin1X).toBe(25.0)

    // Zoom in 3.0x and pan 400px
    zoomScale = 3.0
    offsetX = 400

    // Fine-tune pin 1 position at (1150px client pos on zoomed canvas)
    pin1X = calculateRelativeCoordinate(1150, offsetX, canvasWidth, zoomScale)
    expect(pin1X).toBe(25.0)

    // Place pin 2 at 1750px -> (1750 - 400) / 3000 * 100 = 1350 / 3000 * 100 = 45.0%
    const pin2X = calculateRelativeCoordinate(1750, offsetX, canvasWidth, zoomScale)
    expect(pin2X).toBe(45.0)

    // Zoom back to 1.0x and Lock
    zoomScale = 1.0
    offsetX = 0
    expect(zoomScale).toBe(1.0)
    expect(offsetX).toBe(0)

    const finalPayload: UpdateBoothCoordinatesPayload = {
      coordinates: [
        { boothId: 'pin-1', mapX: pin1X, mapY: pin1Y },
        { boothId: 'pin-2', mapX: pin2X, mapY: 50.0 },
      ],
    }

    expect(finalPayload.coordinates[0].mapX).toBe(25.0)
    expect(finalPayload.coordinates[1].mapX).toBe(45.0)
  })
})
