import type { IconProps } from '@/core/shared/types'

export const LeaderboardIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 9h5V3h7v8h5v10H4V9Zm2 2v8h3v-8H6Zm5-6v14h3V5h-3Zm5 8v6h3v-6h-3Z"
      fill="currentColor"
    />
  </svg>
)