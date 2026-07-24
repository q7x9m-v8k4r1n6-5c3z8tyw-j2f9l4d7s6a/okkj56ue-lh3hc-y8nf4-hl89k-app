import { LeaderboardIcon } from '@/core/assets/icons'
import { Skeleton, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/core/shared'
import type { TeamLeaderboardResponse } from '../../models'
import { SectionHeader } from './SectionHeader'

type Props = {
  data?: TeamLeaderboardResponse[]
  isLoading: boolean
}

export const LeaderboardCard = ({ data, isLoading }: Props) => {
  return (
    <div className="flex flex-col rounded-xl bg-white">
      <SectionHeader icon={<LeaderboardIcon className="size-5" />} title="Bảng Xếp Hạng" />
      <Table wrapperClassName="max-h-[404px] overflow-y-auto rounded-lg border border-[#eeeeee]">
        <TableHead className="sticky top-0 z-10 bg-[#DE3336]">
          <TableRow className="border-none">
            <TableHeaderCell className="text-center font-bold text-white">HẠNG</TableHeaderCell>
            <TableHeaderCell className="font-bold text-white">TÊN ĐỘI</TableHeaderCell>
            <TableHeaderCell className="font-bold text-white">ĐIỂM</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center"><Skeleton lines={5} className="py-2" /></TableCell>
            </TableRow>
          ) : data?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center italic text-gray-400">Chưa có dữ liệu</TableCell>
            </TableRow>
          ) : (
            data?.map((team, index) => (
              <TableRow key={index} className="border-[#f5f5f5]">
                <TableCell className="text-center text-[#525252]">
                  #{String(index + 1).padStart(2, '0')}
                </TableCell>
                <TableCell className="font-medium text-[#333333]">{team.displayName}</TableCell>
                <TableCell className="text-[#525252]">{team.totalScore}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}