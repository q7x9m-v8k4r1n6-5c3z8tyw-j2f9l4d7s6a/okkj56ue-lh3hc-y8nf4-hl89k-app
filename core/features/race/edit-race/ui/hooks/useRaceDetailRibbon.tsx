import { useMemo, type ReactNode } from 'react'
import {
  CloseIcon,
  EditIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  PublishIcon,
  SaveIcon,
  StopCircleIcon,
} from '@/core/assets'
import { formatGmt7DateTime } from '@/core/shared'
import type { EditRaceStatus } from '../../model/editRace.contract'

export type RaceDetailRibbonOptions = {
  actionsDisabled?: boolean
  isEditing: boolean
  isSaving: boolean
  modifiedAt?: string
  onCancel: () => void
  onEdit: () => void
  onEnd: () => void
  onPause: () => void
  onPublish: () => void
  onResume: () => void
  onSave: () => void
  onStart: () => void
  saveDisabled: boolean
  status: EditRaceStatus
}

export type RaceRibbonAction = {
  disabled: boolean
  icon: ReactNode
  key: string
  label: string
  onClick: () => void
  separatorBefore?: boolean
}

const statusMeta = {
  draft: { label: 'Nháp', className: 'bg-[#e8e8e8] text-[#333333]' },
  ready: { label: 'Sẵn sàng bắt đầu', className: 'bg-[#7f56d9] text-white' },
  ongoing: { label: 'Đang diễn ra', className: 'bg-[#168944] text-white' },
  paused: { label: 'Tạm dừng', className: 'bg-[#b8ad10] text-white' },
  completed: { label: 'Đã kết thúc', className: 'bg-[#de3336] text-white' },
} as const

/**
 * Builds presentation metadata and permitted actions for the race ribbon.
 *
 * Lifecycle actions are disabled while form editing is active so that saving
 * metadata and changing race status remain two explicit user intents.
 */
export const useRaceDetailRibbon = ({
  actionsDisabled = false,
  isEditing,
  isSaving,
  modifiedAt,
  onCancel,
  onEdit,
  onEnd,
  onPause,
  onPublish,
  onResume,
  onSave,
  onStart,
  saveDisabled,
  status,
}: RaceDetailRibbonOptions) => {
  const actions = useMemo<RaceRibbonAction[]>(() => {
    const disabled = actionsDisabled || isSaving

    if (status === 'completed') return []
    if (status === 'ongoing') {
      return [
        {
          disabled,
          icon: <PauseCircleIcon className="size-6 shrink-0 text-[#333333]" />,
          key: 'pause',
          label: 'Tạm ngưng',
          onClick: onPause,
        },
        {
          disabled,
          icon: <StopCircleIcon className="size-6 shrink-0 text-[#333333]" />,
          key: 'end',
          label: 'Kết thúc',
          onClick: onEnd,
          separatorBefore: true,
        },
      ]
    }
    if (status === 'paused') {
      return [
        {
          disabled,
          icon: <PlayCircleIcon className="size-6 shrink-0 text-[#333333]" />,
          key: 'resume',
          label: 'Tiếp tục',
          onClick: onResume,
        },
        {
          disabled,
          icon: <StopCircleIcon className="size-6 shrink-0 text-[#333333]" />,
          key: 'end',
          label: 'Kết thúc',
          onClick: onEnd,
          separatorBefore: true,
        },
      ]
    }

    const editActions: RaceRibbonAction[] = isEditing
      ? [
        {
          disabled: disabled || saveDisabled,
          icon: <SaveIcon className="size-5 shrink-0 text-[#333333]" />,
          key: 'save',
          label: 'Lưu',
          onClick: onSave,
        },
        {
          disabled: isSaving,
          icon: <CloseIcon className="size-5 shrink-0 text-[#333333]" />,
          key: 'cancel',
          label: 'Hủy',
          onClick: onCancel,
        },
      ]
      : [{
        disabled,
        icon: <EditIcon className="size-5 shrink-0 text-[#333333]" />,
        key: 'edit',
        label: 'Chỉnh sửa',
        onClick: onEdit,
      }]

    const lifecycleAction: RaceRibbonAction = status === 'draft'
      ? {
        disabled: disabled || isEditing,
        icon: <PublishIcon className="size-5 shrink-0 text-[#333333]" />,
        key: 'publish',
        label: 'Công bố',
        onClick: onPublish,
        separatorBefore: true,
      }
      : {
        disabled: disabled || isEditing,
        icon: <PlayCircleIcon className="size-6 shrink-0 text-[#333333]" />,
        key: 'start',
        label: 'Bắt đầu',
        onClick: onStart,
        separatorBefore: true,
      }

    return [...editActions, lifecycleAction]
  }, [
    actionsDisabled,
    isEditing,
    isSaving,
    onCancel,
    onEdit,
    onEnd,
    onPause,
    onPublish,
    onResume,
    onSave,
    onStart,
    saveDisabled,
    status,
  ])

  return {
    actions,
    modifiedAtText: modifiedAt
      ? formatGmt7DateTime(modifiedAt)
      : '--:--:-- --/--/----',
    statusClassName: statusMeta[status].className,
    statusLabel: statusMeta[status].label,
  }
}
