import { formatSecretMissionName } from '@/plugin/move2026/features/secret-mission/shared/formatSecretMissionName'
import { useAdminSecretMissionDetailView } from './hooks/useAdminSecretMissionDetailView'

type AdminSecretMissionDetailViewProps = {
  missionId: string
  onBack: () => void
}

export const AdminSecretMissionDetailView = ({ missionId, onBack }: AdminSecretMissionDetailViewProps) => {
  const view = useAdminSecretMissionDetailView(missionId)

  if (view.isLoading) {
    return <p className="py-10 text-center text-sm text-gray-500">Đang tải...</p>
  }

  if (view.isError || !view.mission) {
    return (
      <div className="space-y-3">
        <button onClick={onBack} className="text-sm text-[#5d0004]">&larr; Quay lại</button>
        <p className="text-sm text-red-600">Không thể tải chi tiết nhiệm vụ.</p>
      </div>
    )
  }

  const { mission } = view

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm font-medium text-[#5d0004]">
        &larr; Quay lại danh sách
      </button>

      <div>
        <h2 className="text-lg font-bold text-[#1a1c1c]">
          {formatSecretMissionName(mission.name, mission.isAssigned)}
        </h2>
        <p className="text-sm text-[#8a8a8a]">Đội: {mission.teamName ?? 'Chưa có đội'}</p>
      </div>

      <p className="whitespace-pre-wrap text-sm text-[#333]">{mission.description}</p>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-[#1a1c1c]">Minh chứng hình ảnh</h3>
        {mission.evidenceImageUrls?.length ? (
          <div className="grid grid-cols-3 gap-2">
            {mission.evidenceImageUrls.map((file) => (
              <a key={file.id} href={file.url} target="_blank" rel="noreferrer">
                <img src={file.url} className="aspect-square w-full rounded-lg object-cover" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Chưa có minh chứng hình ảnh.</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-[#1a1c1c]">Minh chứng video</h3>
        {mission.evidenceVideoUrls?.length ? (
          <div className="grid grid-cols-2 gap-2">
            {mission.evidenceVideoUrls.map((file) => (
              <video key={file.id} src={file.url} controls className="w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Chưa có minh chứng video.</p>
        )}
      </div>
    </div>
  )
}