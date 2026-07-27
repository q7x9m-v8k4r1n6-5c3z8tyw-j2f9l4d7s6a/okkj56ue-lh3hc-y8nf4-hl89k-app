import { OrganizerSearchBox } from '@/core/entities/organizer'
import { TrashGlyph } from '@/core/assets'
import {
  IconButton,
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
import { useOrganizerInformationSection } from '../hooks/useOrganizerInformationSection'

export const OrganizerInformationSection = () => {
  const section = useOrganizerInformationSection()

  return (
    <SectionCard>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitle index={4} title="Ban tổ chức liên quan" />
        {section.isEditing ? (
          <div className="w-full lg:w-[360px]">
            <OrganizerSearchBox placeholder="Thêm ban tổ chức" onChange={section.onAddOrganizers} />
          </div>
        ) : null}
      </div>

      <div className="mt-9 overflow-hidden rounded-lg border border-[#eeeeee]">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Họ và tên</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              {section.isEditing ? <TableHeaderCell className="w-12" /> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {section.organizers.map((organizer) => (
              <TableRow key={organizer.id} className="border-[#f5f5f5]">
                <TableCell>
                  <AvatarName name={organizer.displayName} />
                </TableCell>
                <TableCell>{organizer.email}</TableCell>
                {section.isEditing ? (
                  <TableCell>
                    <IconButton
                      className="rounded-md p-2 text-[#737373] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                      aria-label="Xóa ban tổ chức"
                      icon={<TrashGlyph />}
                      onClick={organizer.onRemove}
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
