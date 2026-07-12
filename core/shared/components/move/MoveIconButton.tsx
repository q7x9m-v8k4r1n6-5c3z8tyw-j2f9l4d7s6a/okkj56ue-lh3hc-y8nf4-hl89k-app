import type { ButtonHTMLAttributes, ReactNode } from 'react'

type MoveIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode
}

export const MoveIconButton = ({ className = '', icon, type = 'button', ...props }: MoveIconButtonProps) => (
  <button
    className={`inline-flex size-9 items-center justify-center rounded-lg border border-[#e9dfdb] bg-white text-[#7f7772] transition-colors hover:bg-[#faf6f5] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    type={type}
    {...props}
  >
    {icon}
  </button>
)
