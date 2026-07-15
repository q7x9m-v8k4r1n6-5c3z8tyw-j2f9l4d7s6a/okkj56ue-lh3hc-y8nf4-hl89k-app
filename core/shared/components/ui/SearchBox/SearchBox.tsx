import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
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
  inputClassName?: string
  rootClassName?: string
  selectedContent?: ReactNode
  clearOnSelect?: boolean
  onSelect: (option: SearchOption) => void
}

type DropdownPosition = {
  top: number
  left: number
  width: number
}

export const SearchBox = ({
  clearOnSelect = false,
  defaultOptionIcon,
  emptyText = 'Không tìm thấy kết quả',
  inputClassName = '',
  onSelect,
  options,
  placeholder = 'Tìm kiếm...',
  rootClassName = '',
  selectedContent,
}: SearchBoxProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null)

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi')
    if (!normalizedQuery) return options
    return options.filter((option) => [option.label, option.description, ...(option.keywords ?? [])]
      .filter(Boolean)
      .some((value) => value?.toLocaleLowerCase('vi').includes(normalizedQuery)))
  }, [options, query])

  useEffect(() => {
    if (!open) return

    const updateDropdownPosition = () => {
      const rect = rootRef.current?.getBoundingClientRect()
      if (!rect) return
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      })
    }

    updateDropdownPosition()

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target) && !dropdownRef.current?.contains(target)) setOpen(false)
    }

    const handleViewportChange = () => updateDropdownPosition()

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [open])

  const selectOption = (option: SearchOption) => {
    setQuery(clearOnSelect ? '' : option.label)
    setOpen(false)
    onSelect(option)
  }

  return (
    <div className={`relative w-full ${rootClassName}`} ref={rootRef}>
      <div className={`flex min-h-10 flex-wrap items-center gap-2 rounded-lg border bg-white px-3 transition ${open ? 'border-[#de3336] shadow-[0_0_0_2px_rgba(222,51,54,0.10)]' : 'border-[#e2e2e2] hover:border-[#d4d4d4]'} ${inputClassName}`}>
        <SearchIcon className="size-5 shrink-0 text-[#737373]" />
        {selectedContent}
        <input
          ref={inputRef}
          value={query}
          placeholder={placeholder}
          className="h-10 min-w-[96px] flex-1 bg-transparent text-sm leading-5 text-[#171717] outline-none placeholder:text-sm placeholder:leading-5 placeholder:text-[#9ca3af]"
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
      {open && dropdownPosition ? createPortal((
        <div
          ref={dropdownRef}
          className="z-[120] overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white py-2 shadow-[0_12px_30px_rgba(0,0,0,0.14)]"
          style={{ left: dropdownPosition.left, position: 'fixed', top: dropdownPosition.top, width: dropdownPosition.width }}
        >
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
      ), document.body) : null}
    </div>
  )
}
