import { useEffect, useRef, useState } from 'react'
import { ChevronIcon } from '@/core/assets'
import type { ScoringLogHistoryFilterOption } from '../../model/scoringLogHistory.presentation'

type ScoringReasonFilterProps = {
  label: string
  options: ScoringLogHistoryFilterOption[]
  value: string
  menuWidthClassName?: string
  onChange: (value: string) => void
}

export const ScoringReasonFilter = ({
  label,
  menuWidthClassName,
  onChange,
  options,
  value,
}: ScoringReasonFilterProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return

    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  return (
    <div ref={rootRef} className={`relative w-full ${open ? 'z-[100]' : ''}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-[49px] w-full items-center justify-between bg-[#fafafa] px-6 text-left text-sm font-medium text-[#525252] outline-none transition hover:bg-[#f5f5f5] focus:ring-2 focus:ring-[#de3336]/10"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="min-w-0 truncate">{selected?.label ?? label}</span>
        <ChevronIcon className={`h-2 w-3 shrink-0 text-[#5e5e5e] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div
          role="listbox"
          className={`absolute left-0 top-full z-[100] mt-1 max-h-64 min-w-full overflow-y-auto rounded-lg border border-[#e5e5e5] bg-white p-1 shadow-[0_12px_28px_rgba(0,0,0,0.12)] ${menuWidthClassName ?? ''}`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm text-[#404040] ${option.value === value ? 'bg-[#fff1f1] font-semibold text-[#de3336]' : 'hover:bg-[#fafafa]'}`}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
