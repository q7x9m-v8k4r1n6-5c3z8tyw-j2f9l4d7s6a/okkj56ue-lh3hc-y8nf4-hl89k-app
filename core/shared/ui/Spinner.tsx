export type SpinnerSize = 'sm' | 'md' | 'lg'

export type SpinnerProps = {
  size?: SpinnerSize
  label?: string
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'size-4 border-2',
  md: 'size-6 border-[3px]',
  lg: 'size-10 border-4',
}

export const Spinner = ({ className = '', label = 'Đang tải', size = 'md' }: SpinnerProps) => (
  <span className="inline-flex items-center gap-2" role="status" aria-label={label}>
    <span className={`animate-spin rounded-full border-[#f5b7b8] border-t-[#de3336] ${sizeClasses[size]} ${className}`} />
    <span className="sr-only">{label}</span>
  </span>
)
