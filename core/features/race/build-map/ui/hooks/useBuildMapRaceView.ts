import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useToast } from '@/core/shared'
import { useBuildMapState } from '../../model/frontend/useBuildMapState'
import { useRaceMapQuery } from '../../model/server/useRaceMapQuery'
import { useSaveMapMutation } from '../../model/server/useSaveMapMutation'

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
 * Connects frontend state, server queries, and Azure upload mutations to presentational UI components.
 */
export const useBuildMapRaceView = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const { toast } = useToast()

  const mapQuery = useRaceMapQuery(raceId)
  const saveMutation = useSaveMapMutation(raceId)

  const {
    file,
    previewUrl,
    persistedUrl,
    isDirty,
    error: localError,
    selectFile,
    cancelChanges,
    saveSuccess,
    removeFile,
    clearError,
  } = useBuildMapState(mapQuery.mapImageUrl)

  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null)

  const handleSaveMap = useCallback(async () => {
    if (!file) return

    setSaveErrorMessage(null)
    try {
      const result = await saveMutation.mutateAsync({
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
  }, [file, saveMutation, saveSuccess, toast])

  const handleCancelEdit = useCallback(() => {
    setSaveErrorMessage(null)
    cancelChanges()
  }, [cancelChanges])

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

  const activeError = saveErrorMessage || localError

  return {
    raceId,
    stations: mapQuery.stations,
    isStationsLoading: mapQuery.isLoading,
    file,
    previewUrl,
    persistedUrl,
    isDirty,
    isSaving: saveMutation.isPending,
    error: activeError,
    hasImage: Boolean(previewUrl),
    isLocked: mapQuery.status !== 'draft',
    fileName: file?.name || 'Bản đồ trận đấu',
    fileSize: file?.size,
    onFileSelect: handleFileSelect,
    onSaveMap: handleSaveMap,
    onCancelEdit: handleCancelEdit,
    onRemoveImage: handleRemoveImage,
    onClearError: handleClearError,
  }
}

export type UseBuildMapRaceViewReturn = ReturnType<typeof useBuildMapRaceView>

