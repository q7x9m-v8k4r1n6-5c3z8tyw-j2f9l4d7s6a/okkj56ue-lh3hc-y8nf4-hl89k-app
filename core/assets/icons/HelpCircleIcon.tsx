import type { IconProps } from '@/core/shared/types'

export const HelpCircleIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9.75 9.25a2.4 2.4 0 0 1 4.58 1c0 1.75-2.33 2.08-2.33 3.58" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
)
