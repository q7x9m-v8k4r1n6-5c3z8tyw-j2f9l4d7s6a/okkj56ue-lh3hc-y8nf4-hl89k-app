import { describe, expect, it, beforeEach, vi } from 'vitest'
import React from 'react'
import type { RaceBoothItem } from '../../model/buildMap.contract'
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

describe('Adversarial Test Suite 1: usePinPlacementState Lifecycle & Edge Cases', () => {
  let mockStore: Record<string, string> = {}

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

  it('CRITICAL BUG PROBE 1: Server booths arriving asynchronously after initial mount with empty booths', () => {
    const boothWithCoords: RaceBoothItem = {
      boothId: 'b-1',
      boothName: 'Trạm 1',
      boothLocation: '',
      description: '',
      status: 'free',
      isHidden: false,
      currentTeamName: null,
      currentOrganizerName: null,
      mapX: 45,
      mapY: 55,
    }

    const runner = createHookRunner((props: UsePinPlacementStateProps) =>
      usePinPlacementState(props),
    )

    // Render 1: React Query is loading, booths is empty []
    runner.init({
      raceId: 'race-async-1',
      booths: [],
      isLockedDefault: true,
    })

    expect(runner.current.placedCount).toBe(0)
    expect(runner.current.placedCoordinates).toEqual({})

    // Render 2: React Query resolves with server booth having coordinates (45, 55)
    runner.rerender({
      raceId: 'race-async-1',
      booths: [boothWithCoords],
      isLockedDefault: true,
    })

    console.log('BUG PROBE 1 RESULT:', {
      placedCount: runner.current.placedCount,
      placedCoordinates: runner.current.placedCoordinates,
      placedBooths: runner.current.placedBooths,
    })

    // EXPECTATION: Since server booth has mapX: 45, mapY: 55, it should be placed!
    // If bug exists, placedCount will be 0 and placedCoordinates will be {}!
    expect(runner.current.placedCount).toBe(1)
    expect(runner.current.placedCoordinates['b-1']).toEqual({ mapX: 45, mapY: 55 })
  })

  it('CRITICAL BUG PROBE 2: Unplacing the only placed booth, saving draft as empty {}, and tab switching', () => {
    const serverBooth: RaceBoothItem = {
      boothId: 'b-1',
      boothName: 'Trạm 1',
      boothLocation: '',
      description: '',
      status: 'free',
      isHidden: false,
      currentTeamName: null,
      currentOrganizerName: null,
      mapX: 45,
      mapY: 55,
    }

    // Step 1: User visits map tab with b-1 placed on server
    const runner1 = createHookRunner((props: UsePinPlacementStateProps) =>
      usePinPlacementState(props),
    )
    runner1.init({
      raceId: 'race-tab-switch-1',
      booths: [serverBooth],
      isLockedDefault: false,
    })

    expect(runner1.current.placedCount).toBe(1)
    expect(runner1.current.placedCoordinates['b-1']).toEqual({ mapX: 45, mapY: 55 })

    // Step 2: User unplaces b-1 (drags back to sidebar)
    runner1.current.unplacePin('b-1')

    // Placed count should now be 0, placedCoordinates should be {}
    expect(runner1.current.placedCount).toBe(0)
    expect(runner1.current.placedCoordinates).toEqual({})

    // Verify what was written to localStorage
    const savedDraftRaw = localStorage.getItem('race_map_draft_race-tab-switch-1')
    console.log('SAVED DRAFT IN LOCALSTORAGE:', savedDraftRaw)
    expect(savedDraftRaw).toBe('{}')

    // Step 3: Simulate Tab Switch (Component unmounts, user visits Basic tab, then returns to Map tab)
    const runner2 = createHookRunner((props: UsePinPlacementStateProps) =>
      usePinPlacementState(props),
    )
    runner2.init({
      raceId: 'race-tab-switch-1',
      booths: [serverBooth],
      isLockedDefault: true,
    })

    console.log('AFTER TAB SWITCH RESULT:', {
      placedCount: runner2.current.placedCount,
      placedCoordinates: runner2.current.placedCoordinates,
    })

    // EXPECTATION: User unplaced b-1, so returning to Map tab MUST retain the unplaced state!
    // b-1 MUST NOT resurrect back onto the map!
    // If bug exists, loadMapDraft returns null, falling back to serverCoords, resurrecting b-1!
    expect(runner2.current.placedCount).toBe(0)
    expect(runner2.current.placedCoordinates).toEqual({})
  })
})
