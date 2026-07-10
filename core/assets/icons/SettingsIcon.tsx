import type { IconProps } from '@/core/shared/types'

export const SettingsIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M8.3 2.05h3.4l.45 2.03c.35.16.68.35.99.57l1.98-.63 1.7 2.95-1.54 1.4a5.9 5.9 0 0 1 0 1.26l1.54 1.4-1.7 2.95-1.98-.63c-.31.22-.64.41-.99.57l-.45 2.03H8.3l-.45-2.03a7 7 0 0 1-.99-.57l-1.98.63-1.7-2.95 1.54-1.4a5.9 5.9 0 0 1 0-1.26l-1.54-1.4 1.7-2.95 1.98.63c.31-.22.64-.41.99-.57l.45-2.03Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="10" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)
