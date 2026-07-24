import type { IconProps } from '@/core/shared/types'

export const PauseCircleIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path d="M8.5 7.5h2.25v9H8.5v-9Zm4.75 0h2.25v9h-2.25v-9Z" fill="white" />
  </svg>
)
