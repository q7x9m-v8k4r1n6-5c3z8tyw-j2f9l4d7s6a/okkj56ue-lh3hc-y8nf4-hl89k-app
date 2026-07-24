import type { ReactNode } from 'react'

export const SectionHeader = ({ icon, title }: { icon: ReactNode; title: string }) => (
  <div className="mb-4 flex items-center gap-2 font-bold text-[#111111]">
    <span className="text-[#525252]">{icon}</span>
    <h3 className="text-lg">{title}</h3>
  </div>
)