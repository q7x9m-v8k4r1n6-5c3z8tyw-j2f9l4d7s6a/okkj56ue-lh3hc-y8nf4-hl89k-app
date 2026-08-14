import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export type OptionChoiceAction = {
  /** Khóa duy nhất cho mỗi action */
  key: string
  /** Nội dung text hiển thị trên nút */
  label: string
  /** 
   * 'primary': Nút màu đỏ nổi bật (Thường dùng cho hành động chính)
   * 'secondary': Nút màu xám (Thường dùng cho Hủy hoặc hành động phụ)
   * Mặc định là 'primary' nếu không truyền.
   */
  variant?: 'primary' | 'secondary'
  /** Hàm xử lý khi người dùng bấm vào nút */
  onClick: () => void
}

export type ModalOptionChoiceProps = {
  /** Trạng thái đóng/mở của modal */
  open: boolean
  /** Tiêu đề của modal (VD: "Vui lòng chọn thao tác") */
  title: string
  /** Danh sách các nút lựa chọn */
  actions: OptionChoiceAction[]
  /** Hàm gọi khi bấm ra ngoài backdrop hoặc bấm phím ESC */
  onClose: () => void
}

/**
 * Hiển thị một Dialog cung cấp các lựa chọn thao tác dạng danh sách nút bấm xếp dọc.
 * Có bo góc lớn và thiết kế chuẩn cho luồng chọn tính năng.
 */
export const ModalOptionChoice = ({
  open,
  title,
  actions,
  onClose,
}: ModalOptionChoiceProps) => {
  // Đóng modal khi bấm phím ESC
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-3 transition-opacity"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="w-full max-w-[380px] rounded-[28px] border border-[#f0f0f0] bg-white px-4 pb-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="my-9 text-center text-[14px] font-bold text-[#323232]">
          {title}
        </h2>
        
        <div className="flex flex-col gap-3">
          {actions.map((action) => {
            const isPrimary = action.variant === 'primary' || !action.variant
            
            return (
              <button
                key={action.key}
                type="button"
                onClick={action.onClick}
                className={`flex w-full items-center justify-center rounded-full py-3 text-[14px] font-semibold transition-all active:scale-95 ${
                  isPrimary
                    ? 'bg-[#de3336] text-white shadow-sm hover:bg-[#c82d2f]'
                    : 'bg-[#f0f0f0] text-[#5e5e5e] shadow-sm hover:bg-[#e4e4e4]' 
                }`}
              >
                {action.label}
              </button>
            )
          })}
        </div>
      </section>
    </div>,
    document.body,
  )
}