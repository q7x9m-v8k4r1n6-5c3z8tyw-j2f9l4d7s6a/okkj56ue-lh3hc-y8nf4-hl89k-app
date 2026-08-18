import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { PlusIcon, TrashIcon, UploadIcon } from '@/core/assets'
import { Button, IconButton } from '@/core/shared'
import {
  cardCategoryLabels,
  createEmptyCardInput,
  type CardInputDefinition,
  type CardInputType,
  type CardOptionSource,
  type FunctionCard,
} from '../../model/mockCards'

type Props = {
  card: FunctionCard
  onChange: (card: FunctionCard) => void
  onUploadBackground: (file: File) => Promise<string>
}

const inputTypeLabels: Record<CardInputType, string> = {
  text: 'Text',
  textarea: 'Textarea',
  number: 'Number',
  select: 'Select',
  multiselect: 'Multiselect',
  checkbox: 'Checkbox',
}

const inputTypeDescriptions: Record<CardInputType, string> = {
  text: 'Nhập nội dung trên một dòng',
  textarea: 'Nhập nội dung nhiều dòng',
  number: 'Nhập một giá trị số',
  select: 'Chọn một giá trị',
  multiselect: 'Chọn nhiều giá trị',
  checkbox: 'Bật hoặc tắt một lựa chọn',
}

const optionSourceLabels: Record<CardOptionSource, string> = {
  custom: 'Tùy chỉnh',
  teams: 'Danh sách các team',
  cards: 'Danh sách các thẻ chức năng',
}

const fieldClass = 'h-9 w-full rounded-lg border border-[#dedede] bg-white px-3 text-xs outline-none focus:border-[#de3336]'

const InputPreview = ({ input }: { input: CardInputDefinition }) => {
  if (input.type === 'textarea') return <textarea disabled className="min-h-20 w-full rounded-lg border border-white/25 bg-white/15 px-3 py-2 text-sm text-white placeholder:text-white/55" placeholder={input.placeholder || 'Nhập nội dung'} />
  if (input.type === 'select' || input.type === 'multiselect') {
    return (
      <select disabled multiple={input.type === 'multiselect'} className="min-h-10 w-full rounded-lg border border-white/25 bg-white/15 px-3 py-2 text-sm text-white">
        <option>{input.optionSource === 'custom' ? input.options[0]?.label ?? 'Chọn giá trị' : optionSourceLabels[input.optionSource]}</option>
      </select>
    )
  }
  if (input.type === 'checkbox') return <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" disabled /> {input.placeholder || input.label}</label>
  return <input disabled type={input.type === 'number' ? 'number' : 'text'} className="h-10 w-full rounded-lg border border-white/25 bg-white/15 px-3 text-sm text-white placeholder:text-white/55" placeholder={input.placeholder || 'Nhập giá trị'} />
}

