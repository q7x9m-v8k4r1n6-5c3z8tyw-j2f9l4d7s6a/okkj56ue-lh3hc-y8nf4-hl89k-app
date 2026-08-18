import { useState, type ChangeEvent } from 'react'
import { CardMembershipIcon, UploadIcon } from '@/core/assets'
import { Button, Drawer, Input } from '@/core/shared'
import {
  cardCategoryLabels,
  createFunctionCardKey,
  type CardCategory,
  type FunctionCard,
  type SaveFunctionCardRequest,
} from '../../model/mockCards'

type Props = {
  open: boolean
  card?: FunctionCard | null
  onClose: () => void
  onSave: (request: SaveFunctionCardRequest, backgroundFile: File | null) => Promise<void>
}

export const FunctionCardDrawer = ({ card, onClose, onSave, open }: Props) => {
  const [name, setName] = useState(card?.name ?? '')
  const [description, setDescription] = useState(card?.description ?? '')
  const [category, setCategory] = useState<CardCategory>(card?.category ?? 'attack')
  const [backgroundUrl, setBackgroundUrl] = useState(card?.backgroundUrl ?? '')
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const selectBackground = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Hình nền phải là tệp hình ảnh.')
      return
    }
    if (file.size > 1_500_000) {
      setError('Hình nền mô phỏng không được vượt quá 1,5 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setBackgroundUrl(typeof reader.result === 'string' ? reader.result : '')
      setError('')
    }
    setBackgroundFile(file)
    reader.readAsDataURL(file)
  }

  const submit = async () => {
    if (!name.trim()) {
      setError('Tên thẻ chức năng không được để trống.')
      return
    }
    setPending(true)
    try {
      await onSave({
        cardKey: card?.key ?? createFunctionCardKey(name),
        name: name.trim(),
        description: description.trim(),
        category,
        backgroundUrl: card?.backgroundUrl || null,
        inputs: card?.inputs ?? [],
        expectedModifiedAt: card?.modifiedAt,
      }, backgroundFile)
      onClose()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Không thể lưu thẻ chức năng.')
    } finally {
      setPending(false)
    }
  }

  return (
    <Drawer
      open={open}
      title={card ? 'Chỉnh sửa thẻ chức năng' : 'Tạo thẻ chức năng'}
      icon={<CardMembershipIcon className="size-6 text-[#de3336]" />}
      panelClassName="max-w-[560px]"
      onClose={pending ? () => undefined : onClose}
      footer={(
        <>
          <Button variant="secondary" disabled={pending} onClick={onClose}>Hủy</Button>
          <Button disabled={pending} onClick={() => void submit()}>{card ? 'Lưu thay đổi' : 'Tạo thẻ'}</Button>
        </>
      )}
    >
      <div className="space-y-5">
        <Input
          label="Tên thẻ chức năng"
          requiredMark
          value={name}
          placeholder="Ví dụ: Đóng băng đối thủ"
          onChange={(event) => { setName(event.target.value); setError('') }}
        />
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15px] text-[#1a1c1c]">Mô tả</span>
          <textarea
            rows={4}
            maxLength={500}
            className="w-full resize-none rounded-lg border border-[#e2e2e2] px-4 py-3 text-sm outline-none focus:border-[#de3336] focus:ring-2 focus:ring-[#de3336]/10"
            value={description}
            placeholder="Mô tả cách thẻ hoạt động"
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15px] text-[#1a1c1c]">Loại thẻ</span>
          <select
            className="h-12 w-full rounded-lg border border-[#e2e2e2] bg-white px-4 text-sm outline-none focus:border-[#de3336]"
            value={category}
            onChange={(event) => setCategory(event.target.value as CardCategory)}
          >
            {Object.entries(cardCategoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15px] text-[#1a1c1c]">Hình nền</span>
          <label className="group relative grid min-h-52 cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed border-[#d6d6d6] bg-gradient-to-br from-[#5b1416] via-[#9f2528] to-[#de3336]">
            {backgroundUrl ? <img src={backgroundUrl} alt="Xem trước hình nền" className="absolute inset-0 size-full object-cover" /> : null}
            <span className="relative z-10 flex items-center gap-2 rounded-lg bg-black/45 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <UploadIcon className="size-5" /> Chọn hình nền
            </span>
            <input className="sr-only" type="file" accept="image/*" onChange={selectBackground} />
          </label>
          <p className="mt-2 text-xs text-[#737373]">PNG, JPG hoặc WebP, tối đa 1,5 MB. Nếu bỏ trống sẽ dùng nền mặc định.</p>
        </div>
        {error ? <p className="rounded-lg bg-[#fff1f1] px-3 py-2 text-sm text-[#b91c1c]">{error}</p> : null}
      </div>
    </Drawer>
  )
}
