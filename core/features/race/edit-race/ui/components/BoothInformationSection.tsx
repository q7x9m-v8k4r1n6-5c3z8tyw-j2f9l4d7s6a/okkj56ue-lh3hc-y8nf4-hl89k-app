import { OrganizerSearchBox } from '@/core/entities/organizer'
import { PlusIcon, TrashGlyph } from '@/core/assets'
import {
  Button,
  IconButton,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/core/shared'
import { AvatarName } from './AvatarName'
import { SectionCard } from './SectionCard'
import { SectionTitle } from './SectionTitle'
import { useBoothInformationSection } from '../hooks/useBoothInformationSection'

export const BoothInformationSection = () => {
  const section = useBoothInformationSection()

  return (
    <SectionCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle index={2} title="Thông tin trạm" />
        {section.isEditing ? (
          <Button variant="secondary" leadingIcon={<PlusIcon className="size-4" />} onClick={section.addBooth}>
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
              {section.isEditing ? <TableHeaderCell className="w-12" /> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {section.booths.map((booth) => (
              <TableRow key={booth.id} className="border-[#f5f5f5]">
                <TableCell>
                  {section.isEditing ? (
                    <Input aria-label="Tên trạm" error={section.errors[booth.id]?.name} value={booth.name} onChange={booth.onNameChange} />
                  ) : booth.name}
                </TableCell>
                <TableCell>
                  {section.isEditing ? (
                    <Input aria-label="Địa điểm trạm" error={section.errors[booth.id]?.place} value={booth.place} onChange={booth.onPlaceChange} />
                  ) : booth.place}
                </TableCell>
                <TableCell className="min-w-[230px]">
                  {section.isEditing ? (
                    <OrganizerSearchBox
                      type="multiple"
                      value={booth.managers}
                      onChange={booth.onManagersChange}
                    />
                  ) : (
                    <AvatarName name={booth.managerText} />
                  )}
                </TableCell>
                <TableCell className="min-w-[260px]">
                  {section.isEditing ? (
                    <Input
                      aria-label="Mô tả trạm"
                      error={section.errors[booth.id]?.description}
                      value={booth.description}
                      onChange={booth.onDescriptionChange}
                    />
                  ) : booth.descriptionText}
                </TableCell>
                {section.isEditing ? (
                  <TableCell>
                    <IconButton
                      className="rounded-md p-2 text-[#737373] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                      aria-label="Xóa trạm"
                      icon={<TrashGlyph />}
                      onClick={booth.onRemove}
                    />
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  )
}
