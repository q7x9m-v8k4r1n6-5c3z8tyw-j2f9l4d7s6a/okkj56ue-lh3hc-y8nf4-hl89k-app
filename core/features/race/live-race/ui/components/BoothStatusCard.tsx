import { MapIcon } from '@/core/assets/icons'
import { Skeleton } from '@/core/shared'
import { useBoothListSection } from '../hooks/useBoothListSection'
import { SectionHeader } from './SectionHeader'

export const BoothStatusCard = ({ raceId }: { raceId?: string }) => {
  // Tự gọi Hook lấy data theo chuẩn FSD, bổ sung isError
  const { items, isLoading, isError } = useBoothListSection(raceId)

  return (
    <div className="flex flex-col bg-white">
      <SectionHeader icon={<MapIcon className="size-5" />} title="Trạng Thái Các Trạm" />
      <div className=" overflow-y-auto pr-2">
        {isLoading ? (
          <Skeleton lines={2} className="h-[80px]" />
        ) : isError ? (
          <div className="text-sm italic text-red-500">Lỗi tải dữ liệu. Hãy kiểm tra lại API.</div>
        ) : items.length === 0 ? (
          <div className="text-sm italic text-gray-400">Chưa có trạm nào được thiết lập.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {items.map((booth) => {
              const isFree = booth.status.toLowerCase() === 'free'
              return (
                <div
                  key={booth.boothId}
                  className={`flex h-[130px] flex-col items-center justify-center rounded-lg p-2 text-center ${
                    isFree ? 'bg-[#f0fdf4]' : 'bg-[#fcd0d1]'
                  }`}
                >
                  <span className={`text-sm font-bold ${isFree ? 'text-[#16a34a]' : 'text-[#de3336]'}`}>
                    {booth.boothName}
                  </span>
                  <span className={`text-xs font-semibold ${isFree ? 'text-[#16a34a]' : 'text-[#de3336]'}`}>
                    {isFree ? 'Trống' : 'Bận'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}