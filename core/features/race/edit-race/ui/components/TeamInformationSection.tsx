import { TeamSearchBox } from '@/core/entities/team'
import { TrashGlyph } from '@/core/assets'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/core/shared'
import type { EditRaceTeam } from '../../models'
import { SectionCard } from './SectionCard'
import { SectionTitle } from './SectionTitle'

export type TeamInformationSectionProps = {
  addTeam: (teams: Array<{ id: string; name: string; leaderEmail: string }>) => void
  isEditing: boolean
  removeTeam: (id: string) => void
  teams: EditRaceTeam[]
}

export const TeamInformationSection = ({ addTeam, isEditing, removeTeam, teams }: TeamInformationSectionProps) => (
  <SectionCard>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <SectionTitle index={3} title="Thông tin đội chơi" />
      {isEditing ? (
        <div className="w-full lg:w-[360px]">
          <TeamSearchBox placeholder="Thêm đội chơi" onChange={addTeam} />
        </div>
      ) : null}
    </div>

    <div className="mt-9 overflow-hidden rounded-lg border border-[#eeeeee]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Email đội trưởng</TableHeaderCell>
            <TableHeaderCell>Tên đội chơi</TableHeaderCell>
            {isEditing ? <TableHeaderCell className="w-12" /> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id} className="border-[#f5f5f5]">
              <TableCell>{team.leaderEmail}</TableCell>
              <TableCell>{team.name}</TableCell>
              {isEditing ? (
                <TableCell>
                  <button
                    type="button"
                    className="rounded-md p-2 text-[#737373] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                    aria-label="Xóa đội chơi"
                    onClick={() => removeTeam(team.id)}
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
