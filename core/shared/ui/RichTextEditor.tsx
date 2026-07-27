import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

export type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeightClassName?: string
}

const ToolButton = ({ active, children, label, onClick }: { active?: boolean; children: ReactNode; label: string; onClick: () => void }) => (
  <button
    type="button"
    className={`inline-flex size-8 items-center justify-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-[#de3336]/15 ${active ? 'bg-[#fff1f1] text-[#de3336]' : 'text-[#525252] hover:bg-[#f1f1f1] hover:text-[#de3336]'}`}
    title={label}
    aria-label={label}
    aria-pressed={active}
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
  >
    {children}
  </button>
)

const ToolbarDivider = () => <span className="mx-1 h-5 w-px bg-[#e2e2e2]" aria-hidden="true" />

export const RichTextEditor = ({
  minHeightClassName = 'min-h-[520px]',
  onChange,
  placeholder = 'Nhập nội dung...',
  value,
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [textColor, setTextColor] = useState('#171717')
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false, unorderedList: false, orderedList: false })
  const [heading, setHeading] = useState('p')

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value
  }, [value])

  const updateToolbar = useCallback(() => {
    const editor = editorRef.current
    const selection = document.getSelection()
    if (!editor || !selection?.anchorNode || !editor.contains(selection.anchorNode)) return

    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
    })

    const block = String(document.queryCommandValue('formatBlock') || 'p').toLowerCase().replace(/[<>]/g, '')
    setHeading(block === 'h2' || block === 'h3' ? block : 'p')
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', updateToolbar)
    return () => document.removeEventListener('selectionchange', updateToolbar)
  }, [updateToolbar])

  const command = (name: string, argument?: string) => {
    editorRef.current?.focus()
    document.execCommand(name, false, argument)
    onChange(editorRef.current?.innerHTML ?? '')
    updateToolbar()
  }

  const changeColor = (color: string) => {
    setTextColor(color)
    command('foreColor', color)
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#dedede] bg-white shadow-sm">
      <div className="flex min-h-12 flex-wrap items-center gap-1 border-b border-[#eeeeee] bg-white px-3 py-2">
        <ToolButton active={activeFormats.bold} label="In đậm" onClick={() => command('bold')}><span className="text-[15px] font-bold leading-none">B</span></ToolButton>
        <ToolButton active={activeFormats.italic} label="In nghiêng" onClick={() => command('italic')}><span className="font-serif text-[17px] italic leading-none">I</span></ToolButton>
        <ToolButton active={activeFormats.underline} label="Gạch chân" onClick={() => command('underline')}><span className="text-[15px] font-semibold leading-none underline underline-offset-4">U</span></ToolButton>
        <ToolbarDivider />
        <select
          className="h-8 rounded-md border border-[#e2e2e2] bg-white px-2.5 text-sm font-medium text-[#525252] outline-none transition hover:border-[#d4d4d4] focus:border-[#de3336] focus:ring-2 focus:ring-[#de3336]/10"
          value={heading}
          aria-label="Định dạng heading"
          onChange={(event) => command('formatBlock', event.target.value)}
        >
          <option value="p">Normal</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <ToolbarDivider />
        <ToolButton active={activeFormats.unorderedList} label="Danh sách chấm" onClick={() => command('insertUnorderedList')}>
          <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 7h10M9 12h10M9 17h10" strokeLinecap="round"/><circle cx="5" cy="7" r="1.2" fill="currentColor"/><circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="5" cy="17" r="1.2" fill="currentColor"/></svg>
        </ToolButton>
        <ToolButton active={activeFormats.orderedList} label="Danh sách số" onClick={() => command('insertOrderedList')}>
          <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M10 7h9M10 12h9M10 17h9" strokeLinecap="round"/><path d="M4.5 8V5.5L3.8 6M3.8 13h2.4c0-1.3-2.2-1-2.2-2.3 0-.7.5-1.1 1.2-1.1.4 0 .8.1 1 .4M3.8 15.5h2.3l-1.2 1.2c.8 0 1.4.4 1.4 1.1 0 .8-.6 1.2-1.4 1.2-.5 0-1-.1-1.3-.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </ToolButton>
        <ToolbarDivider />
        <label className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-[#525252] transition hover:bg-[#f1f1f1] hover:text-[#de3336] focus-within:ring-2 focus-within:ring-[#de3336]/15" title="Màu chữ" aria-label="Màu chữ">
          <span className="relative flex h-5 w-5 items-center justify-center text-[13px] font-semibold leading-none">
            A
            <span className="absolute -bottom-0.5 h-1 w-5 rounded-full border border-black/10" style={{ backgroundColor: textColor }} />
          </span>
          <input className="sr-only" type="color" value={textColor} onChange={(event) => changeColor(event.target.value)} />
        </label>
        <ToolbarDivider />
        <ToolButton label="Xóa định dạng" onClick={() => command('removeFormat')}>
          <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m4 19 7.5-7.5M8 5h10M6 5h2l8 14M13 19h7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </ToolButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        className={`${minHeightClassName} p-5 text-sm leading-6 text-[#1a1c1c] outline-none empty:before:pointer-events-none empty:before:text-[#9ca3af] empty:before:content-[attr(data-placeholder)] [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6`}
        onInput={(event) => {
          onChange(event.currentTarget.innerHTML)
          updateToolbar()
        }}
        onKeyUp={updateToolbar}
        onMouseUp={updateToolbar}
      />
    </div>
  )
}
