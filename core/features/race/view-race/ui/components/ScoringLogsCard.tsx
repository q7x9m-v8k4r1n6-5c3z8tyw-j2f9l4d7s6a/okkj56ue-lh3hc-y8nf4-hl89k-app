import { HistoryClockIcon } from '@/core/assets/icons'
import { Skeleton, Table, TableBody, TableCell, TableRow } from '@/core/shared'
import type { BoothScoringLogResponse } from '../../models'
import { SectionHeader } from './SectionHeader'

type Props = {
  data?: BoothScoringLogResponse[]
  isLoading: boolean
}

const formatLogTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export const ScoringLogsCard = ({ data, isLoading }: Props) => {
  return (
    <div className="flex flex-col bg-white">
      <SectionHeader icon={<HistoryClockIcon className="size-5" />} title="Nhật Ký Hoạt Động" />
      {/* 216px = 3 dòng body (72px * 3) - Không có Header */}
      <div className="max-h-[245px] overflow-y-auto rounded-lg border border-[#eeeeee]">
        <Table>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell className="text-center">
                  <Skeleton lines={3} className="py-2" />
                </TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell className="text-center italic text-gray-400">Chưa có hoạt động nào.</TableCell>
              </TableRow>
            ) : (
              data?.map((log, idx) => (
                <TableRow key={idx} className="border-[#f5f5f5]">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                        <span className="text-[#333333]">
                            {log.teamName} hoàn thành {log.boothName}
                            {/* Thêm class "block" ở dưới đây */}
                            <span className="block font-semibold text-[#525252]">(+{log.scoreGiven} điểm).</span>
                        </span>
                        <span className="text-xs text-[#a6a6a6]">{formatLogTime(log.createdAt)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}