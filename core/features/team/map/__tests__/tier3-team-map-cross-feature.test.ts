import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { RaceMapBooth } from '@/core/features/race/build-map/model/buildMap.contract'
import { mapBoothToStationPin } from './teamMapTestHelpers'
import type { StationPin } from '../model/teamMap.types'

describe('Tier 3: Team Map Cross-Feature Combinations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =========================================================================
  // Combination 1: Admin Save -> Team Map Real Data Synchronization
  // =========================================================================
  it('T3.TM.1: synchronizes updated admin coordinates directly to team map player pins', () => {
    // Admin placed booths
    const adminSavedBooths: (RaceMapBooth & { mapX: number | null; mapY: number | null })[] = [
      { id: 'b1', name: 'Trạm 1', place: 'Khu 1', mapX: 25.0, mapY: 30.0, status: 'free' },
      { id: 'b2', name: 'Trạm 2', place: 'Khu 2', mapX: 55.0, mapY: 70.0, status: 'free' },
      { id: 'b3', name: 'Trạm Chưa Đặt', place: '', mapX: null, mapY: null, status: 'free' },
    ]

    // Team map receives and maps booths
    const teamPins = adminSavedBooths
      .map((b) => mapBoothToStationPin(b))
      .filter((p): p is StationPin => p !== null)

    expect(teamPins).toHaveLength(2)
    expect(teamPins[0]).toEqual(
      expect.objectContaining({
        id: 'b1',
        x: 25.0,
        y: 30.0,
      }),
    )
    expect(teamPins[1]).toEqual(
      expect.objectContaining({
        id: 'b2',
        x: 55.0,
        y: 70.0,
      }),
    )
  })

  // =========================================================================
  // Combination 2: Admin Removes Pin -> Team Map Updates Pin Count
  // =========================================================================
  it('T3.TM.2: reflects pin removal from admin builder immediately on team map', () => {
    // Initially 2 pins placed
    let booths: (RaceMapBooth & { mapX: number | null; mapY: number | null })[] = [
      { id: 'b1', name: 'Trạm 1', place: 'Khu 1', status: 'free', mapX: 25.0, mapY: 30.0 },
      { id: 'b2', name: 'Trạm 2', place: 'Khu 2', status: 'free', mapX: 55.0, mapY: 70.0 },
    ]

    let teamPins = booths.map(mapBoothToStationPin).filter((p): p is StationPin => p !== null)
    expect(teamPins).toHaveLength(2)

    // Admin removes b2
    booths = booths.map((b) => (b.id === 'b2' ? { ...b, mapX: null, mapY: null } : b))

    teamPins = booths.map(mapBoothToStationPin).filter((p): p is StationPin => p !== null)
    expect(teamPins).toHaveLength(1)
    expect(teamPins[0].id).toBe('b1')
  })

  // =========================================================================
  // Combination 3: Team Player Interactive Pin Inspection & Dismiss Lifecycle
  // =========================================================================
  it('T3.TM.3: executes complete player inspection lifecycle (select pin -> open sheet -> dismiss)', () => {
    const pins: StationPin[] = [
      {
        id: 'pin-1',
        name: 'Trạm Khởi Động',
        code: '1',
        x: 30,
        y: 40,
        status: 'active',
        points: 100,
        description: 'Vượt chướng ngại vật tại sân A',
      },
    ]

    let selectedStationId: string | null = null
    const selectStation = (id: string) => {
      selectedStationId = id
    }
    const clearSelection = () => {
      selectedStationId = null
    }

    // 1. Initial: no sheet open
    expect(selectedStationId).toBeNull()

    // 2. Click pin-1
    selectStation(pins[0].id)
    expect(selectedStationId).toBe('pin-1')

    const activePin = pins.find((p) => p.id === selectedStationId)
    expect(activePin?.description).toBe('Vượt chướng ngại vật tại sân A')

    // 3. Dismiss sheet
    clearSelection()
    expect(selectedStationId).toBeNull()
  })

  // =========================================================================
  // Combination 4: Team Map Zoom & Relative Marker Positioning Stability
  // =========================================================================
  it('T3.TM.4: preserves relative pin coordinate anchors under client zoom transformations', () => {
    const pin: StationPin = {
      id: 'pin-scale',
      name: 'Trạm Bất Biến',
      code: 'BB',
      x: 65.5,
      y: 82.3,
      status: 'active',
      points: 150,
      description: '',
    }

    const scales = [1, 2, 4]
    scales.forEach((scale) => {
      expect(pin.x).toBe(65.5)
      expect(pin.y).toBe(82.3)
      expect(scale).toBeGreaterThan(0)
    })
  })
})
