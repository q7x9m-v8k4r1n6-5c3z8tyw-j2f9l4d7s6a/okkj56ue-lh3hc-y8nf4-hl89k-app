import type { PropsWithChildren, ReactNode } from 'react'

export type TooltipPosition = 'top' | 'bottom'

export type TooltipProps = PropsWithChildren<{
  content: ReactNode
  position?: TooltipPosition
  className?: string
}>

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 after:left-1/2 after:top-full after:-translate-x-1/2 after:border-x-[6px] after:border-t-[6px] after:border-x-transparent after:border-t-[#1f1f1f]',
  bottom: 'left-1/2 top-[calc(100%+8px)] -translate-x-1/2 after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-x-[6px] after:border-b-[6px] after:border-x-transparent after:border-b-[#1f1f1f]',
}

export const Tooltip = ({ children, className = '', content, position = 'top' }: TooltipProps) => (
  <span className={`group relative inline-flex ${className}`}>
    {children}
    <span
      role="tooltip"
      className={`pointer-events-none absolute z-40 w-max max-w-64 rounded-md bg-[#1f1f1f] px-3 py-2 text-xs font-medium leading-4 text-white opacity-0 shadow-lg transition-opacity duration-150 after:absolute after:size-0 after:content-[''] group-hover:opacity-100 group-focus-within:opacity-100 ${positionClasses[position]}`}
    >
      {content}
    </span>
  </span>
)
