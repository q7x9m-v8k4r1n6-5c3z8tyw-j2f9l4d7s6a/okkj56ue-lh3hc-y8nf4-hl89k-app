import type { ReactNode } from 'react'

type MessageSectionHeaderProps = {
  icon: ReactNode
  title: string
}

export const MessageSectionHeader = ({
  icon,
  title,
}: MessageSectionHeaderProps) => (
  <div className="flex items-center gap-2 text-[#111111]">
    <span className="flex size-6 items-center justify-center text-[#323232]">
      {icon}
    </span>
    <h2 className="text-base font-bold leading-6">{title}</h2>
  </div>
)
