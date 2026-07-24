import type { IconProps } from '@/core/shared/types'

export const MapIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4.5 5.5L9.5 3l5 2.5L19.5 3v15l-5 2.5-5-2.5-5 2.5V5.5Zm5-2.5v15m5-12.5v15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)