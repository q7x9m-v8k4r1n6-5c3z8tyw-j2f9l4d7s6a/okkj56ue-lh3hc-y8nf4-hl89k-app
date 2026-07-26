import type { IconProps } from '@/core/shared/types'

export const PlayCircleIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path d="m10 8 6 4-6 4V8Z" fill="white" />
  </svg>
)
