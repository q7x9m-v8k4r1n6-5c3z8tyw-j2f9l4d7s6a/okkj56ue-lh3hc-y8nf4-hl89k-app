import { OrganizerSearchBox } from '@/core/entities/organizer'
import { PlusIcon, TrashGlyph } from '@/core/assets'
import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/core/shared'
import type { EditRaceBooth } from '../../models'
import { AvatarName } from './AvatarName'
import { SectionCard } from './SectionCard'
import { SectionTitle } from './SectionTitle'

export type BoothInformationSectionProps = {
  addBooth: () => void
  booths: EditRaceBooth[]
  isEditing: boolean
  removeBooth: (id: string) => void
  updateBooth: (id: string, changes: Partial<EditRaceBooth>) => void
}

const shorten = (value: string) => (value.length > 28 ? `${value.slice(0, 28)} ...` : value)

const formatManagers = (booth: EditRaceBooth) => {
  if (!booth.managers.length) return 'Chưa có thông tin'
  return booth.managers.map((manager) => manager.displayName || manager.email || manager.id).join(', ')
}

export const BoothInformationSection = ({
  addBooth,
  booths,
  isEditing,
  removeBooth,
  updateBooth,
}: BoothInformationSectionProps) => (
  <SectionCard>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <SectionTitle index={2} title="Thông tin trạm" />
      {isEditing ? (
        <Button variant="secondary" leadingIcon={<PlusIcon className="size-4" />} onClick={addBooth}>
          Thêm trạm
        </Button>
      ) : null}
    </div>

    <div className="mt-5 overflow-hidden rounded-lg border border-[#eeeeee]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Tên trạm</TableHeaderCell>
            <TableHeaderCell>Địa điểm</TableHeaderCell>
            <TableHeaderCell>Quản trạm</TableHeaderCell>
            <TableHeaderCell>Mô tả trạm</TableHeaderCell>
            {isEditing ? <TableHeaderCell className="w-12" /> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {booths.map((booth) => (
            <TableRow key={booth.id} className="border-[#f5f5f5]">
              <TableCell>
                {isEditing ? (
                  <Input aria-label="Tên trạm" value={booth.name} onChange={(event) => updateBooth(booth.id, { name: event.target.value })} />
                ) : (
                  booth.name
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input aria-label="Địa điểm trạm" value={booth.place} onChange={(event) => updateBooth(booth.id, { place: event.target.value })} />
                ) : (
                  booth.place
                )}
              </TableCell>
              <TableCell className="min-w-[230px]">
                {isEditing ? (
                  <OrganizerSearchBox
                    type="multiple"
                    value={booth.managers}
                    onChange={(managers) => updateBooth(booth.id, {
                      managers: managers.map((manager) => ({
                        id: manager.id,
                        displayName: manager.displayName ?? manager.email,
                        email: manager.email,
                      })),
                    })}
                  />
                ) : (
                  <AvatarName name={formatManagers(booth)} />
                )}
              </TableCell>
              <TableCell className="min-w-[260px]">
                {isEditing ? (
                  <Input
                    aria-label="Mô tả trạm"
                    value={booth.description}
                    onChange={(event) => updateBooth(booth.id, { description: event.target.value })}
                  />
                ) : (
                  shorten(booth.description || 'Chưa có thông tin')
                )}
              </TableCell>
              {isEditing ? (
                <TableCell>
                  <button
                    type="button"
                    className="rounded-md p-2 text-[#737373] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                    aria-label="Xóa trạm"
                    onClick={() => removeBooth(booth.id)}
                  >
                    <TrashGlyph />
                  </button>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </SectionCard>
)
