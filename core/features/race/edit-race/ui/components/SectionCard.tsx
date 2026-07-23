import type { PropsWithChildren } from 'react'
import { TableCard } from '@/core/shared'

export const SectionCard = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => (
  <TableCard className={`rounded-lg border-[#e5e5e5] bg-white px-5 py-6 shadow-none md:px-6 ${className}`}>
    {children}
  </TableCard>
)
