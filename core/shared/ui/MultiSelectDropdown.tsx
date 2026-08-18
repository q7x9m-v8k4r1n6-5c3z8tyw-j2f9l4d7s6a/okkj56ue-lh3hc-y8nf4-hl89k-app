import { useEffect, useId, useRef, useState } from 'react'
import { ChevronIcon } from '@/core/assets'
import type { DropdownOption } from './Dropdown'

export type MultiSelectDropdownProps = {
  options: DropdownOption[]
  values: string[]
  placeholder?: string
  buttonClassName?: string
  onChange: (values: string[]) => void
}

export const MultiSelectDropdown = ({
  buttonClassName = '',
  onChange,
  options,
  placeholder = 'Chọn nhiều mục',
  values,
}: MultiSelectDropdownProps) => {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selectedOptions = options.filter((option) => values.includes(option.value))

  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const toggle = (value: string) => onChange(
    values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value],
  )

  const summary = selectedOptions.length === 0
    ? placeholder
    : selectedOptions.length <= 2
      ? selectedOptions.map((option) => option.label).join(', ')
      : `${selectedOptions.length} mục đã chọn`

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-12 w-full items-center justify-between gap-2 rounded-lg border border-[#e2e2e2] bg-white px-4 text-left text-sm outline-none focus:border-[#de3336] focus:ring-2 focus:ring-[#de3336]/10 ${buttonClassName}`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
        }}
      >
        <span className={`min-w-0 truncate ${selectedOptions.length ? 'text-[#171717]' : 'text-[#9ca3af]'}`}>{summary}</span>
        <ChevronIcon className={`h-2 w-3 shrink-0 text-[#737373] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div className="absolute z-30 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-[#e5e5e5] bg-white p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.12)]" role="listbox" aria-multiselectable="true">
          {options.length ? options.map((option) => {
            const selected = values.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={option.disabled}
                className={`flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left disabled:opacity-40 ${selected ? 'bg-[#fff1f1]' : 'hover:bg-[#fafafa]'}`}
                onClick={() => toggle(option.value)}
              >
                <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded border text-[10px] ${selected ? 'border-[#de3336] bg-[#de3336] text-white' : 'border-[#cfcfcf] text-transparent'}`}>✓</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm text-[#171717]">{option.label}</span>
                  {option.description ? <span className="mt-0.5 block text-xs text-[#737373]">{option.description}</span> : null}
                </span>
              </button>
            )
          }) : <p className="px-3 py-4 text-center text-xs text-[#9a9a9a]">Không có dữ liệu.</p>}
        </div>
      ) : null}
    </div>
  )
}
