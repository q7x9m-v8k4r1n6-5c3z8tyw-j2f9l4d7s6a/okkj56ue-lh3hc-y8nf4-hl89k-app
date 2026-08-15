import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import {
  pinPlacementReducer,
  createInitialPinPlacementState,
} from '../model/frontend/usePinPlacementState'
import {
  updateBoothCoordinatesPayloadSchema,
} from '../model/buildMap.contract'
import type { StationPinState } from '../model/buildMap.types'
import { mapStationsToCoordinatesPayload } from '../model/mapBoothListToStations'
import { CoordinateLockControls } from '../ui/components/CoordinateLockControls'
import { getBuildMapErrorMessage } from '../ui/hooks/useBuildMapRaceView'

describe('Challenger 2: Coordinate Locking & Persistence Empirical Stress Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =========================================================================
  // 1. COORDINATE LOCKING PERSISTENCE & PAYLOAD VERIFICATION
  // =========================================================================
  describe('1. Coordinate Locking Payload Serialization & Validation', () => {
    it('serializes placed stations with precision rounding to 2 decimal places', () => {
      const stations = [
        { id: 'station-1', mapX: 12.3456, mapY: 78.9012 },
        { id: 'station-2', mapX: 0.004, mapY: 99.999 },
        { id: 'station-3', mapX: 50.0, mapY: 50.0 },
      ]

      const payload = mapStationsToCoordinatesPayload(stations)

      expect(payload.coordinates).toEqual([
        { boothId: 'station-1', mapX: 12.35, mapY: 78.9 },
        { boothId: 'station-2', mapX: 0, mapY: 100 },
        { boothId: 'station-3', mapX: 50, mapY: 50 },
      ])

      // Strict validation against backend Zod contract schema
      const parsed = updateBoothCoordinatesPayloadSchema.parse(payload)
      expect(parsed.coordinates).toHaveLength(3)
    })

    it('serializes unplaced or removed stations with null coordinates for database cleanup', () => {
      const stations = [
        { id: 'station-placed', mapX: 30.5, mapY: 40.2 },
        { id: 'station-unplaced-1', mapX: null, mapY: null },
        { id: 'station-unplaced-2', mapX: undefined, mapY: undefined },
        { id: 'station-nan', mapX: Number.NaN, mapY: Number.NaN },
      ]

      const payload = mapStationsToCoordinatesPayload(stations)

      expect(payload.coordinates).toEqual([
        { boothId: 'station-placed', mapX: 30.5, mapY: 40.2 },
        { boothId: 'station-unplaced-1', mapX: null, mapY: null },
        { boothId: 'station-unplaced-2', mapX: null, mapY: null },
        { boothId: 'station-nan', mapX: null, mapY: null },
      ])

      const parsed = updateBoothCoordinatesPayloadSchema.parse(payload)
      expect(parsed.coordinates).toHaveLength(4)
      expect(parsed.coordinates[1].mapX).toBeNull()
      expect(parsed.coordinates[1].mapY).toBeNull()
    })

    it('handles empty station list without error', () => {
      const payload = mapStationsToCoordinatesPayload([])
      expect(payload.coordinates).toEqual([])
      const parsed = updateBoothCoordinatesPayloadSchema.parse(payload)
      expect(parsed.coordinates).toEqual([])
    })

    it('extracts boothId from either boothId or id field defensively', () => {
      const stations = [
        { boothId: 'b-primary', mapX: 10, mapY: 20 },
        { id: 's-secondary', mapX: 30, mapY: 40 },
        { mapX: 50, mapY: 60 }, // Missing id
      ]

      const payload = mapStationsToCoordinatesPayload(stations)
      expect(payload.coordinates[0].boothId).toBe('b-primary')
      expect(payload.coordinates[1].boothId).toBe('s-secondary')
      expect(payload.coordinates[2].boothId).toBe('')
    })
  })

  // =========================================================================
  // 2. COORDINATE LOCK CONTROLS UI & ACCESSIBILITY
  // =========================================================================
  describe('2. Coordinate Lock Controls UI States & Accessibility', () => {
    it('renders Unlocked state in Draft mode with action button to Lock and Save', () => {
      const html = renderToString(
        React.createElement(CoordinateLockControls, {
          isLocked: false,
          isDraft: true,
          isSaving: false,
        }),
      )

      expect(html).toContain('Khóa vị trí')
      expect(html).toContain('bg-[#de3336]')
      expect(html).toContain('Khóa và lưu vị trí các trạm lên hệ thống')
      expect(html).not.toContain('disabled=""')
    })

    it('renders Locked state in Draft mode with action button to Unlock', () => {
      const html = renderToString(
        React.createElement(CoordinateLockControls, {
          isLocked: true,
          isDraft: true,
          isSaving: false,
        }),
      )

      expect(html).toContain('Mở khóa vị trí')
      expect(html).toContain('Mở khóa để điều chỉnh vị trí các trạm')
      expect(html).not.toContain('disabled=""')
    })

    it('renders permanently disabled state when isDraft is false (Ongoing/Finished race)', () => {
      const html = renderToString(
        React.createElement(CoordinateLockControls, {
          isLocked: true,
          isDraft: false,
          isSaving: false,
        }),
      )

      expect(html).toContain('disabled=""')
      expect(html).toContain('Trận đấu đang diễn ra. Vị trí trạm đã được khóa cố định.')
      expect(html).toContain('cursor-not-allowed')
    })

    it('renders saving state with spinner and disabled button during mutation', () => {
      const html = renderToString(
        React.createElement(CoordinateLockControls, {
          isLocked: false,
          isDraft: true,
          isSaving: true,
        }),
      )

      expect(html).toContain('Đang lưu...')
      expect(html).toContain('disabled=""')
    })
  })

  // =========================================================================
  // 3. NON-DRAFT STATUS PERMANENT LOCK ENFORCEMENT
  // =========================================================================
  describe('3. Non-Draft Status Enforcement Across Various Status Values', () => {
    const nonDraftStatuses = [
      'Ongoing',
      'ongoing',
      'ONGOING',
      'Finished',
      'finished',
      'Ready',
      'Upcoming',
      'Cancelled',
      'Archived',
      'Active',
      'Pending',
      '',
      undefined,
      null,
    ]

    nonDraftStatuses.forEach((status) => {
      it(`enforces lock permanent disablement for status: "${String(status)}"`, () => {
        const isDraft = typeof status === 'string' && status.toLowerCase() === 'draft'
        expect(isDraft).toBe(false)

        const isLockedPermanent = !isDraft
        expect(isLockedPermanent).toBe(true)

        // Verify initial state creation with locked status
        const state = createInitialPinPlacementState([], isLockedPermanent)
        expect(state.isLocked).toBe(true)

        // Attempting to move or place pin is blocked
        const mutated = pinPlacementReducer(state, {
          type: 'PLACE_PIN',
          payload: { boothId: 'b-1', mapX: 50, mapY: 50 },
        })
        expect(mutated.booths).toHaveLength(0)
        expect(mutated.isDirty).toBe(false)
      })
    })

    it('identifies draft status correctly case-insensitively', () => {
      const draftVariants = ['Draft', 'draft', 'DRAFT', 'DrAfT']
      draftVariants.forEach((variant) => {
        const isDraft = variant.toLowerCase() === 'draft'
        expect(isDraft).toBe(true)
      })
    })
  })

  // =========================================================================
  // 4. PIN PLACEMENT REDUCER STATE INTEGRITY UNDER LOCK / UNLOCK
  // =========================================================================
  describe('4. Reducer Invariants & Action Blocking Under Locked State', () => {
    const sampleBooths: StationPinState[] = [
      {
        boothId: 'b-1',
        boothName: 'Trạm Số 1',
        boothLocation: 'Cổng chính',
        description: '',
        status: 'free',
        isHidden: false,
        mapX: 25.0,
        mapY: 30.0,
      },
      {
        boothId: 'b-2',
        boothName: 'Trạm Số 2',
        boothLocation: 'Sân bóng',
        description: '',
        status: 'free',
        isHidden: false,
        mapX: null,
        mapY: null,
      },
    ]

    it('blocks PLACE_PIN when isLocked is true', () => {
      const state = createInitialPinPlacementState(sampleBooths, true)
      const nextState = pinPlacementReducer(state, {
        type: 'PLACE_PIN',
        payload: { boothId: 'b-2', mapX: 60.0, mapY: 70.0 },
      })

      expect(nextState.booths[1].mapX).toBeNull()
      expect(nextState.booths[1].mapY).toBeNull()
      expect(nextState.isDirty).toBe(false)
    })

    it('blocks MOVE_PIN when isLocked is true', () => {
      const state = createInitialPinPlacementState(sampleBooths, true)
      const nextState = pinPlacementReducer(state, {
        type: 'MOVE_PIN',
        payload: { boothId: 'b-1', mapX: 90.0, mapY: 90.0 },
      })

      expect(nextState.booths[0].mapX).toBe(25.0)
      expect(nextState.booths[0].mapY).toBe(30.0)
      expect(nextState.isDirty).toBe(false)
    })

    it('blocks REMOVE_PIN when isLocked is true', () => {
      const state = createInitialPinPlacementState(sampleBooths, true)
      const nextState = pinPlacementReducer(state, {
        type: 'REMOVE_PIN',
        payload: { boothId: 'b-1' },
      })

      expect(nextState.booths[0].mapX).toBe(25.0)
      expect(nextState.booths[0].mapY).toBe(30.0)
      expect(nextState.isDirty).toBe(false)
    })

    it('allows SELECT_PIN even when isLocked is true (read-only inspection)', () => {
      const state = createInitialPinPlacementState(sampleBooths, true)
      const nextState = pinPlacementReducer(state, {
        type: 'SELECT_PIN',
        payload: { boothId: 'b-1' },
      })

      expect(nextState.selectedBoothId).toBe('b-1')
    })

    it('allows placement and movement after unlocking, then preserves coordinates on SYNC_SAVED_PINS', () => {
      let state = createInitialPinPlacementState(sampleBooths, true)

      // Unlock
      state = pinPlacementReducer(state, {
        type: 'SET_LOCKED',
        payload: { isLocked: false },
      })
      expect(state.isLocked).toBe(false)

      // Move pin 1
      state = pinPlacementReducer(state, {
        type: 'MOVE_PIN',
        payload: { boothId: 'b-1', mapX: 40.0, mapY: 45.0 },
      })
      expect(state.booths[0].mapX).toBe(40.0)
      expect(state.booths[0].mapY).toBe(45.0)
      expect(state.isDirty).toBe(true)

      // Place pin 2
      state = pinPlacementReducer(state, {
        type: 'PLACE_PIN',
        payload: { boothId: 'b-2', mapX: 80.0, mapY: 85.0 },
      })
      expect(state.booths[1].mapX).toBe(80.0)
      expect(state.booths[1].mapY).toBe(85.0)
      expect(state.isDirty).toBe(true)

      // Sync saved pins (simulates successful PUT persistence)
      state = pinPlacementReducer(state, { type: 'SYNC_SAVED_PINS' })
      expect(state.isDirty).toBe(false)
      expect(state.initialBooths[0].mapX).toBe(40.0)
      expect(state.initialBooths[1].mapX).toBe(80.0)
    })
  })

  // =========================================================================
  // 5. ERROR RESILIENCE & MESSAGING VERIFICATION
  // =========================================================================
  describe('5. Error Parsing & Message Resilience', () => {
    it('extracts error messages from standard Error objects', () => {
      const err = new Error('Lỗi kết nối máy chủ.')
      expect(getBuildMapErrorMessage(err)).toBe('Lỗi kết nối máy chủ.')
    })

    it('extracts error messages from structured API response objects', () => {
      const apiErr = { message: 'Tọa độ không hợp lệ.' }
      expect(getBuildMapErrorMessage(apiErr)).toBe('Tọa độ không hợp lệ.')
    })

    it('returns default fallback message when error is unexpected type or empty', () => {
      expect(getBuildMapErrorMessage(null, 'Lỗi mặc định')).toBe('Lỗi mặc định')
      expect(getBuildMapErrorMessage(undefined, 'Lỗi mặc định')).toBe('Lỗi mặc định')
      expect(getBuildMapErrorMessage(12345, 'Lỗi mặc định')).toBe('Lỗi mặc định')
      expect(getBuildMapErrorMessage({}, 'Lỗi mặc định')).toBe('Lỗi mặc định')
    })
  })
})
