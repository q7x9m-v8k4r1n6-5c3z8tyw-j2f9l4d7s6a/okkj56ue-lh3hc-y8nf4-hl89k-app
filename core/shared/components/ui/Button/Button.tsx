import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'muted'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
  }
>

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-[#ef4444] bg-[#ef4444] text-white hover:border-[#dc2626] hover:bg-[#dc2626]',
  secondary: 'border-[#e6dcd8] bg-white text-[#7d756f] hover:bg-[#faf6f5]',
  ghost: 'border-transparent bg-transparent text-[#525252] hover:bg-[#f5f5f5]',
  danger: 'border-[#ef4444] bg-[#ef4444] text-white hover:border-[#dc2626] hover:bg-[#dc2626]',
  muted: 'border-[#e7d8d5] bg-white text-[#7f7772] hover:bg-[#faf6f5]',
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'min-h-8 px-3 py-2 text-[0.72rem] leading-none',
  sm: 'min-h-9 px-4 py-2 text-[0.76rem] leading-none',
  md: 'min-h-10 px-5 py-2.5 text-sm leading-none',
  lg: 'min-h-11 px-5 py-3 text-sm leading-none',
}

export const Button = ({
  children,
  className = '',
  leadingIcon,
  size = 'sm',
  trailingIcon,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    type={type}
    {...props}
  >
    {leadingIcon}
    {children}
    {trailingIcon}
  </button>
)
