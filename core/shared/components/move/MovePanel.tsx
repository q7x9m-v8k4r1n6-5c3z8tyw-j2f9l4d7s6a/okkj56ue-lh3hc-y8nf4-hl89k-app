import type { PropsWithChildren } from 'react'

export const MovePanel = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => (
  <section className={`overflow-hidden rounded-[1.5rem] border border-[#ece5e1] bg-white shadow-[0_14px_34px_rgba(23,15,10,0.05)] ${className}`}>
    {children}
  </section>
)
