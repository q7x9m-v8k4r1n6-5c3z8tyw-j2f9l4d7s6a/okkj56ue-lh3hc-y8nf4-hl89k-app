import { useCallback, useMemo, useState } from 'react'
import type { RaceBoothItem } from '../buildMap.contract'
import {
  clearMapDraft,
  loadMapDraft,
  saveMapDraft,
  type PinCoordinateRecord,
} from './useMapDraftStorage'

export interface UsePinPlacementStateProps {
  raceId?: string
  booths: RaceBoothItem[]
  isLockedDefault?: boolean
}

function computeInitialCoords(
  raceId?: string,
  booths: RaceBoothItem[] = [],
): PinCoordinateRecord {
  if (!booths || booths.length === 0) return {}
  const serverCoords: PinCoordinateRecord = {}
  booths.forEach((b) => {
    if (b.mapX != null && b.mapY != null) {
      serverCoords[b.boothId] = { mapX: b.mapX, mapY: b.mapY }
    }
  })
  const draftCoords = loadMapDraft(raceId)
  if (draftCoords !== null) {
    const validBoothIds = new Set(booths.map((b) => b.boothId))
    const filteredDraft: PinCoordinateRecord = {}
    for (const [id, coord] of Object.entries(draftCoords)) {
      if (validBoothIds.has(id)) {
        filteredDraft[id] = coord
      }
    }
    return filteredDraft
  }
  return serverCoords
}

export function usePinPlacementState({
  raceId,
  booths,
  isLockedDefault = true,
}: UsePinPlacementStateProps) {
  const [prevRaceId, setPrevRaceId] = useState(raceId)
  const [prevBooths, setPrevBooths] = useState(booths)
  const [hasUserEdited, setHasUserEdited] = useState(false)
  const [placedCoordinates, setPlacedCoordinates] = useState<PinCoordinateRecord>(() =>
    computeInitialCoords(raceId, booths),
  )
  const [isLocked, setIsLocked] = useState(isLockedDefault)

  let currentCoords = placedCoordinates

  // 1. Race ID changed (navigation across different races)
  if (prevRaceId !== raceId) {
    setPrevRaceId(raceId)
    setPrevBooths(booths)
    setHasUserEdited(false)
    const newCoords = computeInitialCoords(raceId, booths)
    setPlacedCoordinates(newCoords)
    currentCoords = newCoords
  }
  // 2. Initial hydration when server booths arrive asynchronously (booths: [] -> populated)
  else if (prevBooths.length === 0 && booths.length > 0) {
    setPrevBooths(booths)
    if (!hasUserEdited) {
      const newCoords = computeInitialCoords(raceId, booths)
      setPlacedCoordinates(newCoords)
      currentCoords = newCoords
    }
  }
  // 3. Server booths updated in background when user has no active draft or in-progress edits
  else if (!hasUserEdited && prevBooths !== booths) {
    setPrevBooths(booths)
    const draft = loadMapDraft(raceId)
    if (draft === null) {
      const newCoords = computeInitialCoords(raceId, booths)
      setPlacedCoordinates(newCoords)
      currentCoords = newCoords
    }
  }

  const updateCoordinates = useCallback(
    (updater: (prev: PinCoordinateRecord) => PinCoordinateRecord) => {
      setHasUserEdited(true)
      setPlacedCoordinates((prev) => {
        const next = updater(prev)
        saveMapDraft(raceId, next)
        return next
      })
    },
    [raceId],
  )

  const placePin = useCallback(
    (boothId: string, mapX: number, mapY: number) => {
      updateCoordinates((prev) => ({
        ...prev,
        [boothId]: { mapX, mapY },
      }))
    },
    [updateCoordinates],
  )

  const movePin = useCallback(
    (boothId: string, mapX: number, mapY: number) => {
      updateCoordinates((prev) => ({
        ...prev,
        [boothId]: { mapX, mapY },
      }))
    },
    [updateCoordinates],
  )

  const unplacePin = useCallback(
    (boothId: string) => {
      updateCoordinates((prev) => {
        const next = { ...prev }
        delete next[boothId]
        return next
      })
    },
    [updateCoordinates],
  )

  const clearDraft = useCallback(() => {
    clearMapDraft(raceId)
    setHasUserEdited(false)
  }, [raceId])

  const placedBooths = useMemo(() => {
    return booths
      .filter((b) => currentCoords[b.boothId] != null)
      .map((b) => ({
        ...b,
        mapX: currentCoords[b.boothId].mapX,
        mapY: currentCoords[b.boothId].mapY,
      }))
  }, [booths, currentCoords])

  const placedBoothIds = useMemo(() => {
    return new Set(Object.keys(currentCoords))
  }, [currentCoords])

  const totalCount = booths.length
  const placedCount = placedBooths.length
  const isAllPlaced = totalCount > 0 && placedCount === totalCount
  const hasInitialized = true

  return {
    placedCoordinates: currentCoords,
    placedBooths,
    placedBoothIds,
    placePin,
    movePin,
    unplacePin,
    clearDraft,
    isLocked,
    setIsLocked,
    isAllPlaced,
    placedCount,
    totalCount,
    hasInitialized,
  }
}
