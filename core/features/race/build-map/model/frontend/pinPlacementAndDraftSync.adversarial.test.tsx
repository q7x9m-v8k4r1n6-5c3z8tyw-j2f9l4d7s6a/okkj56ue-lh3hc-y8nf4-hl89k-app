import { describe, expect, it, beforeEach, vi } from 'vitest'
import React from 'react'
import type { RaceBoothItem } from '../buildMap.contract'
import {
  clearMapDraft,
  getDraftStorageKey,
  loadMapDraft,
  saveMapDraft,
} from './useMapDraftStorage'
import { usePinPlacementState, type UsePinPlacementStateProps } from './usePinPlacementState'

// Custom Hook Test Runner conforming to React 19 Client Hook Internals
function createHookRunner<TProps, TResult>(hookFn: (props: TProps) => TResult) {
  let hookIndex = 0
  const hooks: Array<{ val?: unknown; fn?: unknown; deps?: unknown[]; current?: unknown }> = []
  let currentProps: TProps
  let result: TResult

  const dispatcher = {
    useState<S>(initial: S | (() => S)): [S, (action: S | ((prev: S) => S)) => void] {
      const idx = hookIndex++
      if (hooks.length <= idx) {
        const val = typeof initial === 'function' ? (initial as () => S)() : initial
        hooks[idx] = { val }
      }
      const hook = hooks[idx]
      const setState = (action: S | ((prev: S) => S)) => {
        hook.val =
          typeof action === 'function' ? (action as (prev: S) => S)(hook.val as S) : action
        rerender()
      }
      return [hook.val as S, setState]
    },
    useCallback<T extends (...args: unknown[]) => unknown>(fn: T, deps?: unknown[]): T {
      const idx = hookIndex++
      if (hooks.length <= idx) {
        hooks[idx] = { fn, deps }
      } else {
        const prev = hooks[idx]
        const changed =
          !deps ||
          !prev.deps ||
          deps.length !== prev.deps.length ||
          deps.some((d, i) => !Object.is(d, prev.deps![i]))
        if (changed) {
          hooks[idx] = { fn, deps }
        }
      }
      return hooks[idx].fn as T
    },
    useMemo<T>(fn: () => T, deps?: unknown[]): T {
      const idx = hookIndex++
      if (hooks.length <= idx) {
        hooks[idx] = { val: fn(), deps }
      } else {
        const prev = hooks[idx]
        const changed =
          !deps ||
          !prev.deps ||
          deps.length !== prev.deps.length ||
          deps.some((d, i) => !Object.is(d, prev.deps![i]))
        if (changed) {
          hooks[idx] = { val: fn(), deps }
        }
      }
      return hooks[idx].val as T
    },
    useEffect() {},
    useRef<T>(initial: T) {
      const idx = hookIndex++
      if (hooks.length <= idx) hooks[idx] = { current: initial }
      return hooks[idx] as { current: T }
    },
  }

  function rerender(newProps?: TProps) {
    if (newProps !== undefined) currentProps = newProps
    hookIndex = 0
    // @ts-expect-error accessing React internals for empirical testing
    const prevDispatcher = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H
    // @ts-expect-error accessing React internals for empirical testing
    React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H = dispatcher
    try {
      result = hookFn(currentProps)
    } finally {
      // @ts-expect-error accessing React internals for empirical testing
      React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H = prevDispatcher
    }
    return result
  }

  return {
    init(props: TProps) {
      return rerender(props)
    },
    rerender(props: TProps) {
      return rerender(props)
    },
    get current() {
      return result
    },
  }
}

