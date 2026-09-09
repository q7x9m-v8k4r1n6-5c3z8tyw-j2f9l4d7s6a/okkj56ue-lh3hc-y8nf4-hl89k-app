import { useCallback } from 'react'

export type PinCoordinateRecord = Record<string, { mapX: number; mapY: number }>

export const getDraftStorageKey = (raceId: string): string =>
  `race_map_draft_${raceId}`

function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage
    }
  } catch {
    return null
  }
  return null
}

/**
 * Saves pin coordinates to localStorage under key `race_map_draft_${raceId}`.
 * Safely wrapped in try-catch to handle storage errors or restricted environments.
 */
export function saveMapDraft(
  raceId?: string | null,
  coordinates?: PinCoordinateRecord,
): boolean {
  if (!raceId || !raceId.trim() || !coordinates) {
    return false
  }

  try {
    const storage = getStorage()
    if (!storage) return false
    const key = getDraftStorageKey(raceId)
    storage.setItem(key, JSON.stringify(coordinates))
    return true
  } catch {
    return false
  }
}

/**
 * Loads pin coordinates from localStorage for a given raceId.
 * Validates data structure and returns null if absent or malformed.
 */
export function loadMapDraft(
  raceId?: string | null,
): PinCoordinateRecord | null {
  if (!raceId || !raceId.trim()) {
    return null
  }

  try {
    const storage = getStorage()
    if (!storage) return null
    const key = getDraftStorageKey(raceId)
    const raw = storage.getItem(key)
    if (raw === null || raw === undefined) return null

    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return null
    }

    // If parsed was an empty object {}, return {} (valid empty draft representing 0 placed pins)
    if (Object.keys(parsed).length === 0) {
      return {}
    }

    // Validate that entries have valid mapX and mapY numbers
    const validated: PinCoordinateRecord = {}
    for (const [id, coord] of Object.entries(parsed)) {
      if (
        coord &&
        typeof coord === 'object' &&
        typeof (coord as { mapX?: unknown }).mapX === 'number' &&
        typeof (coord as { mapY?: unknown }).mapY === 'number' &&
        !Number.isNaN((coord as { mapX: number }).mapX) &&
        !Number.isNaN((coord as { mapY: number }).mapY)
      ) {
        validated[id] = {
          mapX: (coord as { mapX: number }).mapX,
          mapY: (coord as { mapY: number }).mapY,
        }
      }
    }

    return Object.keys(validated).length > 0 ? validated : null
  } catch {
    return null
  }
}

/**
 * Removes the draft coordinates for a given raceId from localStorage.
 */
export function clearMapDraft(raceId?: string | null): void {
  if (!raceId || !raceId.trim()) {
    return
  }

  try {
    const storage = getStorage()
    if (!storage) return
    const key = getDraftStorageKey(raceId)
    storage.removeItem(key)
  } catch {
    // Ignore storage deletion errors
  }
}

/**
 * React hook interface for interacting with race map draft storage.
 */
export function useMapDraftStorage(raceId?: string) {
  const saveDraft = useCallback(
    (coordinates: PinCoordinateRecord) => saveMapDraft(raceId, coordinates),
    [raceId],
  )

  const loadDraft = useCallback(() => loadMapDraft(raceId), [raceId])

  const clearDraft = useCallback(() => clearMapDraft(raceId), [raceId])

  return {
    saveDraft,
    loadDraft,
    clearDraft,
  }
}
