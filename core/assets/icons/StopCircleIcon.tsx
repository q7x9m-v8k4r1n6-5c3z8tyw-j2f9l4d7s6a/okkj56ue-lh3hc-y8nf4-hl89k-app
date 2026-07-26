import type { IconProps } from '@/core/shared/types'

export const StopCircleIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
    <path d="M8.25 8.25h7.5v7.5h-7.5v-7.5Z" fill="currentColor" />
  </svg>
)
