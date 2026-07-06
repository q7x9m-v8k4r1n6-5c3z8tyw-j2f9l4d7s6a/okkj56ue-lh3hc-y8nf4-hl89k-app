import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = ({ className = '', ...props }: InputProps) => {
  return <input className={`rounded-md border border-slate-300 px-3 py-2 text-sm ${className}`} {...props} />
}
