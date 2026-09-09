import { useToast } from '@/core/shared'
import { isValidMapImageFile, validateAllBoothsPlaced } from '../model/buildMap.validation'
import { usePinPlacementState } from '../model/frontend/usePinPlacementState'
import { useRaceMapQuery } from '../model/server/useRaceMapQuery'
import { useUploadRaceMapMutation } from '../model/server/useUploadRaceMapMutation'
import { useUpdateBoothCoordinatesMutation } from '../model/server/useUpdateBoothCoordinatesMutation'
import { AdminMapCanvas } from './AdminMapCanvas'
import { FrozenMapBanner } from './FrozenMapBanner'
import { MapSettingsSection } from './MapSettingsSection'
import { MapUploadCanvas } from './MapUploadCanvas'
import { StationSidebar } from './StationSidebar'

export type AdminBuildMapViewProps = {
  raceId?: string
  raceStatus?: string
  isFrozen?: boolean
  isLockedDefault?: boolean
}

/**
 * Main 2-column view composing the StationSidebar and AdminMapCanvas / MapUploadCanvas for Admin.
 * Supports station pin drag and drop, repositioning, return to sidebar, and coordinate locking.
 */
export const AdminBuildMapView = ({
  raceId,
  raceStatus,
  isFrozen: isFrozenProp,
  isLockedDefault = true,
}: AdminBuildMapViewProps) => {
  const {
    booths,
    mapImageUrl,
    isLoadingBooths,
    isErrorBooths,
    refetchBooths,
    status,
    mapDetail,
  } = useRaceMapQuery(raceId)

  const currentStatus = raceStatus ?? status ?? 'draft'
  const isFrozen =
    isFrozenProp !== undefined
      ? isFrozenProp
      : currentStatus !== 'draft' && currentStatus !== 'ready'

  const {
    placedBooths,
    placedBoothIds,
    placePin,
    movePin,
    unplacePin,
    isLocked,
    setIsLocked,
    clearDraft,
  } = usePinPlacementState({
    raceId,
    booths,
    isLockedDefault,
  })

  const uploadMutation = useUploadRaceMapMutation(raceId)
  const updateCoordinatesMutation = useUpdateBoothCoordinatesMutation(raceId)
  const { toast } = useToast()

  const handleCanvasError = (message: string) => {
    toast({
      title: 'Tệp không hợp lệ',
      description: message,
      variant: 'warning',
    })
  }

  const handleUpload = (file: File) => {
    if (!raceId || !raceId.trim()) {
      toast({
        title: 'Thiếu thông tin trận đấu',
        description: 'Không tìm thấy mã trận đấu để tải ảnh sơ đồ.',
        variant: 'danger',
      })
      return
    }

    const validation = isValidMapImageFile(file)
    if (!validation.valid) {
      toast({
        title: 'Tệp không hợp lệ',
        description: validation.error ?? 'Tệp tin không đáp ứng yêu cầu.',
        variant: 'warning',
      })
      return
    }

    uploadMutation.mutate(file, {
      onSuccess: () => {
        toast({
          title: 'Thành công',
          description: 'Tải sơ đồ trận đấu thành công.',
          variant: 'success',
        })
      },
      onError: (error) => {
        toast({
          title: 'Tải lên thất bại',
          description:
            error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải ảnh sơ đồ.',
          variant: 'danger',
        })
      },
    })
  }

  const handleToggleLock = () => {
    if (isFrozen) return

    // If currently locked, unlocking simply transitions isLocked to false
    if (isLocked) {
      setIsLocked(false)
      return
    }

    // Attempting to lock: must validate 100% booth placement
    const validation = validateAllBoothsPlaced(booths, placedBooths)
    if (!validation.isValid) {
      toast({
        title: 'Cảnh báo',
        description: 'Vui lòng kéo và xếp tất cả các trạm vào sơ đồ trước khi khóa!',
        variant: 'warning',
      })
      return
    }

    if (!raceId || !raceId.trim()) {
      toast({
        title: 'Thiếu thông tin trận đấu',
        description: 'Không tìm thấy mã trận đấu để lưu tọa độ.',
        variant: 'danger',
      })
      return
    }

    const payload = {
      coordinates: placedBooths.map((b) => ({
        boothId: b.boothId,
        mapX: Math.round((b.mapX ?? 0) * 100) / 100,
        mapY: Math.round((b.mapY ?? 0) * 100) / 100,
      })),
    }

    updateCoordinatesMutation.mutate(payload, {
      onSuccess: () => {
        setIsLocked(true)
        clearDraft()
        toast({
          title: 'Thành công',
          description: 'Đã khóa và lưu vị trí các trạm thành công!',
          variant: 'success',
        })
      },
      onError: (error) => {
        toast({
          title: 'Lưu thất bại',
          description:
            error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu tọa độ trạm.',
          variant: 'danger',
        })
      },
    })
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {isFrozen && <FrozenMapBanner />}
      <div className="flex flex-col lg:flex-row gap-2.5 h-auto lg:h-[calc(100vh-170px)] min-h-[560px] w-full">
        <StationSidebar
          booths={booths}
          isLoading={isLoadingBooths}
          isError={isErrorBooths}
          onRetry={() => void refetchBooths()}
          placedBoothIds={placedBoothIds}
          isLocked={isFrozen ? true : isLocked}
          isFrozen={isFrozen}
          onUnplaceStation={unplacePin}
        />
        {mapImageUrl ? (
          <AdminMapCanvas
            mapImageUrl={mapImageUrl}
            placedBooths={placedBooths}
            isLocked={isFrozen ? true : isLocked}
            isFrozen={isFrozen}
            onPlacePin={placePin}
            onMovePin={movePin}
            onUnplacePin={unplacePin}
            onUploadNewMap={handleUpload}
            onError={handleCanvasError}
            isUploading={uploadMutation.isPending}
            onToggleLock={handleToggleLock}
            isSaving={updateCoordinatesMutation.isPending}
          />
        ) : (
          <MapUploadCanvas
            mapImageUrl={mapImageUrl}
            isUploading={uploadMutation.isPending}
            onUpload={handleUpload}
            onError={handleCanvasError}
          />
        )}
      </div>
      <MapSettingsSection
        raceId={raceId}
        isFrozen={isFrozen}
        settings={{
          isShowHiddenBooths: mapDetail?.isShowHiddenBooths ?? false,
          isHideBoothDescription: mapDetail?.isHideBoothDescription ?? false,
          isDisabledBoothStatus: mapDetail?.isDisabledBoothStatus ?? false,
          modifiedAt: mapDetail?.modifiedAt,
        }}
      />
    </div>
  )
}
