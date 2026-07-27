import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md'

export type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
  }
>

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-[#de3336] bg-[#de3336] text-white hover:border-[#c92c2f] hover:bg-[#c92c2f]',
  secondary: 'border-[#e5e5e5] bg-white text-[#564240] hover:bg-[#fafafa]',
  ghost: 'border-transparent bg-transparent text-[#525252] hover:bg-[#f5f5f5]',
  danger: 'border-[#fdcacb] bg-[#fff5f5] text-[#c82528] hover:bg-[#fde8e8]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3.5 py-2 text-sm leading-5',
  md: 'min-h-12 px-4 py-3 text-sm leading-5',
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
    className={`inline-flex items-center justify-center gap-2 rounded-lg border font-medium tracking-[0.2px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    type={type}
    {...props}
  >
    {leadingIcon}
    {children}
    {trailingIcon}
  </button>
)
