import type { IconProps } from '@/core/shared/types'

export const TrashIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 4h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M7 7l1 11a2 2 0 0 0 1.99 1.82h4.02A2 2 0 0 0 16 18l1-11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v5M14 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
