import type { ReactNode } from 'react'
import { EditIcon, PauseCircleIcon, PlayCircleIcon, PublishIcon, SaveIcon, StopCircleIcon } from '@/core/assets'
import { formatGmt7DateTime, TableCard } from '@/core/shared'

export type RaceDetailRibbonProps = {
  isEditing: boolean
  isSaving: boolean
  modifiedAt?: string
  onEdit: () => void
  onEnd: () => void
  onPause: () => void
  onPublish: () => void
  onResume: () => void
  onSave: () => void
  onStart: () => void
  saveDisabled: boolean
  status?: string
}

const draftStatuses = new Set(['draft', 'unpublished', 'new'])

const statusMeta = {
  draft: { label: 'Nháp', className: 'bg-[#e8e8e8] text-[#333333]' },
  ready: { label: 'Sẵn sàng bắt đầu', className: 'bg-[#7f56d9] text-white' },
  ongoing: { label: 'Đang diễn ra', className: 'bg-[#168944] text-white' },
  paused: { label: 'Tạm dừng', className: 'bg-[#b8ad10] text-white' },
  completed: { label: 'Đã kết thúc', className: 'bg-[#de3336] text-white' },
} as const

const normalizeStatus = (status?: string) => {
  const currentStatus = (status ?? 'draft').toLowerCase()
  if (draftStatuses.has(currentStatus)) return 'draft'
  if (currentStatus === 'ready' || currentStatus === 'ongoing' || currentStatus === 'paused' || currentStatus === 'completed') return currentStatus
  return 'draft'
}

const formatUpdatedAt = (value?: string) => {
  if (!value) return '--:--:-- --/--/----'
  return formatGmt7DateTime(value)
}

const RibbonAction = ({ disabled, icon, label, onClick }: { disabled?: boolean; icon: ReactNode; label: string; onClick: () => void }) => (
  <button
    type="button"
    className="inline-flex min-h-8 items-center gap-2 rounded-md px-2 text-sm text-[#333333] transition hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-50"
    disabled={disabled}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
)

export const RaceDetailRibbon = ({
  isEditing,
  isSaving,
  modifiedAt,
  onEdit,
  onEnd,
  onPause,
  onPublish,
  onResume,
  onSave,
  onStart,
  saveDisabled,
  status = 'draft',
}: RaceDetailRibbonProps) => {
  const currentStatus = normalizeStatus(status)
  const meta = statusMeta[currentStatus]
  const disabled = saveDisabled || isSaving

  const renderEditOrSaveAction = () => (
    isEditing ? (
      <RibbonAction disabled={disabled} icon={<SaveIcon className="size-5 shrink-0 text-[#333333]" />} label="Lưu" onClick={onSave} />
    ) : (
      <RibbonAction disabled={disabled} icon={<EditIcon className="size-5 shrink-0 text-[#333333]" />} label="Chỉnh sửa" onClick={onEdit} />
    )
  )

  const renderActions = () => {
    if (currentStatus === 'ongoing') {
      return (
        <>
          <RibbonAction disabled={disabled} icon={<PauseCircleIcon className="size-6 shrink-0 text-[#333333]" />} label="Tạm ngưng" onClick={onPause} />
          <div className="h-7 w-px bg-[#cfcaca]" />
          <RibbonAction disabled={disabled} icon={<StopCircleIcon className="size-6 shrink-0 text-[#333333]" />} label="Kết thúc" onClick={onEnd} />
        </>
      )
    }

    if (currentStatus === 'paused') {
      return (
        <>
          <RibbonAction disabled={disabled} icon={<PlayCircleIcon className="size-6 shrink-0 text-[#333333]" />} label="Tiếp tục" onClick={onResume} />
          <div className="h-7 w-px bg-[#cfcaca]" />
          <RibbonAction disabled={disabled} icon={<StopCircleIcon className="size-6 shrink-0 text-[#333333]" />} label="Kết thúc" onClick={onEnd} />
        </>
      )
    }

    if (currentStatus === 'completed') return null

    return (
      <>
        {renderEditOrSaveAction()}
        <div className="h-7 w-px bg-[#cfcaca]" />
        {currentStatus === 'draft' ? (
          <RibbonAction disabled={disabled} icon={<PublishIcon className="size-5 shrink-0 text-[#333333]" />} label="Công bố" onClick={onPublish} />
        ) : (
          <RibbonAction disabled={disabled} icon={<PlayCircleIcon className="size-6 shrink-0 text-[#333333]" />} label="Bắt đầu" onClick={onStart} />
        )}
      </>
    )
  }

  return (
    <TableCard className="rounded-lg border-[#e5e5e5] px-3 py-2 shadow-none">
      <div className="flex min-h-9 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">{renderActions()}</div>

        <div className="flex items-center gap-5 lg:ml-auto">
          <span className={`rounded-xl px-3 py-1.5 text-sm ${meta.className}`}>{meta.label}</span>
          <div className="text-right text-sm leading-4 text-[#a6a6a6]">
            <p className="italic">Cập nhật lần cuối:</p>
            <p>{formatUpdatedAt(modifiedAt)}</p>
          </div>
        </div>
      </div>
    </TableCard>
  )
}
