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
        className={`size-5 appearance-none rounded-md border border-[#d4d4d4] bg-white checked:border-[#de3336] checked:bg-[#de3336] checked:bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_20_20%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath_d=%22m5_10_3_3_7-7%22_fill=%22none%22_stroke=%22white%22_stroke-width=%222%22_stroke-linecap=%22round%22_stroke-linejoin=%22round%22/%3E%3C/svg%3E')] focus:outline-none focus:ring-2 focus:ring-[#de3336]/20 ${className}`}
      />
      {label ? <span className="text-sm text-[#404040]">{label}</span> : null}
    </label>
  )
}
