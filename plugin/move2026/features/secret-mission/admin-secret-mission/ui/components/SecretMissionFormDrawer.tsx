import { useEffect, useState } from 'react'
import { Button, Drawer, Input } from '@/core/shared'
import { Dropdown, type DropdownOption } from '@/core/shared/ui/Dropdown'
import type { AdminSecretMissionOverviewItem } from '../../model/adminSecretMission.contract'
import type { MissionFormValues } from '../hooks/useAdminSecretMissionListView'

type SecretMissionFormDrawerProps = {
  open: boolean
  editingMission: AdminSecretMissionOverviewItem | null
  teams: { id: string; name: string }[]
  onSubmit: (values: MissionFormValues) => void
  onClose: () => void
  isSubmitting: boolean
  errorMessage: string
}

export const SecretMissionFormDrawer = ({
  open,
  editingMission,
  teams,
  onSubmit,
  onClose,
  isSubmitting,
  errorMessage,
}: SecretMissionFormDrawerProps) => {
  const [teamId, setTeamId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!open) return
    setTeamId(editingMission?.teamId ?? '')
    setName(editingMission?.name ?? '')
    setDescription(editingMission?.description ??'')
  }, [open, editingMission])

  const teamOptions: DropdownOption[] = teams.map((team) => ({
    value: team.id,
    label: team.name,
  }))

  const isEditing = Boolean(editingMission)

  return (
    <Drawer
      open={open}
      panelClassName="!max-w-[520px]"
      title={isEditing ? 'Chỉnh sửa nhiệm vụ bí mật' : 'Tạo nhiệm vụ bí mật'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Hủy</Button>
          <Button
            onClick={() => onSubmit({ teamId, name, description })}
            disabled={isSubmitting || !teamId || !name}
          >
            {isSubmitting ? 'Đang lưu...' : isEditing ? 'Lưu' : 'Tạo'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Tên nhiệm vụ"
          requiredMark
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <Dropdown
          label="Đội chơi"
          requiredMark
          placeholder="Chọn đội để gán nhiệm vụ"
          options={teamOptions}
          value={teamId}
          onChange={setTeamId}
        />

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase leading-[14px] text-[#1a1c1c]">
            Mô tả nhiệm vụ
          </label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            className="w-full rounded-lg border border-[#e2e2e2] px-3 py-2 text-sm outline-none focus:border-[#de3336]"
          />
        </div>

        {errorMessage ? (
          <p className="text-sm font-medium text-red-600">{errorMessage}</p>
        ) : null}
      </div>
    </Drawer>
  )
}