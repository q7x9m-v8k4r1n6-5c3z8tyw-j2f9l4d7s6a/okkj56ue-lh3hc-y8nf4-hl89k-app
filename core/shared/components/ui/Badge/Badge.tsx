import type { PropsWithChildren } from 'react'

export type BadgeVariant = 'success' | 'warning' | 'neutral' | 'danger'

const classes: Record<BadgeVariant, string> = {
  success: 'bg-[#f0fdf4] text-[#15803d] before:bg-[#22c55e]',
  warning: 'bg-[#fffbeb] text-[#b45309] before:bg-[#f59e0b]',
  neutral: 'bg-[#f5f5f5] text-[#525252] before:bg-[#a3a3a3]',
  danger: 'bg-[#fef2f2] text-[#b91c1c] before:bg-[#ef4444]',
}

export const Badge = ({ children, variant = 'success' }: PropsWithChildren<{ variant?: BadgeVariant }>) => (
  <span className={`inline-flex items-center gap-1.5 rounded-2xl py-0.5 pl-1.5 pr-2 text-xs font-medium leading-[18px] before:size-2 before:rounded-full ${classes[variant]}`}>
    {children}
  </span>
)
