import type { ReactNode } from 'react'
import { MapIcon } from '@/core/assets/icons'
import { Skeleton, Modal, Button } from '@/core/shared'
import { useBoothListSection } from '../hooks/useBoothListSection'
import { SectionHeader } from './SectionHeader'

const BoothDetailRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid grid-cols-[110px_1fr] gap-2">
    <span className="font-semibold text-[#1a1c1c]">{label}:</span> 
    {children}
  </div>
)

export const BoothStatusCard = ({ raceId }: { raceId?: string }) => {
  const { 
    items, 
    isLoading, 
    isError, 
    selectedBooth, 
    openBoothDetail, 
    closeBoothDetail 
  } = useBoothListSection(raceId)

  return (
    <div className="flex flex-col bg-white">
      <SectionHeader icon={<MapIcon className="size-6" />} title="Trạng Thái Các Trạm" />
      <div className="overflow-y-auto px-1 pb-3">
        {isLoading ? (
          <Skeleton lines={2} className="h-[80px]" />
        ) : isError ? (
          <div className="text-sm italic text-red-500">Lỗi xử lý dữ liệu.</div>
        ) : items.length === 0 ? (
          <div className="text-sm italic text-gray-400">Chưa có trạm thiết lập.</div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-5">
            {items.map((booth) => {
              const isFree = booth.status.toLowerCase() === 'free'
              return (
                <button
                  key={booth.boothId}
                  type="button"
                  onClick={() => openBoothDetail(booth)}
                  className={`flex h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-lg p-2 text-center transition hover:shadow-[0_4px_10px_rgba(0,0,0,0.2)] ${
                    isFree ? 'bg-[#f0fdf4]' : 'bg-[#fcd0d1]'
                  }`}
                >
                  <span className={`text-xs font-extrabold ${isFree ? 'text-[#16a34a]' : 'text-[#de3336]'}`}>
                    {booth.boothName}
                  </span>
                  <span className={`text-xs font-medium ${isFree ? 'text-[#16a34a]' : 'text-[#de3336]'}`}>
                    {isFree ? 'Trống' : 'Bận'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <Modal
        open={Boolean(selectedBooth)}
        title="Thông tin chi tiết trạm"
        onClose={closeBoothDetail}
        footer={
          <Button variant="primary" onClick={closeBoothDetail}>
            Đóng
          </Button>
        }
      >
        {selectedBooth && (
          <div className="flex flex-col gap-3 text-sm text-[#333333]">
            <BoothDetailRow label="Tên trạm">
              <div className="flex items-center gap-2">
                <span>{selectedBooth.boothName}</span>
                <span className={`text-xs italic font-medium ${selectedBooth.isHidden ? 'text-purple-600' : 'text-blue-600'}`}>
                  {selectedBooth.isHidden ? '*Trạm ẩn' : '*Trạm thường'}
                </span>
              </div>
            </BoothDetailRow>
            <BoothDetailRow label="Địa điểm">
              <span>{selectedBooth.boothLocation}</span>
            </BoothDetailRow>
            <BoothDetailRow label="Trạng thái">
              <span className={`font-semibold ${selectedBooth.status.toLowerCase() === 'free' ? 'text-[#16a34a]' : 'text-[#de3336]'}`}>
                {selectedBooth.status.toLowerCase() === 'free' ? 'Trống' : 'Bận'}
              </span>
            </BoothDetailRow>
            {selectedBooth.currentTeamName && (
              <BoothDetailRow label="Đội đang chơi">
                <span className="font-semibold text-[#de3336]">{selectedBooth.currentTeamName}</span>
              </BoothDetailRow>
            )}
            {selectedBooth.currentOrganizerName && (
              <BoothDetailRow label="Quản trạm">
                <span>{selectedBooth.currentOrganizerName}</span>
              </BoothDetailRow>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}