describe('Adversarial Test Suite: Pin Placement, Sequential Actions & Draft Sync', () => {
  let mockStore: Record<string, string> = {}

  const sampleBooths: RaceBoothItem[] = [
    {
      boothId: 'b-1',
      boothName: 'Trạm 1',
      boothLocation: '',
      description: '',
      status: 'free',
      isHidden: false,
      currentTeamName: null,
      currentOrganizerName: null,
      mapX: null,
      mapY: null,
    },
    {
      boothId: 'b-2',
      boothName: 'Trạm 2',
      boothLocation: '',
      description: '',
      status: 'free',
      isHidden: false,
      currentTeamName: null,
      currentOrganizerName: null,
      mapX: null,
      mapY: null,
    },
    {
      boothId: 'b-3',
      boothName: 'Trạm 3',
      boothLocation: '',
      description: '',
      status: 'free',
      isHidden: false,
      currentTeamName: null,
      currentOrganizerName: null,
      mapX: null,
      mapY: null,
    },
  ]

  beforeEach(() => {
    vi.restoreAllMocks()
    mockStore = {}
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: vi.fn((k: string) => mockStore[k] ?? null),
        setItem: vi.fn((k: string, v: string) => {
          mockStore[k] = v
        }),
        removeItem: vi.fn((k: string) => {
          delete mockStore[k]
        }),
        clear: vi.fn(() => {
          mockStore = {}
        }),
        key: vi.fn(() => null),
        length: 0,
      },
      writable: true,
      configurable: true,
    })
  })

  describe('1. Multiple Sequential D&D Actions Loop', () => {
    it('executes place -> place -> move -> unplace -> move -> re-place -> place -> unplace without state leak', () => {
      const runner = createHookRunner((props: UsePinPlacementStateProps) =>
        usePinPlacementState(props),
      )

      runner.init({
        raceId: 'race-seq-1',
        booths: sampleBooths,
        isLockedDefault: false,
      })

      // Initial state: 0 placed
      expect(runner.current.placedCount).toBe(0)
      expect(runner.current.isAllPlaced).toBe(false)

      // Action 1: Place b-1 at (10, 20)
      runner.current.placePin('b-1', 10, 20)
      expect(runner.current.placedCount).toBe(1)
      expect(runner.current.placedBoothIds.has('b-1')).toBe(true)
      expect(runner.current.placedCoordinates['b-1']).toEqual({ mapX: 10, mapY: 20 })

      // Action 2: Place b-2 at (30, 40)
      runner.current.placePin('b-2', 30, 40)
      expect(runner.current.placedCount).toBe(2)
      expect(runner.current.placedBoothIds.has('b-1')).toBe(true)
      expect(runner.current.placedBoothIds.has('b-2')).toBe(true)

      // Action 3: Move b-1 to (15, 25)
      runner.current.movePin('b-1', 15, 25)
      expect(runner.current.placedCount).toBe(2)
      expect(runner.current.placedCoordinates['b-1']).toEqual({ mapX: 15, mapY: 25 })
      expect(runner.current.placedCoordinates['b-2']).toEqual({ mapX: 30, mapY: 40 })

      // Action 4: Unplace b-1 (dragged back to sidebar)
      runner.current.unplacePin('b-1')
      expect(runner.current.placedCount).toBe(1)
      expect(runner.current.placedBoothIds.has('b-1')).toBe(false)
      expect(runner.current.placedBoothIds.has('b-2')).toBe(true)
      expect(runner.current.placedCoordinates['b-1']).toBeUndefined()
      expect(runner.current.placedCoordinates['b-2']).toEqual({ mapX: 30, mapY: 40 })

      // Action 5: Move b-2 to (50, 60)
      runner.current.movePin('b-2', 50, 60)
      expect(runner.current.placedCoordinates['b-2']).toEqual({ mapX: 50, mapY: 60 })

      // Action 6: Re-place b-1 at (70, 80)
      runner.current.placePin('b-1', 70, 80)
      expect(runner.current.placedCount).toBe(2)
      expect(runner.current.placedBoothIds.has('b-1')).toBe(true)
      expect(runner.current.placedCoordinates['b-1']).toEqual({ mapX: 70, mapY: 80 })

      // Action 7: Place b-3 at (90, 95)
      runner.current.placePin('b-3', 90, 95)
      expect(runner.current.placedCount).toBe(3)
      expect(runner.current.isAllPlaced).toBe(true)

      // Action 8: Unplace b-2
      runner.current.unplacePin('b-2')
      expect(runner.current.placedCount).toBe(2)
      expect(runner.current.isAllPlaced).toBe(false)
      expect(runner.current.placedBoothIds.has('b-2')).toBe(false)
      expect(runner.current.placedBoothIds.has('b-1')).toBe(true)
      expect(runner.current.placedBoothIds.has('b-3')).toBe(true)

      // Verify draft in localStorage matches current state
      const draft = loadMapDraft('race-seq-1')
      expect(draft).toEqual({
        'b-1': { mapX: 70, mapY: 80 },
        'b-3': { mapX: 90, mapY: 95 },
      })
    })
  })

  describe('2. LocalStorage Corruption Recovery', () => {
    const key = getDraftStorageKey('race-corrupt-test')

    it('recovers gracefully from syntactically invalid JSON string in localStorage', () => {
      mockStore[key] = '{ invalid json syntax: true, '
      expect(() => loadMapDraft('race-corrupt-test')).not.toThrow()
      expect(loadMapDraft('race-corrupt-test')).toBeNull()
    })

    it('recovers gracefully from non-object JSON values (string, number, array, boolean, null)', () => {
      mockStore[key] = '"just a string"'
      expect(loadMapDraft('race-corrupt-test')).toBeNull()

      mockStore[key] = '12345'
      expect(loadMapDraft('race-corrupt-test')).toBeNull()

      mockStore[key] = 'true'
      expect(loadMapDraft('race-corrupt-test')).toBeNull()

      mockStore[key] = 'null'
      expect(loadMapDraft('race-corrupt-test')).toBeNull()

      mockStore[key] = '[1, 2, 3]'
      // In JS, typeof [] === 'object', but array entries don't have mapX/mapY numbers
      expect(loadMapDraft('race-corrupt-test')).toBeNull()
    })

    it('filters out entries with missing or non-numeric coordinate fields', () => {
      mockStore[key] = JSON.stringify({
        'b-good': { mapX: 50, mapY: 60 },
        'b-missing-y': { mapX: 50 },
        'b-missing-x': { mapY: 60 },
        'b-string-coords': { mapX: '50', mapY: '60' },
        'b-null-val': null,
        'b-undefined-val': undefined,
        'b-empty-obj': {},
      })

      const loaded = loadMapDraft('race-corrupt-test')
      expect(loaded).toEqual({
        'b-good': { mapX: 50, mapY: 60 },
      })
    })

    it('catches and defends against storage exceptions (e.g. QuotaExceeded or SecurityError)', () => {
      const failingStorage = {
        getItem: vi.fn(() => {
          throw new Error('SecurityError: The operation is insecure.')
        }),
        setItem: vi.fn(() => {
          throw new Error('QuotaExceededError: Storage quota exceeded.')
        }),
        removeItem: vi.fn(() => {
          throw new Error('AccessDenied')
        }),
      }

      Object.defineProperty(globalThis, 'localStorage', {
        value: failingStorage,
        writable: true,
        configurable: true,
      })

      expect(() => loadMapDraft('race-test')).not.toThrow()
      expect(loadMapDraft('race-test')).toBeNull()

      expect(() => saveMapDraft('race-test', { 'b-1': { mapX: 10, mapY: 10 } })).not.toThrow()
      expect(saveMapDraft('race-test', { 'b-1': { mapX: 10, mapY: 10 } })).toBe(false)

      expect(() => clearMapDraft('race-test')).not.toThrow()
    })
  })
})
