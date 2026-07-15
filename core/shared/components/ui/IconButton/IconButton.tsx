import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon: ReactNode }

export const IconButton = ({ className = '', icon, type = 'button', ...props }: IconButtonProps) => (
  <button type={type} className={`inline-flex rounded-full p-1.5 text-[#737373] transition-colors hover:bg-[#f5f5f5] hover:text-[#404040] ${className}`} {...props}>
    {icon}
  </button>
)
