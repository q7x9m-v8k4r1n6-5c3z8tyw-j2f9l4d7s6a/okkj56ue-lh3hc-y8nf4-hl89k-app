import type { HTMLAttributes } from 'react'

type MoveProgressBarProps = HTMLAttributes<HTMLDivElement> & {
  value: number
  size?: 'sm' | 'lg'
}

export const MoveProgressBar = ({ className = '', size = 'sm', value, ...props }: MoveProgressBarProps) => {
  const safeValue = Math.min(Math.max(value, 0), 100)
  const heightClassName = size === 'lg' ? 'h-3' : 'h-2'

  return (
    <div className={`w-full overflow-hidden rounded-full bg-[#ece8f6] ${heightClassName} ${className}`} {...props}>
      <div className={`rounded-full bg-[#ef4444] transition-[width] duration-300 ${heightClassName}`} style={{ width: `${safeValue}%` }} />
    </div>
  )
}
