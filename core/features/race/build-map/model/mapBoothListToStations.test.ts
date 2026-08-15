import { describe, expect, it } from 'vitest'
import {
  mapBoothItemToStation,
  mapBoothListToStations,
  mapRaceDetailBoothsToStations,
  mapBoothListToPinState,
  mapBoothListToPins,
  mapStationsToCoordinatesPayload,
} from './mapBoothListToStations'
import type { RaceBoothItem } from './buildMap.contract'

describe('mapBoothListToStations', () => {
  const mockBooths: RaceBoothItem[] = [
    {
      boothId: 'b-1',
      boothName: 'Trạm Khởi Động',
      boothLocation: 'Khu A',
      description: 'Mô tả 1',
      status: 'free',
      isHidden: false,
      currentTeamName: null,
      currentOrganizerName: 'Organizer 1',
      mapX: null,
      mapY: null,
    },
    {
      boothId: 'b-2',
      boothName: 'Trạm Bí Mật',
      boothLocation: 'Khu B',
      description: 'Mô tả 2',
      status: 'occupied',
      isHidden: true,
      currentTeamName: 'Team X',
      currentOrganizerName: null,
      mapX: 45.5,
      mapY: 60.2,
    },
  ]

  it('maps single booth item to station correctly', () => {
    const station1 = mapBoothItemToStation(mockBooths[0])
    expect(station1.id).toBe('b-1')
    expect(station1.name).toBe('Trạm Khởi Động')
    expect(station1.isPlaced).toBe(false)
    expect(station1.stationType).toBe('Trạm thường')
    expect(station1.mapX).toBeNull()

    const station2 = mapBoothItemToStation(mockBooths[1])
    expect(station2.id).toBe('b-2')
    expect(station2.isPlaced).toBe(true)
    expect(station2.stationType).toBe('Trạm ẩn')
    expect(station2.mapX).toBe(45.5)
    expect(station2.mapY).toBe(60.2)
  })

  it('maps array of booths to stations', () => {
    const stations = mapBoothListToStations(mockBooths)
    expect(stations).toHaveLength(2)
    expect(stations[0].id).toBe('b-1')
    expect(stations[1].id).toBe('b-2')
  })

  it('maps race detail booths fallback to stations', () => {
    const fallbackBooths = [
      { id: 'fb-1', name: 'Trạm Fallback 1', place: 'Khu C', status: 'free' },
      { id: 'fb-2', name: 'Trạm Fallback 2', place: '', status: 'free', isHidden: true },
    ]
    const stations = mapRaceDetailBoothsToStations(fallbackBooths)
    expect(stations).toHaveLength(2)
    expect(stations[0].stationType).toBe('Trạm thường')
    expect(stations[1].stationType).toBe('Trạm ẩn')
    expect(stations[0].isPlaced).toBe(false)
  })

  it('maps booths to pin states', () => {
    const pinStates = mapBoothListToPinState(mockBooths)
    expect(pinStates).toHaveLength(2)
    expect(pinStates[0].boothId).toBe('b-1')
    expect(pinStates[0].mapX).toBeNull()
    expect(pinStates[1].mapX).toBe(45.5)
  })

  it('maps placed booths to pins with code label', () => {
    const pins = mapBoothListToPins(mockBooths)
    expect(pins).toHaveLength(1)
    expect(pins[0].id).toBe('b-2')
    expect(pins[0].code).toBe('M-01')
    expect(pins[0].x).toBe(45.5)
    expect(pins[0].y).toBe(60.2)
  })

  it('converts stations into update coordinates payload with rounded precision', () => {
    const stations = [
      { id: 'b-1', mapX: 12.3456, mapY: 78.9101 },
      { id: 'b-2', mapX: null, mapY: null },
    ]
    const payload = mapStationsToCoordinatesPayload(stations)
    expect(payload.coordinates).toEqual([
      { boothId: 'b-1', mapX: 12.35, mapY: 78.91 },
      { boothId: 'b-2', mapX: null, mapY: null },
    ])
  })
})
