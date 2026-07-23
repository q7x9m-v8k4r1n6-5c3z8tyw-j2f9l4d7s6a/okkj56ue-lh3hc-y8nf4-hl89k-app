import type { IconProps } from '@/core/shared/types'

export const SaveIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 4h12l2 2v14H5V4Z" fill="currentColor" />
    <path d="M8 4h7v6H8V4Zm2 12h4v4h-4v-4Z" fill="white" opacity="0.9" />
  </svg>
)
