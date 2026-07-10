import type { IconProps } from '../../shared/types'

export const ChevronIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 12 8" fill="none" aria-hidden="true">
    <path d="m1 1.25 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
