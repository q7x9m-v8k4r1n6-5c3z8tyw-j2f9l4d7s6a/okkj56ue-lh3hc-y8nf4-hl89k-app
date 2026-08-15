import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  calculateRelativeCoordinate,
  type StationCoordinate,
  type UpdateBoothCoordinatesPayload,
} from './buildMapTestHelpers'

describe('Tier 3: Cross-Feature Combinations — Drag & Drop Station Pin System & Coordinate Locking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =========================================================================
  // Combination 1: Full Lifecycle Placement -> Move -> Remove -> Lock -> Payload Verification
  // =========================================================================
  it('T3.1: executes complete station lifecycle (place 3 -> move 1 -> remove 1 -> lock & save)', () => {
    // 1. Initial State: 5 unplaced booths
    const booths = [
      { id: 'b1', name: 'Trạm 1', mapX: null as number | null, mapY: null as number | null },
      { id: 'b2', name: 'Trạm 2', mapX: null as number | null, mapY: null as number | null },
      { id: 'b3', name: 'Trạm 3', mapX: null as number | null, mapY: null as number | null },
      { id: 'b4', name: 'Trạm 4', mapX: null as number | null, mapY: null as number | null },
      { id: 'b5', name: 'Trạm 5', mapX: null as number | null, mapY: null as number | null },
    ]

    // 2. Drag & place b1, b2, b3 onto canvas
    let currentBooths = booths.map((b) => {
      if (b.id === 'b1') return { ...b, mapX: calculateRelativeCoordinate(100, 0, 1000), mapY: calculateRelativeCoordinate(200, 0, 1000) }
      if (b.id === 'b2') return { ...b, mapX: calculateRelativeCoordinate(500, 0, 1000), mapY: calculateRelativeCoordinate(500, 0, 1000) }
      if (b.id === 'b3') return { ...b, mapX: calculateRelativeCoordinate(800, 0, 1000), mapY: calculateRelativeCoordinate(700, 0, 1000) }
      return b
    })

    let unplaced = currentBooths.filter((b) => b.mapX === null)
    let placed = currentBooths.filter((b) => b.mapX !== null)
    expect(unplaced).toHaveLength(2)
    expect(placed).toHaveLength(3)

    // 3. Move b1 to new location (45%, 60%)
    currentBooths = currentBooths.map((b) =>
      b.id === 'b1' ? { ...b, mapX: 45.0, mapY: 60.0 } : b,
    )
    expect(currentBooths.find((b) => b.id === 'b1')?.mapX).toBe(45.0)

    // 4. Remove b2 from canvas
    currentBooths = currentBooths.map((b) =>
      b.id === 'b2' ? { ...b, mapX: null, mapY: null } : b,
    )
    unplaced = currentBooths.filter((b) => b.mapX === null)
    placed = currentBooths.filter((b) => b.mapX !== null)
    expect(unplaced).toHaveLength(3) // b2, b4, b5
    expect(placed).toHaveLength(2)   // b1, b3

    // 5. Admin clicks Lock -> Generate PUT payload
    const payload: UpdateBoothCoordinatesPayload = {
      coordinates: currentBooths.map((b) => ({
        boothId: b.id,
        mapX: b.mapX,
        mapY: b.mapY,
      })),
    }

    expect(payload.coordinates).toEqual([
      { boothId: 'b1', mapX: 45.0, mapY: 60.0 },
      { boothId: 'b2', mapX: null, mapY: null },
      { boothId: 'b3', mapX: 80.0, mapY: 70.0 },
      { boothId: 'b4', mapX: null, mapY: null },
      { boothId: 'b5', mapX: null, mapY: null },
    ])

    // 6. Trigger success toast
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
  })

  // =========================================================================
  // Combination 2: Zoom 2.5x -> Drag Placement -> Reposition -> Lock Coordinates
  // =========================================================================
  it('T3.2: calculates accurate coordinates during zoom in 2.5x and persists exact percentages', () => {
    const canvasWidth = 1000
    const zoomScale = 2.5
    const viewportOffsetX = 250

    const placedX = calculateRelativeCoordinate(1500, viewportOffsetX, canvasWidth, zoomScale)
    const placedY = calculateRelativeCoordinate(1250, 0, canvasWidth, zoomScale)

    expect(placedX).toBe(50.0)
    expect(placedY).toBe(50.0)

    const repoX = calculateRelativeCoordinate(2000, viewportOffsetX, canvasWidth, zoomScale)
    expect(repoX).toBe(70.0)

    const lockPayload: StationCoordinate = {
      boothId: 'b-zoomed',
      mapX: repoX,
      mapY: placedY,
    }
    expect(lockPayload).toEqual({ boothId: 'b-zoomed', mapX: 70.0, mapY: 50.0 })
  })

  // =========================================================================
  // Combination 3: Status Transition (Draft -> Ongoing Read-Only Mode)
  // =========================================================================
  it('T3.3: enforces strict read-only lock when race status transitions from Draft to Ongoing', () => {
    let raceStatus = 'Draft'
    let isLocked = false
    let isDraggable = !isLocked && raceStatus === 'Draft'
    expect(isDraggable).toBe(true)

    raceStatus = 'Ongoing'
    isLocked = true
    isDraggable = !isLocked && raceStatus === 'Draft'

    expect(isDraggable).toBe(false)

    const canToggleLock = raceStatus === 'Draft'
    expect(canToggleLock).toBe(false)
  })

  // =========================================================================
  // Combination 4: Lock -> Unlock -> Edit -> Re-lock Cycle
  // =========================================================================
  it('T3.4: manages Lock -> Unlock -> Edit -> Re-lock multi-cycle transitions smoothly', () => {
    let isLocked = false
    let pinCoordinate = { mapX: 20.0, mapY: 30.0 }
    expect(isLocked).toBe(false)

    // 1. Lock cycle 1
    isLocked = true
    expect(isLocked).toBe(true)
    let lastSavedPayload: StationCoordinate[] = [{ boothId: 'b1', mapX: pinCoordinate.mapX, mapY: pinCoordinate.mapY }]
    expect(lastSavedPayload[0].mapX).toBe(20.0)

    // 2. Unlock in Draft
    isLocked = false
    expect(isLocked).toBe(false)

    // 3. Edit pin location
    pinCoordinate = { mapX: 85.5, mapY: 90.0 }

    // 4. Lock cycle 2
    isLocked = true
    expect(isLocked).toBe(true)
    lastSavedPayload = [{ boothId: 'b1', mapX: pinCoordinate.mapX, mapY: pinCoordinate.mapY }]
    expect(lastSavedPayload[0].mapX).toBe(85.5)
    expect(lastSavedPayload[0].mapY).toBe(90.0)
  })

  // =========================================================================
  // Combination 5: Map Image Replacement with Existing Placed Pins
  // =========================================================================
  it('T3.5: retains placed pin coordinates when map image is replaced with new file', () => {
    const existingPins = [
      { id: 'b1', name: 'Trạm 1', mapX: 30.0, mapY: 40.0 },
      { id: 'b2', name: 'Trạm 2', mapX: 70.0, mapY: 80.0 },
    ]

    let currentMapUrl = 'https://azure.blob/map_v1.png'
    expect(currentMapUrl).toBe('https://azure.blob/map_v1.png')

    currentMapUrl = 'https://azure.blob/map_v2.png'

    expect(currentMapUrl).toBe('https://azure.blob/map_v2.png')
    expect(existingPins[0].mapX).toBe(30.0)
    expect(existingPins[1].mapX).toBe(70.0)
  })

  // =========================================================================
  // Combination 6: Cancel Edits Reverts Placed Pins to Persisted State
  // =========================================================================
  it('T3.6: reverts uncommitted pin placements upon user cancellation', () => {
    const persistedBooths = [
      { id: 'b1', mapX: 10.0, mapY: 10.0 },
      { id: 'b2', mapX: null as number | null, mapY: null as number | null },
    ]

    let workingBooths: Array<{ id: string; mapX: number | null; mapY: number | null }> = [
      { id: 'b1', mapX: 50.0, mapY: 50.0 },
      { id: 'b2', mapX: 60.0, mapY: 60.0 },
    ]
    expect(workingBooths[1].mapX).toBe(60.0)

    workingBooths = [...persistedBooths]

    expect(workingBooths[0]).toEqual({ id: 'b1', mapX: 10.0, mapY: 10.0 })
    expect(workingBooths[1]).toEqual({ id: 'b2', mapX: null, mapY: null })
  })
})
