import { TeamSearchBox } from '@/core/entities/team'
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
import { SectionCard } from './SectionCard'
import { SectionTitle } from './SectionTitle'
import { useTeamInformationSection } from '../hooks/useTeamInformationSection'

export const TeamInformationSection = () => {
  const section = useTeamInformationSection()

  return (
    <SectionCard>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitle index={3} title="Thông tin đội chơi" />
        {section.isEditing ? (
          <div className="w-full lg:w-[360px]">
            <TeamSearchBox placeholder="Thêm đội chơi" onChange={section.onAddTeams} />
          </div>
        ) : null}
      </div>

      <div className="mt-9 overflow-hidden rounded-lg border border-[#eeeeee]">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Email đội trưởng</TableHeaderCell>
              <TableHeaderCell>Tên đội chơi</TableHeaderCell>
              {section.isEditing ? <TableHeaderCell className="w-12" /> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {section.teams.map((team) => (
              <TableRow key={team.id} className="border-[#f5f5f5]">
                <TableCell>{team.leaderEmail}</TableCell>
                <TableCell>{team.name}</TableCell>
                {section.isEditing ? (
                  <TableCell>
                    <IconButton
                      className="rounded-md p-2 text-[#737373] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                      aria-label="Xóa đội chơi"
                      icon={<TrashGlyph />}
                      onClick={team.onRemove}
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
