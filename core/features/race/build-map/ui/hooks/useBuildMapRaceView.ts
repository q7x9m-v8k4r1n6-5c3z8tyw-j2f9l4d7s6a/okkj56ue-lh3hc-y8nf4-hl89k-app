import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useToast } from '@/core/shared'
import { useBuildMapState } from '../../model/frontend/useBuildMapState'
import { usePinPlacementState } from '../../model/frontend/usePinPlacementState'
import { useRaceMapQuery } from '../../model/server/useRaceMapQuery'
import { useSaveMapMutation } from '../../model/server/useSaveMapMutation'
import { useSaveBoothCoordinatesMutation } from '../../model/server/useSaveBoothCoordinatesMutation'
import { mapStationsToCoordinatesPayload } from '../../model/mapBoothListToStations'
import type { StationItem } from '../../model/buildMap.types'

/**
 * Extracts a readable error message from Error instances or API error objects.
 */
export const getBuildMapErrorMessage = (
  error: unknown,
  fallback = 'Không thể lưu bản đồ trận đấu. Vui lòng thử lại.',
): string => {
  if (error instanceof Error && error.message) return error.message
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message
  }
  return fallback
}

/**
 * View-model hook for BuildMapRaceView.
 * Connects frontend state, server queries, pin placement, coordinate locking,
 * and Azure upload mutations to presentational UI components.
 */
