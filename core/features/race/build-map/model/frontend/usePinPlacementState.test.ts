import { describe, expect, it, beforeEach, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { RaceBoothItem } from '../buildMap.contract'
import { usePinPlacementState, type UsePinPlacementStateProps } from './usePinPlacementState'
import * as draftStorageModule from './useMapDraftStorage'

describe('usePinPlacementState', () => {
  const mockBooths: RaceBoothItem[] = [
    {
      boothId: 'b-1',
      boothName: 'Trạm 1',
      boothLocation: '',
      description: '',
      status: '',
      isHidden: false,
      mapX: 30,
      mapY: 40,
    },
    {
      boothId: 'b-2',
      boothName: 'Trạm 2',
      boothLocation: '',
      description: '',
      status: '',
      isHidden: false,
      mapX: null,
      mapY: null,
    },
  ]

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes placed coordinates from server booths', () => {
    let capturedState: ReturnType<typeof usePinPlacementState> | null = null

    function Harness(props: UsePinPlacementStateProps) {
      capturedState = usePinPlacementState(props)
      return React.createElement('div', { 'data-count': capturedState.placedCount })
    }

    vi.spyOn(draftStorageModule, 'loadMapDraft').mockReturnValue(null)

    renderToStaticMarkup(
      React.createElement(Harness, { raceId: 'race-1', booths: mockBooths }),
    )

    expect(capturedState).not.toBeNull()
    expect(capturedState!.placedCount).toBe(1)
    expect(capturedState!.totalCount).toBe(2)
    expect(capturedState!.isAllPlaced).toBe(false)
    expect(capturedState!.placedBoothIds.has('b-1')).toBe(true)
    expect(capturedState!.placedBoothIds.has('b-2')).toBe(false)
    expect(capturedState!.placedCoordinates['b-1']).toEqual({ mapX: 30, mapY: 40 })
    expect(capturedState!.isLocked).toBe(true) // Safe default
  })

  it('prefers localStorage draft coordinates over server coordinates', () => {
    let capturedState: ReturnType<typeof usePinPlacementState> | null = null

    function Harness(props: UsePinPlacementStateProps) {
      capturedState = usePinPlacementState(props)
      return React.createElement('div', { 'data-count': capturedState.placedCount })
    }

    const draftCoords = {
      'b-1': { mapX: 90, mapY: 95 },
      'b-2': { mapX: 15, mapY: 25 },
    }
    vi.spyOn(draftStorageModule, 'loadMapDraft').mockReturnValue(draftCoords)

    renderToStaticMarkup(
      React.createElement(Harness, { raceId: 'race-1', booths: mockBooths }),
    )

    expect(capturedState).not.toBeNull()
    expect(capturedState!.placedCount).toBe(2)
    expect(capturedState!.isAllPlaced).toBe(true)
    expect(capturedState!.placedCoordinates['b-1']).toEqual({ mapX: 90, mapY: 95 })
    expect(capturedState!.placedCoordinates['b-2']).toEqual({ mapX: 15, mapY: 25 })
  })

  it('respects an empty draft {} and does not resurrect server pins', () => {
    let capturedState: ReturnType<typeof usePinPlacementState> | null = null

    function Harness(props: UsePinPlacementStateProps) {
      capturedState = usePinPlacementState(props)
      return React.createElement('div', { 'data-count': capturedState.placedCount })
    }

    vi.spyOn(draftStorageModule, 'loadMapDraft').mockReturnValue({})

    renderToStaticMarkup(
      React.createElement(Harness, { raceId: 'race-1', booths: mockBooths }),
    )

    expect(capturedState).not.toBeNull()
    expect(capturedState!.placedCount).toBe(0)
    expect(capturedState!.placedCoordinates).toEqual({})
    expect(capturedState!.placedBoothIds.size).toBe(0)
  })

  it('respects custom isLockedDefault', () => {
    let capturedState: ReturnType<typeof usePinPlacementState> | null = null

    function Harness(props: UsePinPlacementStateProps) {
      capturedState = usePinPlacementState(props)
      return React.createElement('div', null, String(capturedState.isLocked))
    }

    renderToStaticMarkup(
      React.createElement(Harness, {
        raceId: 'race-1',
        booths: mockBooths,
        isLockedDefault: false,
      }),
    )

    expect(capturedState!.isLocked).toBe(false)
  })

  it('calls clearMapDraft when clearDraft is invoked', () => {
    const clearDraftSpy = vi.spyOn(draftStorageModule, 'clearMapDraft')
    let capturedState: ReturnType<typeof usePinPlacementState> | null = null

    function Harness(props: UsePinPlacementStateProps) {
      capturedState = usePinPlacementState(props)
      return React.createElement('div')
    }

    renderToStaticMarkup(
      React.createElement(Harness, { raceId: 'race-clear-test', booths: mockBooths }),
    )

    capturedState!.clearDraft()
    expect(clearDraftSpy).toHaveBeenCalledWith('race-clear-test')
  })
})
