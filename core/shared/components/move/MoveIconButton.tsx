import type { ButtonHTMLAttributes, ReactNode } from 'react'

export const MoveIconButton = ({
  className = '',
  icon,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: ReactNode }) => (
  <button
    type="button"
    className={`inline-flex rounded-full p-1.5 text-[#8b8580] transition-colors hover:bg-[#faf5f4] hover:text-[#44403f] ${className}`}
    {...props}
  >
    {icon}
  </button>
)