export const useBuildMapRaceView = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const { toast } = useToast()

  const mapQuery = useRaceMapQuery(raceId)
  const saveMapMutation = useSaveMapMutation(raceId)
  const saveBoothCoordinatesMutation = useSaveBoothCoordinatesMutation(raceId)

  const isDraft = mapQuery.status?.toLowerCase() === 'draft'
  const isLockedPermanent = !isDraft

  // Map image state
  const {
    file,
    previewUrl,
    persistedUrl,
    isDirty: isFileDirty,
    error: localError,
    selectFile,
    cancelChanges,
    saveSuccess,
    removeFile,
    clearError,
  } = useBuildMapState(mapQuery.mapImageUrl)

  // Pin placement state
  const initialPinState = useMemo(() => {
    return (mapQuery.stations || []).map((s) => ({
      boothId: s.id,
      boothName: s.name,
      boothLocation: s.place || '',
      description: s.description || '',
      status: s.status || 'free',
      isHidden: Boolean(s.isHidden),
      stationType: s.stationType || (s.isHidden ? 'Trạm ẩn' : 'Trạm thường'),
      currentTeamName: s.currentTeamName ?? null,
      currentOrganizerName: s.currentOrganizerName ?? null,
      mapX: typeof s.mapX === 'number' && !Number.isNaN(s.mapX) ? s.mapX : null,
      mapY: typeof s.mapY === 'number' && !Number.isNaN(s.mapY) ? s.mapY : null,
    }))
  }, [mapQuery.stations])

  const pinPlacement = usePinPlacementState(initialPinState, isLockedPermanent)

  const isLocked = isLockedPermanent || pinPlacement.isLocked

  const displayStations: StationItem[] = useMemo(() => {
    return pinPlacement.booths.map((b) => ({
      id: b.boothId,
      name: b.boothName,
      stationType: b.stationType || (b.isHidden ? 'Trạm ẩn' : 'Trạm thường'),
      isHidden: b.isHidden,
      place: b.boothLocation,
      status: b.status,
      description: b.description,
      managerName: b.currentOrganizerName ?? undefined,
      currentTeamName: b.currentTeamName,
      currentOrganizerName: b.currentOrganizerName,
      mapX: b.mapX,
      mapY: b.mapY,
      isPlaced:
        typeof b.mapX === 'number' &&
        typeof b.mapY === 'number' &&
        !Number.isNaN(b.mapX) &&
        !Number.isNaN(b.mapY),
    }))
  }, [pinPlacement.booths])

  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null)

  const handleSaveMap = useCallback(async () => {
    if (!file) return

    setSaveErrorMessage(null)
    try {
      const result = await saveMapMutation.mutateAsync({
        file,
      })

      saveSuccess(result.mapImageUrl)
      toast({
        title: 'Thành công',
        description: 'Bản đồ trận đấu đã được lưu thành công.',
        variant: 'success',
      })
    } catch (err: unknown) {
      const errorMsg = getBuildMapErrorMessage(err)
      setSaveErrorMessage(errorMsg)
      toast({
        title: 'Lỗi',
        description: errorMsg,
        variant: 'danger',
      })
    }
  }, [file, saveMapMutation, saveSuccess, toast])

  const handleToggleLock = useCallback(async () => {
    if (!isDraft) return

    if (!pinPlacement.isLocked) {
      // Currently unlocked, user wants to lock and persist coordinates
      setSaveErrorMessage(null)
      try {
        const payload = mapStationsToCoordinatesPayload(pinPlacement.booths)
        await saveBoothCoordinatesMutation.mutateAsync({ payload })
        pinPlacement.setLocked(true)
        pinPlacement.syncSavedPins()
        toast({
          title: 'Thành công',
          description: 'Đã khóa và lưu vị trí các trạm thành công!',
          variant: 'success',
        })
      } catch (err: unknown) {
        const errorMsg = getBuildMapErrorMessage(
          err,
          'Lỗi kết nối máy chủ khi lưu toạ độ trạm.',
        )
        setSaveErrorMessage(errorMsg)
        toast({
          title: 'Lỗi',
          description: errorMsg,
          variant: 'danger',
        })
      }
    } else {
      // Currently locked in Draft mode, user wants to unlock
      pinPlacement.setLocked(false)
    }
  }, [isDraft, pinPlacement, saveBoothCoordinatesMutation, toast])

  const handleCancelEdit = useCallback(() => {
    setSaveErrorMessage(null)
    cancelChanges()
    pinPlacement.resetPins()
  }, [cancelChanges, pinPlacement])

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      setSaveErrorMessage(null)
      selectFile(selectedFile)
    },
    [selectFile],
  )

  const handleRemoveImage = useCallback(() => {
    setSaveErrorMessage(null)
    removeFile()
  }, [removeFile])

  const handleClearError = useCallback(() => {
    setSaveErrorMessage(null)
    clearError()
  }, [clearError])

  const handleStationDrop = useCallback(
    (stationId: string, mapX: number, mapY: number) => {
      pinPlacement.placePin(stationId, mapX, mapY)
    },
    [pinPlacement],
  )

  const handleStationSelect = useCallback(
    (stationId: string) => {
      pinPlacement.selectPin(
        stationId === pinPlacement.selectedBoothId ? null : stationId,
      )
    },
    [pinPlacement],
  )

  const handleStationRemovePin = useCallback(
    (stationId: string) => {
      pinPlacement.removePin(stationId)
    },
    [pinPlacement],
  )

  const handleClose = useCallback(() => {
    window.history.back()
  }, [])

  const activeError = saveErrorMessage || localError
  const isDirty = isFileDirty || pinPlacement.isDirty

  return {
    raceId,
    stations: displayStations,
    unplacedStations: pinPlacement.unplacedBooths,
    placedStations: pinPlacement.placedBooths,
    selectedStationId: pinPlacement.selectedBoothId,
    isStationsLoading: mapQuery.isLoading,
    file,
    previewUrl,
    persistedUrl,
    isDirty,
    isSaving: saveMapMutation.isPending,
    isLockSaving: saveBoothCoordinatesMutation.isPending,
    error: activeError,
    hasImage: Boolean(previewUrl),
    isLocked,
    isDraft,
    fileName: file?.name || 'Bản đồ trận đấu',
    fileSize: file?.size,
    onFileSelect: handleFileSelect,
    onSaveMap: handleSaveMap,
    onCancelEdit: handleCancelEdit,
    onRemoveImage: handleRemoveImage,
    onClearError: handleClearError,
    onStationDrop: handleStationDrop,
    onStationSelect: handleStationSelect,
    onStationRemovePin: handleStationRemovePin,
    onToggleLock: handleToggleLock,
    onClose: handleClose,
  }
}

export type UseBuildMapRaceViewReturn = ReturnType<typeof useBuildMapRaceView>

