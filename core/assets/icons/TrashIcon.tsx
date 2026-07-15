import type { IconProps } from '@/core/shared/types'

export const TrashIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 7.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 7.5V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5M8 10.5v6.75A1.75 1.75 0 0 0 9.75 19h4.5A1.75 1.75 0 0 0 16 17.25V10.5M10.5 11.5v5M13.5 11.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
