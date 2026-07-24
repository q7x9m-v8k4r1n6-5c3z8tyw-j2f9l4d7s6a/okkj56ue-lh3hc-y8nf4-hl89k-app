import { UsersIcon } from '@/core/assets/icons'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/core/shared'
import { SectionHeader } from './SectionHeader'

export const TeamDetailsCard = () => {
  // Hardcoded 10 đội để test Scroll
  const hardcodedTeams = Array.from({ length: 10 }, (_, i) => ({ id: i, name: 'Muhahaha' }))

  return (
    <div className="flex flex-col bg-white">
      <SectionHeader icon={<UsersIcon className="size-5" />} title="Chi tiết các đội" />
      <Table wrapperClassName="max-h-[332px] overflow-y-auto rounded-lg border border-[#eeeeee]">
        <TableHead className="sticky top-0 z-10 bg-[#DE3336]">
          <TableRow className="border-none">
            <TableHeaderCell className="font-bold text-white">TÊN ĐỘI</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hardcodedTeams.map((team) => (
            <TableRow key={team.id} className="border-[#f5f5f5]">
              <TableCell className="underline">{team.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}