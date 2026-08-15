import { useReducer, useCallback, useEffect } from 'react'
import type {
  StationPinState,
  PinPlacementState,
} from '../buildMap.types'

/**
 * Coordinate calculation helper adhering to relative percentage math:
 * raw = (clientPos - canvasOffset) / (canvasDimension * scale) * 100
 * Clamped strictly to [0.00, 100.00], rounded to 2 decimal places.
 * Defensively returns 0 for zero/negative dimension to prevent NaN.
 */
export const calculateRelativeCoordinate = (
  clientPos: number,
  canvasOffset: number,
  canvasDimension: number,
  scale = 1,
): number => {
  if (canvasDimension <= 0) return 0
  const effectiveDimension = canvasDimension * (scale > 0 ? scale : 1)
  const raw = ((clientPos - canvasOffset) / effectiveDimension) * 100
  const clamped = Math.max(0, Math.min(100, raw))
  return Math.round(clamped * 100) / 100
}

/**
 * Normalizes station initials/codes for pin labels (e.g., '1', 'A', '12', 'T', '?').
 */
export const getStationInitial = (name?: string): string => {
  if (!name || !name.trim()) return '?'
  const trimmed = name.trim()
  const parts = trimmed.split(/\s+/)
  if (parts.length >= 2) {
    const last = parts[parts.length - 1]
    if (/^[0-9]+$/.test(last) || last.length <= 3) {
      return last
    }
  }
  return trimmed.charAt(0).toUpperCase()
}

/**
 * Filters out unplaced booths (mapX or mapY is null, undefined, or NaN).
 */
export const getUnplacedBooths = <T extends { mapX?: number | null; mapY?: number | null }>(
  booths: T[],
): T[] => {
  return booths.filter(
    (b) =>
      b.mapX === null ||
      b.mapY === null ||
      b.mapX === undefined ||
      b.mapY === undefined ||
      Number.isNaN(b.mapX) ||
      Number.isNaN(b.mapY),
  )
}

/**
 * Filters out placed booths with valid numeric percentage coordinates.
 */
export const getPlacedBooths = <T extends { mapX?: number | null; mapY?: number | null }>(
  booths: T[],
): T[] => {
  return booths.filter(
    (b) =>
      typeof b.mapX === 'number' &&
      typeof b.mapY === 'number' &&
      !Number.isNaN(b.mapX) &&
      !Number.isNaN(b.mapY) &&
      b.mapX >= 0 &&
      b.mapX <= 100 &&
      b.mapY >= 0 &&
      b.mapY <= 100,
  )
}

// Action Types
export type PinPlacementAction =
  | { type: 'SET_BOOTH_LIST'; payload: StationPinState[] }
  | { type: 'PLACE_PIN'; payload: { boothId: string; mapX: number; mapY: number } }
  | { type: 'MOVE_PIN'; payload: { boothId: string; mapX: number; mapY: number } }
  | { type: 'REMOVE_PIN'; payload: { boothId: string } }
  | { type: 'SET_LOCKED'; payload: { isLocked: boolean } }
  | { type: 'SELECT_PIN'; payload: { boothId: string | null } }
  | { type: 'RESET_PINS' }
  | { type: 'SYNC_SAVED_PINS' }

const clampCoordinate = (val: number): number => {
  if (Number.isNaN(val)) return 0
  const clamped = Math.max(0, Math.min(100, val))
  return Math.round(clamped * 100) / 100
}

