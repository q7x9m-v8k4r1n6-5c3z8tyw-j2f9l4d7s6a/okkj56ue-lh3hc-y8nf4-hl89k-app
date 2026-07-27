export type TabItem = {
  value: string
  label: string
  disabled?: boolean
}

export type TabsProps = {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
}

export const Tabs = ({ items, onChange, value }: TabsProps) => (
  <div className="flex gap-6 border-b border-[#e5e5e5]" role="tablist">
    {items.map((item) => (
      <button
        key={item.value}
        type="button"
        role="tab"
        disabled={item.disabled}
        aria-selected={item.value === value}
        className={`border-b-2 pb-3 text-sm transition-colors disabled:opacity-40 ${item.value === value ? 'border-[#de3336] text-[#1a1c1c]' : 'border-transparent text-[#737373] hover:text-[#1a1c1c]'}`}
        onClick={() => onChange(item.value)}
      >
        {item.label}
      </button>
    ))}
  </div>
)
