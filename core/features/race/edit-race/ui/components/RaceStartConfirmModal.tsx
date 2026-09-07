import { Button, Modal } from '@/core/shared'

export type RaceStartConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isSubmitting?: boolean
}

export const RaceStartConfirmModal = ({
  open,
  onClose,
  onConfirm,
  isSubmitting = false,
}: RaceStartConfirmModalProps) => {
  return (
    <Modal
      open={open}
      title="Xác nhận bắt đầu trận đấu"
      onClose={onClose}
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Hủy
          </Button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận bắt đầu'}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-3 py-1">
        <p className="text-sm font-medium leading-relaxed text-[#1a1c1c]">
          ⚠️ Lưu ý: Khi trận đấu bắt đầu, toàn bộ sơ đồ bản đồ và vị trí các trạm sẽ bị KHÓA CỐ ĐỊNH VĨNH VIỄN, không thể chỉnh sửa hay di chuyển trạm nữa. Bạn có chắc chắn muốn bắt đầu?
        </p>
      </div>
    </Modal>
  )
}