export const pinPlacementReducer = (
  state: PinPlacementState,
  action: PinPlacementAction,
): PinPlacementState => {
  switch (action.type) {
    case 'SET_BOOTH_LIST': {
      return {
        ...state,
        booths: action.payload.map((b) => ({
          ...b,
          mapX: typeof b.mapX === 'number' && !Number.isNaN(b.mapX) ? clampCoordinate(b.mapX) : null,
          mapY: typeof b.mapY === 'number' && !Number.isNaN(b.mapY) ? clampCoordinate(b.mapY) : null,
        })),
        initialBooths: action.payload.map((b) => ({
          ...b,
          mapX: typeof b.mapX === 'number' && !Number.isNaN(b.mapX) ? clampCoordinate(b.mapX) : null,
          mapY: typeof b.mapY === 'number' && !Number.isNaN(b.mapY) ? clampCoordinate(b.mapY) : null,
        })),
        isDirty: false,
      }
    }

    case 'PLACE_PIN': {
      if (state.isLocked) return state
      const { boothId, mapX, mapY } = action.payload
      const clampedX = clampCoordinate(mapX)
      const clampedY = clampCoordinate(mapY)

      const updatedBooths = state.booths.map((b) =>
        b.boothId === boothId
          ? { ...b, mapX: clampedX, mapY: clampedY }
          : b,
      )

      return {
        ...state,
        booths: updatedBooths,
        selectedBoothId: boothId,
        isDirty: true,
      }
    }

    case 'MOVE_PIN': {
      if (state.isLocked) return state
      const { boothId, mapX, mapY } = action.payload
      const clampedX = clampCoordinate(mapX)
      const clampedY = clampCoordinate(mapY)

      const updatedBooths = state.booths.map((b) =>
        b.boothId === boothId
          ? { ...b, mapX: clampedX, mapY: clampedY }
          : b,
      )

      return {
        ...state,
        booths: updatedBooths,
        isDirty: true,
      }
    }

    case 'REMOVE_PIN': {
      if (state.isLocked) return state
      const { boothId } = action.payload

      const updatedBooths = state.booths.map((b) =>
        b.boothId === boothId
          ? { ...b, mapX: null, mapY: null }
          : b,
      )

      return {
        ...state,
        booths: updatedBooths,
        selectedBoothId: state.selectedBoothId === boothId ? null : state.selectedBoothId,
        isDirty: true,
      }
    }

    case 'SELECT_PIN': {
      return {
        ...state,
        selectedBoothId: action.payload.boothId,
      }
    }

    case 'SET_LOCKED': {
      return {
        ...state,
        isLocked: action.payload.isLocked,
      }
    }

    case 'RESET_PINS': {
      return {
        ...state,
        booths: state.initialBooths.map((b) => ({ ...b })),
        selectedBoothId: null,
        isDirty: false,
      }
    }

    case 'SYNC_SAVED_PINS': {
      return {
        ...state,
        initialBooths: state.booths.map((b) => ({ ...b })),
        isDirty: false,
      }
    }

    default:
      return state
  }
}

export const createInitialPinPlacementState = (
  initialBooths: StationPinState[] = [],
  isLocked = false,
): PinPlacementState => ({
  booths: initialBooths,
  initialBooths,
  isLocked,
  selectedBoothId: null,
  activeDragBoothId: null,
  isDirty: false,
})

/**
 * Custom hook managing local pin drag-and-drop state, coordinates clamping, and undo/reset actions.
 */
export const usePinPlacementState = (
  initialBoothsList: StationPinState[] = [],
  initialLocked = false,
) => {
  const [state, dispatch] = useReducer(
    pinPlacementReducer,
    createInitialPinPlacementState(initialBoothsList, initialLocked),
  )

  useEffect(() => {
    if (initialBoothsList && initialBoothsList.length > 0) {
      dispatch({ type: 'SET_BOOTH_LIST', payload: initialBoothsList })
    }
  }, [initialBoothsList])

  const setBoothList = useCallback((booths: StationPinState[]) => {
    dispatch({ type: 'SET_BOOTH_LIST', payload: booths })
  }, [])

  const placePin = useCallback((boothId: string, mapX: number, mapY: number) => {
    dispatch({ type: 'PLACE_PIN', payload: { boothId, mapX, mapY } })
  }, [])

  const movePin = useCallback((boothId: string, mapX: number, mapY: number) => {
    dispatch({ type: 'MOVE_PIN', payload: { boothId, mapX, mapY } })
  }, [])

  const removePin = useCallback((boothId: string) => {
    dispatch({ type: 'REMOVE_PIN', payload: { boothId } })
  }, [])

  const selectPin = useCallback((boothId: string | null) => {
    dispatch({ type: 'SELECT_PIN', payload: { boothId } })
  }, [])

  const setLocked = useCallback((isLocked: boolean) => {
    dispatch({ type: 'SET_LOCKED', payload: { isLocked } })
  }, [])

  const resetPins = useCallback(() => {
    dispatch({ type: 'RESET_PINS' })
  }, [])

  const syncSavedPins = useCallback(() => {
    dispatch({ type: 'SYNC_SAVED_PINS' })
  }, [])

  const unplacedBooths = getUnplacedBooths(state.booths)
  const placedBooths = getPlacedBooths(state.booths)

  return {
    state,
    booths: state.booths,
    unplacedBooths,
    placedBooths,
    isLocked: state.isLocked,
    selectedBoothId: state.selectedBoothId,
    isDirty: state.isDirty,
    setBoothList,
    placePin,
    movePin,
    removePin,
    selectPin,
    setLocked,
    resetPins,
    syncSavedPins,
  }
}

export type UsePinPlacementStateReturn = ReturnType<typeof usePinPlacementState>
