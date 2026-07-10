import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  hint?: string
  leadingIcon?: ReactNode
  requiredMark?: boolean
}

export const Input = ({
  className = '',
  error,
  hint,
  id,
  label,
  leadingIcon,
  requiredMark,
  ...props
}: InputProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = error || hint ? `${inputId}-description` : undefined

  return (
    <label className="block w-full" htmlFor={inputId}>
      {label ? (
        <span className="mb-2 block text-xs font-semibold uppercase leading-[14px] tracking-[0.15px] text-[#1a1c1c]">
          {label} {requiredMark ? <span className="text-[#de3336]">(*)</span> : null}
        </span>
      ) : null}
      <span className="relative block">
        {leadingIcon ? <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#737373]">{leadingIcon}</span> : null}
        <input
          id={inputId}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(error)}
          className={`h-12 w-full rounded-lg border bg-white px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#9ca3af] focus:border-[#de3336] focus:ring-2 focus:ring-[#de3336]/10 disabled:cursor-not-allowed disabled:border-[#e5e5e5] disabled:bg-[#f5f5f5] disabled:text-[#a3a3a3] disabled:placeholder:text-[#b8b8b8] disabled:focus:ring-0 ${leadingIcon ? 'pl-11' : ''} ${error ? 'border-[#de3336]' : 'border-[#e2e2e2]'} ${className}`}
          {...props}
        />
      </span>
      {error || hint ? (
        <span id={descriptionId} className={`mt-1.5 block text-xs ${error ? 'text-[#de3336]' : 'text-[#737373]'}`}>
          {error ?? hint}
        </span>
      ) : null}
    </label>
  )
}
