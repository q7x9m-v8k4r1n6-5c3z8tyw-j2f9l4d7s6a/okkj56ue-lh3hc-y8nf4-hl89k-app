import { describe, expect, it } from 'vitest'
import { mapBoothStatus, mapBoothToStationPin, mapTeamMapData } from '../model/mapTeamMapData'
import type { TeamMapBoothItem, TeamMapRaceDetail } from '../model/teamMap.contract'

describe('mapTeamMapData pure mapper functions', () => {
  describe('mapBoothStatus', () => {
    it('maps completed and occupied to completed', () => {
      expect(mapBoothStatus('completed')).toBe('completed')
      expect(mapBoothStatus('Completed')).toBe('completed')
      expect(mapBoothStatus('occupied')).toBe('completed')
      expect(mapBoothStatus('Occupied')).toBe('completed')
    })

    it('maps locked to locked', () => {
      expect(mapBoothStatus('locked')).toBe('locked')
      expect(mapBoothStatus('Locked')).toBe('locked')
    })

    it('maps pending to pending', () => {
      expect(mapBoothStatus('pending')).toBe('pending')
    })

    it('defaults free, empty, or other status to active', () => {
      expect(mapBoothStatus('free')).toBe('active')
      expect(mapBoothStatus('Free')).toBe('active')
      expect(mapBoothStatus('')).toBe('active')
      expect(mapBoothStatus(undefined)).toBe('active')
      expect(mapBoothStatus('unknown_status')).toBe('active')
    })
  })

  describe('mapBoothToStationPin', () => {
    it('returns null if booth is null or undefined', () => {
      expect(mapBoothToStationPin(null)).toBeNull()
      expect(mapBoothToStationPin(undefined)).toBeNull()
    })

    it('returns null if coordinates are null or undefined', () => {
      expect(
        mapBoothToStationPin({
          boothId: 'b1',
          boothName: 'Trạm 1',
          mapX: null,
          mapY: 20,
        }),
      ).toBeNull()

      expect(
        mapBoothToStationPin({
          boothId: 'b1',
          boothName: 'Trạm 1',
          mapX: 20,
          mapY: null,
        }),
      ).toBeNull()

      expect(
        mapBoothToStationPin({
          boothId: 'b1',
          boothName: 'Trạm 1',
          mapX: undefined,
          mapY: undefined,
        }),
      ).toBeNull()
    })

    it('maps placed booth with location as code', () => {
      const booth: TeamMapBoothItem = {
        boothId: 'b1',
        boothName: 'Trạm Khởi Động',
        boothLocation: 'M-01',
        description: 'Vượt chướng ngại vật',
        status: 'occupied',
        isHidden: false,
        currentTeamName: 'Team Alpha',
        currentOrganizerName: 'Admin 1',
        mapX: 25.5,
        mapY: 40.2,
      }

      const pin = mapBoothToStationPin(booth)
      expect(pin).not.toBeNull()
      expect(pin?.id).toBe('b1')
      expect(pin?.name).toBe('Trạm Khởi Động')
      expect(pin?.code).toBe('M-01')
      expect(pin?.x).toBe(25.5)
      expect(pin?.y).toBe(40.2)
      expect(pin?.status).toBe('completed')
      expect(pin?.points).toBe(100)
      expect(pin?.description).toBe('Vượt chướng ngại vật')
      expect(pin?.currentTeamName).toBe('Team Alpha')
      expect(pin?.currentOrganizerName).toBe('Admin 1')
    })

    it('derives code from name when boothLocation is empty', () => {
      const booth: TeamMapBoothItem = {
        boothId: 'b2',
        boothName: 'Trạm 5',
        boothLocation: '',
        description: '',
        status: 'free',
        isHidden: false,
        mapX: 50,
        mapY: 60,
      }

      const pin = mapBoothToStationPin(booth)
      expect(pin?.code).toBe('5')
    })
  })

  describe('mapTeamMapData', () => {
    const mockRaceDetail: TeamMapRaceDetail = {
      id: 'race-123',
      name: 'Giải Đấu 2026',
      raceName: 'Giải Đấu 2026',
      mapImageUrl: 'https://storage.azure.com/maps/map1.png',
      status: 'ongoing',
    }

    it('filters out isHidden booths and unplaced booths', () => {
      const booths: TeamMapBoothItem[] = [
        {
          boothId: 'b1',
          boothName: 'Trạm 1',
          boothLocation: 'A1',
          description: '',
          status: 'free',
          isHidden: false,
          mapX: 10,
          mapY: 20,
        },
        {
          boothId: 'b2',
          boothName: 'Trạm Ẩn',
          boothLocation: 'A2',
          description: '',
          status: 'free',
          isHidden: true,
          mapX: 30,
          mapY: 40,
        },
        {
          boothId: 'b3',
          boothName: 'Trạm Chưa Đặt',
          boothLocation: 'A3',
          description: '',
          status: 'free',
          isHidden: false,
          mapX: null,
          mapY: null,
        },
      ]

      const result = mapTeamMapData(mockRaceDetail, booths)
      expect(result.raceId).toBe('race-123')
      expect(result.raceName).toBe('Giải Đấu 2026')
      expect(result.mapImageUrl).toBe('https://storage.azure.com/maps/map1.png')
      expect(result.stations).toHaveLength(1)
      expect(result.stations[0].id).toBe('b1')
      expect(result.isEmpty).toBe(false)
    })

    it('marks isEmpty as true when mapImageUrl is null or empty', () => {
      const noImageRace: TeamMapRaceDetail = {
        id: 'race-no-img',
        mapImageUrl: null,
      }

      const booths: TeamMapBoothItem[] = [
        {
          boothId: 'b1',
          boothName: 'Trạm 1',
          boothLocation: '',
          description: '',
          status: 'free',
          mapX: 10,
          mapY: 10,
          isHidden: false,
        },
      ]

      const result = mapTeamMapData(noImageRace, booths)
      expect(result.isEmpty).toBe(true)
    })

    it('marks isEmpty as true when stations array is empty', () => {
      const result = mapTeamMapData(mockRaceDetail, [])
      expect(result.isEmpty).toBe(true)
      expect(result.stations).toHaveLength(0)
    })

    it('handles null / undefined inputs gracefully', () => {
      const result = mapTeamMapData(null, null)
      expect(result.raceId).toBe('')
      expect(result.mapImageUrl).toBeNull()
      expect(result.stations).toEqual([])
      expect(result.isEmpty).toBe(true)
    })
  })
})
