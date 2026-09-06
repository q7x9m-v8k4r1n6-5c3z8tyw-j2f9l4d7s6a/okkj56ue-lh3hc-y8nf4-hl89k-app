import { useToast } from '@/core/shared'
import { isValidMapImageFile } from '../model/buildMap.validation'
import { useRaceMapQuery } from '../model/server/useRaceMapQuery'
import { useUploadRaceMapMutation } from '../model/server/useUploadRaceMapMutation'
import { MapUploadCanvas } from './MapUploadCanvas'
import { StationSidebar } from './StationSidebar'

export type AdminBuildMapViewProps = {
  raceId?: string
}

/**
 * Main 2-column view composing the StationSidebar and MapUploadCanvas for Admin.
 * Follows Figma node 1719:1328.
 */
export const AdminBuildMapView = ({ raceId }: AdminBuildMapViewProps) => {
  const {
    booths,
    mapImageUrl,
    isLoadingBooths,
    isErrorBooths,
    refetchBooths,
  } = useRaceMapQuery(raceId)

  const uploadMutation = useUploadRaceMapMutation(raceId)
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

  return (
    <div className="flex flex-col lg:flex-row gap-2.5 h-auto lg:h-[calc(100vh-170px)] min-h-[560px] w-full">
      <StationSidebar
        booths={booths}
        isLoading={isLoadingBooths}
        isError={isErrorBooths}
        onRetry={() => void refetchBooths()}
      />
      <MapUploadCanvas
        mapImageUrl={mapImageUrl}
        isUploading={uploadMutation.isPending}
        onUpload={handleUpload}
        onError={handleCanvasError}
      />
    </div>
  )
}
