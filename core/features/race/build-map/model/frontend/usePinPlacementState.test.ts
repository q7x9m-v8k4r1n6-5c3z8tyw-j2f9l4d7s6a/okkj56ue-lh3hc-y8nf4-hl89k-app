import { describe, expect, it } from 'vitest'
import {
  calculateRelativeCoordinate,
  getStationInitial,
  getUnplacedBooths,
  getPlacedBooths,
  pinPlacementReducer,
  createInitialPinPlacementState,
} from './usePinPlacementState'
import type { StationPinState } from '../buildMap.types'

describe('usePinPlacementState Reducer & Helpers', () => {
  const initialBooths: StationPinState[] = [
    {
      boothId: 'b-1',
      boothName: 'Trạm 1',
      boothLocation: 'Khu A',
      status: 'free',
      isHidden: false,
      mapX: null,
      mapY: null,
    },
    {
      boothId: 'b-2',
      boothName: 'Trạm 2',
      boothLocation: 'Khu B',
      status: 'free',
      isHidden: false,
      mapX: 30.0,
      mapY: 40.0,
    },
  ]

  describe('calculateRelativeCoordinate', () => {
    it('calculates exact relative coordinates with 2 decimals precision', () => {
      expect(calculateRelativeCoordinate(250, 0, 1000)).toBe(25.0)
      expect(calculateRelativeCoordinate(333.333, 0, 1000)).toBe(33.33)
    })

    it('clamps negative values to 0.00 and overflows to 100.00', () => {
      expect(calculateRelativeCoordinate(-50, 0, 1000)).toBe(0.0)
      expect(calculateRelativeCoordinate(1500, 0, 1000)).toBe(100.0)
    })

    it('compensates for zoom scales', () => {
      expect(calculateRelativeCoordinate(500, 0, 1000, 2.0)).toBe(25.0)
      expect(calculateRelativeCoordinate(100, 0, 1000, 0.2)).toBe(50.0)
    })

    it('defensively handles zero dimension canvas returning 0', () => {
      expect(calculateRelativeCoordinate(100, 0, 0)).toBe(0)
    })
  })

  describe('getStationInitial', () => {
    it('extracts booth number or station initial', () => {
      expect(getStationInitial('Trạm 1')).toBe('1')
      expect(getStationInitial('Trạm 12')).toBe('12')
      expect(getStationInitial('Trạm Khởi Động')).toBe('T')
      expect(getStationInitial('')).toBe('?')
      expect(getStationInitial('   ')).toBe('?')
    })
  })

  describe('Partitioning Helpers', () => {
    it('partitions unplaced vs placed booths correctly', () => {
      const unplaced = getUnplacedBooths(initialBooths)
      const placed = getPlacedBooths(initialBooths)

      expect(unplaced).toHaveLength(1)
      expect(unplaced[0].boothId).toBe('b-1')
      expect(placed).toHaveLength(1)
      expect(placed[0].boothId).toBe('b-2')
    })
  })

  describe('pinPlacementReducer Actions', () => {
    it('handles SET_BOOTH_LIST', () => {
      const state = createInitialPinPlacementState()
      const nextState = pinPlacementReducer(state, {
        type: 'SET_BOOTH_LIST',
        payload: initialBooths,
      })

      expect(nextState.booths).toHaveLength(2)
      expect(nextState.initialBooths).toHaveLength(2)
      expect(nextState.isDirty).toBe(false)
    })

    it('handles PLACE_PIN', () => {
      const state = createInitialPinPlacementState(initialBooths)
      const nextState = pinPlacementReducer(state, {
        type: 'PLACE_PIN',
        payload: { boothId: 'b-1', mapX: 55.555, mapY: 66.666 },
      })

      expect(nextState.booths.find((b) => b.boothId === 'b-1')?.mapX).toBe(55.56)
      expect(nextState.booths.find((b) => b.boothId === 'b-1')?.mapY).toBe(66.67)
      expect(nextState.selectedBoothId).toBe('b-1')
      expect(nextState.isDirty).toBe(true)
    })

    it('handles MOVE_PIN', () => {
      const state = createInitialPinPlacementState(initialBooths)
      const nextState = pinPlacementReducer(state, {
        type: 'MOVE_PIN',
        payload: { boothId: 'b-2', mapX: 80.0, mapY: 85.0 },
      })

      expect(nextState.booths.find((b) => b.boothId === 'b-2')?.mapX).toBe(80.0)
      expect(nextState.booths.find((b) => b.boothId === 'b-2')?.mapY).toBe(85.0)
      expect(nextState.isDirty).toBe(true)
    })

    it('handles REMOVE_PIN', () => {
      const state = createInitialPinPlacementState(initialBooths)
      const nextState = pinPlacementReducer(state, {
        type: 'REMOVE_PIN',
        payload: { boothId: 'b-2' },
      })

      expect(nextState.booths.find((b) => b.boothId === 'b-2')?.mapX).toBeNull()
      expect(nextState.booths.find((b) => b.boothId === 'b-2')?.mapY).toBeNull()
      expect(nextState.isDirty).toBe(true)
    })

    it('handles SET_LOCKED and ignores pin modifications when locked', () => {
      const state = createInitialPinPlacementState(initialBooths, true)
      const placed = pinPlacementReducer(state, {
        type: 'PLACE_PIN',
        payload: { boothId: 'b-1', mapX: 50.0, mapY: 50.0 },
      })
      expect(placed.booths.find((b) => b.boothId === 'b-1')?.mapX).toBeNull()

      const moved = pinPlacementReducer(state, {
        type: 'MOVE_PIN',
        payload: { boothId: 'b-2', mapX: 90.0, mapY: 90.0 },
      })
      expect(moved.booths.find((b) => b.boothId === 'b-2')?.mapX).toBe(30.0)

      const removed = pinPlacementReducer(state, {
        type: 'REMOVE_PIN',
        payload: { boothId: 'b-2' },
      })
      expect(removed.booths.find((b) => b.boothId === 'b-2')?.mapX).toBe(30.0)
    })

    it('handles SELECT_PIN', () => {
      const state = createInitialPinPlacementState(initialBooths)
      const selected = pinPlacementReducer(state, {
        type: 'SELECT_PIN',
        payload: { boothId: 'b-2' },
      })
      expect(selected.selectedBoothId).toBe('b-2')

      const deselected = pinPlacementReducer(selected, {
        type: 'SELECT_PIN',
        payload: { boothId: null },
      })
      expect(deselected.selectedBoothId).toBeNull()
    })

    it('handles RESET_PINS', () => {
      const state = createInitialPinPlacementState(initialBooths)
      const modified = pinPlacementReducer(state, {
        type: 'PLACE_PIN',
        payload: { boothId: 'b-1', mapX: 50.0, mapY: 50.0 },
      })
      expect(modified.isDirty).toBe(true)

      const reset = pinPlacementReducer(modified, {
        type: 'RESET_PINS',
      })
      expect(reset.booths.find((b) => b.boothId === 'b-1')?.mapX).toBeNull()
      expect(reset.isDirty).toBe(false)
    })

    it('handles SYNC_SAVED_PINS', () => {
      const state = createInitialPinPlacementState(initialBooths)
      const modified = pinPlacementReducer(state, {
        type: 'PLACE_PIN',
        payload: { boothId: 'b-1', mapX: 50.0, mapY: 50.0 },
      })
      expect(modified.isDirty).toBe(true)

      const synced = pinPlacementReducer(modified, {
        type: 'SYNC_SAVED_PINS',
      })
      expect(synced.initialBooths.find((b) => b.boothId === 'b-1')?.mapX).toBe(50.0)
      expect(synced.isDirty).toBe(false)
    })
  })
})
