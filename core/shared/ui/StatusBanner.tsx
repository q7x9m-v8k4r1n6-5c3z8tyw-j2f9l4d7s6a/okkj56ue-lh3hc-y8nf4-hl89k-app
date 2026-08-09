import React, { useEffect } from 'react'

export type BannerVariant = 'success' | 'info' | 'warning' | 'danger' | 'neutral'

interface StatusBannerProps {
  message: string
  variant?: BannerVariant
  duration?: number
  onClose: () => void
  className?: string
}

const variantStyles: Record<BannerVariant, { container: string; iconColor: string }> = {
  success: {
    container: 'bg-[#f4fbf7] border-[#dcfce7] text-[#1f2937]',
    iconColor: 'text-[#16a34a]',
  },
  neutral: {
    // Màu xám pastel theo đúng thiết kế Figma
    container: 'bg-[#f3f4f6] border-[#e5e7eb] text-[#374151]',
    iconColor: 'text-[#6b7280]',
  },
  info: {
    container: 'bg-[#f0f7ff] border-[#e0f2fe] text-[#1f2937]',
    iconColor: 'text-[#0284c7]',
  },
  warning: {
    container: 'bg-[#fffbeb] border-[#fef3c7] text-[#1f2937]',
    iconColor: 'text-[#d97706]',
  },
  danger: {
    container: 'bg-[#fef2f2] border-[#ffe4e6] text-[#1f2937]',
    iconColor: 'text-[#dc2626]',
  },
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  message,
  variant = 'success',
  duration = 3000,
  onClose,
  className = '',
}) => {
  useEffect(() => {
    if (!message || duration <= 0) return
    const timer = setTimeout(() => onClose(), duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  const { container, iconColor } = variantStyles[variant]

  return (
    <div
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-sm transition-all animate-in fade-in ${container} ${className}`}
    >
      {variant === 'neutral' ? (
        /* Icon X xám cho trạng thái Hủy */
        <svg
          className={`size-4 shrink-0 stroke-[2.5] ${iconColor}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        /* Icon Checkmark xanh cho Thành công */
        <svg
          className={`size-5 shrink-0 stroke-[2.5] ${iconColor}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      <span className="text-sm font-medium leading-snug">{message}</span>
    </div>
  )
}