export const CardUsageDesigner = ({ card, onChange, onUploadBackground }: Props) => {
  const addInputRef = useRef<HTMLDivElement>(null)
  const [addInputOpen, setAddInputOpen] = useState(false)
  const [selectedInputId, setSelectedInputId] = useState<string | null>(card.inputs[0]?.id ?? null)
  const selectedInput = card.inputs.find((input) => input.id === selectedInputId)

  const patchInput = (inputId: string, patch: Partial<CardInputDefinition>) => onChange({
    ...card,
    inputs: card.inputs.map((input) => input.id === inputId ? { ...input, ...patch } : input),
  })

  useEffect(() => {
    if (!addInputOpen) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!addInputRef.current?.contains(event.target as Node)) setAddInputOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAddInputOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [addInputOpen])

  const addInput = (type: CardInputType) => {
    const input = createEmptyCardInput(type)
    onChange({ ...card, inputs: [...card.inputs, input] })
    setSelectedInputId(input.id)
    setAddInputOpen(false)
  }

  const selectBackground = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('image/') || file.size > 1_500_000) return
    const backgroundUrl = await onUploadBackground(file)
    onChange({ ...card, backgroundUrl })
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[minmax(360px,0.9fr)_minmax(520px,1.1fr)] bg-[#f7f7f7]">
      <section className="min-h-0 overflow-y-auto border-r border-[#e5e5e5] p-6">
        <div className="mx-auto max-w-[430px]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#262626]">Xem trước giao diện sử dụng thẻ</h3>
            </div>
          </div>
          <div className="relative min-h-[620px] overflow-hidden bg-gradient-to-br from-[#4b1113] via-[#9f2528] to-[#de3336] p-6 shadow-xl">
            {card.backgroundUrl ? <img src={card.backgroundUrl} alt="" className="absolute inset-0 size-full object-cover" /> : null}
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/35 to-black/75" />
            <div className="relative z-10 flex min-h-[572px] flex-col">
              <div className="mt-auto">
                <h2 className="text-3xl font-semibold text-white">{card.name}</h2>
                <p className="mt-2 text-sm leading-6 text-white/80">{card.description || 'Chưa có mô tả.'}</p>
                <div className="mt-6 space-y-4">
                  {card.inputs.map((input) => (
                    <label key={input.id} className="block">
                      <span className="mb-1.5 block text-xs font-medium text-white">{input.label}{input.required ? ' *' : ''}</span>
                      <InputPreview input={input} />
                    </label>
                  ))}
                </div>
                <button type="button" className="mt-6 h-11 w-full rounded-xl bg-white text-sm font-semibold text-[#9f2528]">Sử dụng thẻ</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-0 overflow-y-auto bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#737373]">Tên thẻ</span>
            <input className={fieldClass} value={card.name} onChange={(event) => onChange({ ...card, name: event.target.value })} />
          </label>
          <label>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#737373]">Loại</span>
            <select className={fieldClass} value={card.category} onChange={(event) => onChange({ ...card, category: event.target.value as FunctionCard['category'] })}>
              {Object.entries(cardCategoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#737373]">Mô tả</span>
            <textarea className={`${fieldClass} h-auto min-h-20 py-2`} value={card.description} onChange={(event) => onChange({ ...card, description: event.target.value })} />
          </label>
          <label className="sm:col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#d7d7d7] px-4 py-3 text-xs font-medium text-[#525252] hover:bg-[#fafafa]">
            <UploadIcon className="size-4" /> Thay hình nền
            <input className="sr-only" type="file" accept="image/*" onChange={(event) => void selectBackground(event)} />
          </label>
        </div>

        <div className="my-6 border-t border-[#eeeeee]" />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#262626]">Các ô input</h3>
          </div>
          <div ref={addInputRef} className="relative">
            <Button
              size="sm"
              leadingIcon={<PlusIcon className="size-4" />}
              aria-haspopup="menu"
              aria-expanded={addInputOpen}
              onClick={() => setAddInputOpen((current) => !current)}
            >
              Thêm input
            </Button>
            {addInputOpen ? (
              <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-40 w-72 rounded-xl border border-[#e5e5e5] bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
                <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">Chọn loại input</p>
                {Object.entries(inputTypeLabels).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="menuitem"
                    className="block w-full rounded-lg px-3 py-2.5 text-left hover:bg-[#fff5f5]"
                    onClick={() => addInput(value as CardInputType)}
                  >
                    <span className="block text-xs font-semibold text-[#262626]">{label}</span>
                    <span className="mt-0.5 block text-[10px] text-[#737373]">{inputTypeDescriptions[value as CardInputType]}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid min-h-72 grid-cols-[190px_1fr] overflow-hidden rounded-xl border border-[#eeeeee]">
          <div className="border-r border-[#eeeeee] bg-[#fafafa] p-2">
            {card.inputs.length ? card.inputs.map((input) => (
              <button
                key={input.id}
                type="button"
                className={`mb-1 w-full rounded-lg px-3 py-2 text-left ${selectedInputId === input.id ? 'bg-[#fff0f0] text-[#a92326]' : 'text-[#525252] hover:bg-white'}`}
                onClick={() => setSelectedInputId(input.id)}
              >
                <span className="block truncate text-xs font-semibold">{input.label}</span>
                <span className="text-[10px] text-[#8a8a8a]">{inputTypeLabels[input.type]}</span>
              </button>
            )) : <p className="p-3 text-xs leading-5 text-[#9a9a9a]">Chưa có input.</p>}
          </div>

          <div className="p-4">
            {selectedInput ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <strong className="text-sm text-[#262626]">Cấu hình input</strong>
                  <IconButton
                    aria-label="Xóa input"
                    icon={<TrashIcon className="size-4" />}
                    onClick={() => {
                      onChange({ ...card, inputs: card.inputs.filter((item) => item.id !== selectedInput.id) })
                      setSelectedInputId(null)
                    }}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label><span className="mb-1 block text-[10px] uppercase text-[#737373]">Nhãn</span><input className={fieldClass} value={selectedInput.label} onChange={(event) => patchInput(selectedInput.id, { label: event.target.value })} /></label>
                  <label><span className="mb-1 block text-[10px] uppercase text-[#737373]">Key</span><input className={fieldClass} value={selectedInput.key} onChange={(event) => patchInput(selectedInput.id, { key: event.target.value.replace(/[^a-zA-Z0-9_]/g, '') })} /></label>
                  <label><span className="mb-1 block text-[10px] uppercase text-[#737373]">Loại input</span><select className={fieldClass} value={selectedInput.type} onChange={(event) => patchInput(selectedInput.id, { type: event.target.value as CardInputType })}>{Object.entries(inputTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                  <label><span className="mb-1 block text-[10px] uppercase text-[#737373]">Placeholder</span><input className={fieldClass} value={selectedInput.placeholder} onChange={(event) => patchInput(selectedInput.id, { placeholder: event.target.value })} /></label>
                </div>
                <label className="flex items-center gap-2 text-xs text-[#525252]"><input type="checkbox" checked={selectedInput.required} onChange={(event) => patchInput(selectedInput.id, { required: event.target.checked })} /> Bắt buộc nhập</label>

                {(selectedInput.type === 'select' || selectedInput.type === 'multiselect') && (
                  <div className="rounded-xl border border-[#eeeeee] p-4">
                    <label className="block">
                      <span className="mb-1 block text-[10px] uppercase text-[#737373]">Nguồn lựa chọn</span>
                      <select
                        className={fieldClass}
                        value={selectedInput.optionSource}
                        onChange={(event) => patchInput(selectedInput.id, { optionSource: event.target.value as CardOptionSource })}
                      >
                        {Object.entries(optionSourceLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </label>
                    {selectedInput.optionSource === 'custom' ? (
                      <div className="mt-4 space-y-2">
                        {selectedInput.options.map((option) => (
                          <div key={option.id} className="grid grid-cols-[1fr_1fr_32px] gap-2">
                            <input className={fieldClass} value={option.label} placeholder="Nhãn" onChange={(event) => patchInput(selectedInput.id, { options: selectedInput.options.map((item) => item.id === option.id ? { ...item, label: event.target.value } : item) })} />
                            <input className={fieldClass} value={option.value} placeholder="Giá trị" onChange={(event) => patchInput(selectedInput.id, { options: selectedInput.options.map((item) => item.id === option.id ? { ...item, value: event.target.value } : item) })} />
                            <IconButton aria-label="Xóa lựa chọn" icon={<TrashIcon className="size-4" />} onClick={() => patchInput(selectedInput.id, { options: selectedInput.options.filter((item) => item.id !== option.id) })} />
                          </div>
                        ))}
                        <Button variant="secondary" size="sm" onClick={() => patchInput(selectedInput.id, { options: [...selectedInput.options, { id: crypto.randomUUID(), label: 'Lựa chọn mới', value: `option_${selectedInput.options.length + 1}` }] })}>+ Thêm lựa chọn</Button>
                      </div>
                    ) : (
                      <p className="mt-3 rounded-lg bg-[#fafafa] px-3 py-2.5 text-[11px] leading-5 text-[#737373]">
                        {selectedInput.optionSource === 'teams'
                          ? 'Khi sử dụng thẻ, hệ thống hiển thị danh sách team của race hiện tại.'
                          : 'Khi sử dụng thẻ, hệ thống hiển thị danh sách thẻ chức năng của race hiện tại.'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : <div className="grid h-full place-items-center text-xs text-[#9a9a9a]">Chọn hoặc thêm một input để cấu hình.</div>}
          </div>
        </div>
      </section>
    </div>
  )
}
