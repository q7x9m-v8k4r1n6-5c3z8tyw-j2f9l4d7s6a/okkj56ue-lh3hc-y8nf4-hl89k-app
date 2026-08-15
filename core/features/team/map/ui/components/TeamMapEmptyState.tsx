import React from 'react'

export interface TeamMapEmptyStateProps {
  message?: string
  onRetry?: () => void
}

export const TeamMapEmptyState: React.FC<TeamMapEmptyStateProps> = ({
  message = 'Ban tổ chức chưa công bố sơ đồ bản đồ trận đấu',
  onRetry,
}) => {
  return (
    <section
      className="flex min-h-[calc(100svh-137px)] w-full flex-col items-center justify-center px-6 py-12 text-center"
      aria-label="Chưa có bản đồ trận đấu"
    >
      <div className="flex max-w-[340px] flex-col items-center gap-4 rounded-2xl border border-dashed border-[#e5e5e5] bg-white p-8 shadow-xs">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#fee2e2] text-[#de3336]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-7"
            aria-hidden="true"
          >
            <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
            <path d="m2 2 20 20" />
          </svg>
        </div>

        <h3 className="text-base font-semibold leading-snug text-[#1f2937]">
          {message}
        </h3>
        <p className="text-sm leading-relaxed text-[#6b7280]">
          Vui lòng quay lại sau khi ban tổ chức cập nhật bản đồ và vị trí các trạm thi đấu.
        </p>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Tải lại
          </button>
        ) : null}
      </div>
    </section>
  )
}
