import { UsersIcon } from '@/core/assets/icons'
import { Skeleton, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/core/shared'
import type { LiveRaceSelectedTeam } from '../../model/liveRace.selection'
import { useTeamDetailsSection } from '../hooks/useTeamDetailsSection'
import { SectionHeader } from './SectionHeader'

type TeamDetailsCardProps = {
  raceId?: string
  onSelectTeam: (team: LiveRaceSelectedTeam) => void
}

export const TeamDetailsCard = ({ raceId, onSelectTeam }: TeamDetailsCardProps) => {
  const { teams, isLoading, emptyMessage, selectTeam } = useTeamDetailsSection({
    raceId,
    onSelectTeam,
  })

  return (
    <div className="flex flex-col bg-white">
      <SectionHeader icon={<UsersIcon className="size-5" />} title="Chi tiết đội" />
      <Table wrapperClassName="max-h-[332px] overflow-y-auto rounded-lg border border-[#e5e5e5]">
        <TableHead className="sticky top-0 z-1 bg-[#DE3336]">
          <TableRow className="border-none">
            <TableHeaderCell className="font-bold text-white">TÊN ĐỘI</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell className="text-center">
                <Skeleton lines={5} className="py-2" />
              </TableCell>
            </TableRow>
          ) : teams.length === 0 ? (
            <TableRow>
              <TableCell className="text-center italic text-gray-400">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            teams.map((team) => (
              <TableRow key={team.teamId} className="border-[#f5f5f5]">
                <TableCell>
                  <button
                    type="button"
                    className="font-medium text-[#333333] underline underline-offset-4 transition hover:text-[#DE3336]"
                    onClick={() => selectTeam(team)}
                  >
                    {team.displayName}
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
