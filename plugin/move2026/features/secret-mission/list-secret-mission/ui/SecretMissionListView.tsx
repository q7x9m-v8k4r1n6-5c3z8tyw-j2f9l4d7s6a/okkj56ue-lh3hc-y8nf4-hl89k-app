import { Skeleton } from '@/core/shared'
import { formatGmt7Time } from '@/core/shared/utils'
import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout' 
import { formatSecretMissionName } from '@/plugin/move2026/features/secret-mission/shared/formatSecretMissionName'
import { useSecretMissionListView } from './hooks/useSecretMissionListView'

export const SecretMissionListView = () => {
  const view = useSecretMissionListView()

  return (
    <MobileScreenLayout
      title="Danh sách các nhiệm vụ bí mật và Tech Cache"
      onBack={view.handleBack}
      contentClassName="px-3 pb-24" // Thêm pb-24 để không bị thanh Bottom Menu đè bấm không ăn
    >
      <div className="overflow-hidden rounded-[20px] border border-[#e2e2e2] bg-white shadow-sm divide-y divide-[#f5f5f5]">
        {view.isLoading ? (
          <div className="p-4 space-y-3">
            <Skeleton lines={1} className="h-5 w-1/2" />
            <Skeleton lines={1} className="h-5 w-1/3" />
            <Skeleton lines={1} className="h-5 w-2/3" />
          </div>
        ) : view.isError ? (
          <div className="py-10 text-center italic text-red-500">
            Không thể tải danh sách nhiệm vụ.
          </div>
        ) : view.missions?.length === 0 ? (
          <div className="py-10 text-center italic text-gray-400">
            Chưa có nhiệm vụ bí mật nào.
          </div>
        ) : (
          view.missions?.map((mission) => (
            <button
              key={mission.id}
              type="button"
              onClick={() => view.handleRowClick(mission.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 focus:outline-none"
            >
              <div className="flex max-w-[65%] shrink-0 flex-col items-start">
                <span
                  className={`block max-w-full truncate text-xs font-medium underline underline-offset-4 ${
                    mission.isCompleted ? 'text-[#166534]' : 'text-[#5e5e5e]'
                  }`}
                  title={formatSecretMissionName(mission.name, mission.isAssigned)}
                >
                  {formatSecretMissionName(mission.name, mission.isAssigned)}
                </span>
              </div>

              {mission.lastUpdatedAt ? (
                <div className="flex max-w-[35%] shrink-0 flex-col items-end text-right">
                  <span className="text-xs leading-snug text-[#8a8a8a]">
                    Cập nhật lần cuối lúc {formatGmt7Time(mission.lastUpdatedAt)}
                  </span>
                </div>
              ) : null}
            </button>
          ))
        )}
      </div>
    </MobileScreenLayout>
  )
}