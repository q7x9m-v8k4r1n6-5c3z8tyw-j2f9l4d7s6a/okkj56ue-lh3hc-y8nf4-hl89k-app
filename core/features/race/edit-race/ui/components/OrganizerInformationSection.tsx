import { OrganizerSearchBox } from '@/core/entities/organizer'
import { TrashGlyph } from '@/core/assets'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/core/shared'
import type { EditRaceOrganizer } from '../../models'
import { AvatarName } from './AvatarName'
import { SectionCard } from './SectionCard'
import { SectionTitle } from './SectionTitle'

export type OrganizerInformationSectionProps = {
  addOrganizer: (organizers: Array<{ id: string; displayName?: string; email: string }>) => void
  isEditing: boolean
  organizers: EditRaceOrganizer[]
  removeOrganizer: (id: string) => void
}

export const OrganizerInformationSection = ({ addOrganizer, isEditing, organizers, removeOrganizer }: OrganizerInformationSectionProps) => (
  <SectionCard>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <SectionTitle index={4} title="Ban tổ chức liên quan" />
      {isEditing ? (
        <div className="w-full lg:w-[360px]">
          <OrganizerSearchBox placeholder="Thêm ban tổ chức" onChange={addOrganizer} />
        </div>
      ) : null}
    </div>

    <div className="mt-9 overflow-hidden rounded-lg border border-[#eeeeee]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Họ và tên</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            {isEditing ? <TableHeaderCell className="w-12" /> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {organizers.map((organizer) => (
            <TableRow key={organizer.id} className="border-[#f5f5f5]">
              <TableCell>
                <AvatarName name={organizer.displayName} />
              </TableCell>
              <TableCell>{organizer.email}</TableCell>
              {isEditing ? (
                <TableCell>
                  <button
                    type="button"
                    className="rounded-md p-2 text-[#737373] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                    aria-label="Xóa ban tổ chức"
                    onClick={() => removeOrganizer(organizer.id)}
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
