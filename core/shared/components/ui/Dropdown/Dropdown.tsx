import { useEffect, useId, useRef, useState } from 'react'
import { ChevronIcon } from '@/core/assets'

export type DropdownOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export type DropdownProps = {
  options: DropdownOption[]
  value?: string
  label?: string
  placeholder?: string
  requiredMark?: boolean
  onChange: (value: string) => void
}

export const Dropdown = ({ label, onChange, options, placeholder = 'Chọn một mục', requiredMark, value }: DropdownProps) => {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  const selectOption = (option: DropdownOption) => {
    if (option.disabled) return
    onChange(option.value)
    setOpen(false)
  }

  return (
    <div className="relative w-full" ref={rootRef}>
      {label ? (
        <label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase leading-[14px] text-[#1a1c1c]">
          {label} {requiredMark ? <span className="text-[#de3336]">(*)</span> : null}
        </label>
      ) : null}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-12 w-full items-center justify-between rounded-lg border border-[#e2e2e2] bg-white px-4 text-left text-sm outline-none focus:border-[#de3336] focus:ring-2 focus:ring-[#de3336]/10"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
            setActiveIndex((index) => Math.min(index + 1, options.length - 1))
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveIndex((index) => Math.max(index - 1, 0))
          }
          if (event.key === 'Enter' && open) {
            event.preventDefault()
            selectOption(options[activeIndex])
          }
          if (event.key === 'Escape') setOpen(false)
        }}
      >
        <span className={selected ? 'text-[#171717]' : 'text-[#9ca3af]'}>{selected?.label ?? placeholder}</span>
        <ChevronIcon className={`h-2 w-3 text-[#737373] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <ul className="absolute z-30 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-[#e5e5e5] bg-white p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.12)]" role="listbox">
          {options.map((option, index) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                disabled={option.disabled}
                aria-selected={option.value === value}
                className={`w-full rounded-lg px-3 py-2.5 text-left disabled:opacity-40 ${index === activeIndex || option.value === value ? 'bg-[#fff1f1]' : 'hover:bg-[#fafafa]'}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
              >
                <span className="block text-sm text-[#171717]">{option.label}</span>
                {option.description ? <span className="mt-0.5 block text-xs text-[#737373]">{option.description}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
