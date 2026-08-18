import { useState } from 'react'
import { CloseIcon, SearchIcon } from '@/core/assets'

export type TagInputProps = {
  values: string[]
  placeholder?: string
  onChange: (values: string[]) => void
}

export const TagInput = ({ onChange, placeholder = 'Nhập nhãn và nhấn Enter', values }: TagInputProps) => {
  const [query, setQuery] = useState('')

  const addTag = () => {
    const value = query.trim()
    if (!value || values.some((tag) => tag.toLocaleLowerCase('vi') === value.toLocaleLowerCase('vi'))) return
    onChange([...values, value])
    setQuery('')
  }

  return (
    <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-lg border border-[#e2e2e2] bg-white px-3 transition focus-within:border-[#de3336] focus-within:shadow-[0_0_0_2px_rgba(222,51,54,0.10)]">
      <SearchIcon className="size-4 shrink-0 text-[#737373]" />
      {values.map((tag) => (
        <span key={tag} className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#fff1f1] px-2 py-1 text-[11px] font-medium text-[#9f2528]">
          <span className="truncate">{tag}</span>
          <button type="button" className="rounded-full p-0.5 hover:bg-white/70" aria-label={`Xóa nhãn ${tag}`} onClick={() => onChange(values.filter((item) => item !== tag))}>
            <CloseIcon className="size-2.5" />
          </button>
        </span>
      ))}
      <input
        value={query}
        className="h-9 min-w-28 flex-1 bg-transparent text-xs text-[#262626] outline-none placeholder:text-[#9ca3af]"
        placeholder={values.length ? '' : placeholder}
        onChange={(event) => setQuery(event.target.value)}
        onBlur={addTag}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault()
            addTag()
          }
          if (event.key === 'Backspace' && !query && values.length) onChange(values.slice(0, -1))
        }}
      />
    </div>
  )
}
