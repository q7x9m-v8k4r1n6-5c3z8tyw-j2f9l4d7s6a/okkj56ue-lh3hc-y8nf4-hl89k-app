import type { HTMLAttributes, PropsWithChildren } from 'react'

type MovePanelProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export const MovePanel = ({ children, className = '', ...props }: MovePanelProps) => (
  <div
    className={`overflow-hidden rounded-[1.5rem] border border-[#efe8e5] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.05)] ${className}`}
    {...props}
  >
    {children}
  </div>
)
