import { useId, type InputHTMLAttributes } from 'react'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
}

export const Checkbox = ({ className = '', id, label, ...props }: CheckboxProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label className="inline-flex items-center gap-2" htmlFor={inputId}>
      <input
        {...props}
        id={inputId}
        type="checkbox"
        className={`size-5 appearance-none rounded-md border border-[#d4d4d4] bg-white checked:border-[#de3336] checked:bg-[#de3336] focus:outline-none focus:ring-2 focus:ring-[#de3336]/20 ${className}`}
      />
      {label ? <span className="text-sm text-[#404040]">{label}</span> : null}
    </label>
  )
}
