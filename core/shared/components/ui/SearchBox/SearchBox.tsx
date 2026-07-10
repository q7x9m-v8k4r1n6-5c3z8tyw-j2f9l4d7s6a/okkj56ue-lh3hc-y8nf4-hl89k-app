import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CloseIcon, SearchIcon } from '@/core/assets'

export type SearchOption = {
  id: string
  label: string
  description?: string
  keywords?: string[]
  icon?: ReactNode
}

export type SearchBoxProps = {
  options: SearchOption[]
  placeholder?: string
  emptyText?: string
  defaultOptionIcon?: ReactNode
  onSelect: (option: SearchOption) => void
}

export const SearchBox = ({ defaultOptionIcon, emptyText = 'Không tìm thấy kết quả', onSelect, options, placeholder = 'Tìm kiếm...' }: SearchBoxProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi')
    if (!normalizedQuery) return options
    return options.filter((option) => [option.label, option.description, ...(option.keywords ?? [])]
      .filter(Boolean)
      .some((value) => value?.toLocaleLowerCase('vi').includes(normalizedQuery)))
  }, [options, query])

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  const selectOption = (option: SearchOption) => {
    setQuery(option.label)
    setOpen(false)
    onSelect(option)
  }

  return (
    <div className="relative w-full" ref={rootRef}>
      <div className={`flex h-12 items-center gap-3 rounded-lg border bg-white px-4 transition ${open ? 'border-[#de3336] shadow-[0_0_0_2px_rgba(222,51,54,0.10)]' : 'border-[#e2e2e2] hover:border-[#d4d4d4]'}`}>
        <SearchIcon className="size-5 shrink-0 text-[#737373]" />
        <input
          ref={inputRef}
          value={query}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-[#171717] outline-none placeholder:text-[#9ca3af]"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
            setOpen(true)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setOpen(true)
              setActiveIndex((index) => Math.min(index + 1, filteredOptions.length - 1))
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActiveIndex((index) => Math.max(index - 1, 0))
            }
            if (event.key === 'Enter' && open && filteredOptions[activeIndex]) {
              event.preventDefault()
              selectOption(filteredOptions[activeIndex])
            }
            if (event.key === 'Escape') setOpen(false)
          }}
        />
        {query ? (
          <button type="button" className="rounded-full p-1 text-[#737373] hover:bg-[#f5f5f5]" aria-label="Xóa nội dung tìm kiếm" onClick={() => { setQuery(''); setActiveIndex(0); setOpen(true); inputRef.current?.focus() }}>
            <CloseIcon className="size-4" />
          </button>
        ) : null}
      </div>
      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white py-2 shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
          <ul className="max-h-64 overflow-y-auto px-2" role="listbox">
            {filteredOptions.length ? filteredOptions.map((option, index) => (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left ${index === activeIndex ? 'bg-[#f5f5f5]' : 'hover:bg-[#fafafa]'}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                >
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-[#9ca3af]">
                    {option.icon ?? defaultOptionIcon ?? <SearchIcon className="size-4" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-[#171717]">{option.label}</span>
                    {option.description ? <span className="mt-0.5 block truncate text-xs text-[#737373]">{option.description}</span> : null}
                  </span>
                </button>
              </li>
            )) : <li className="px-4 py-8 text-center text-sm text-[#737373]">{emptyText}</li>}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
