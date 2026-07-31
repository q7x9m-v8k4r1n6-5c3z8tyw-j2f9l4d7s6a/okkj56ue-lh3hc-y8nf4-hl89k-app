import { HistoryIcon } from '@/core/assets/icons'
import { Skeleton, Table, TableBody, TableCell, TableRow } from '@/core/shared'
import { useScoringLogSection } from '../hooks/useScoringLogSection'
import { SectionHeader } from './SectionHeader'

const formatLogTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export const ScoringLogsCard = ({ raceId }: { raceId?: string }) => {
  const { logs, isLoading } = useScoringLogSection(raceId)

  return (
    <div className="flex flex-col bg-white">
      <SectionHeader icon={<HistoryIcon className="size-5" />} title="Nhật Ký Điểm" />
      <div className="max-h-[245px] overflow-y-auto rounded-lg border border-[#eeeeee]">
        <Table>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell className="text-center">
                  <Skeleton lines={3} className="py-2" />
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell className="text-center italic text-gray-400">Chưa có hoạt động nào.</TableCell>
              </TableRow>
            ) : (
              logs.map((log, idx) => (
                <TableRow key={idx} className="border-[#f5f5f5]">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#333333]">
                        {log.teamName} {log.boothName ? `hoàn thành ${log.boothName}` : `bị ${log.eventName}`}
                        <span className={`block font-semibold ${log.scoreDelta > 0 ? 'text-[#16a34a]' : 'text-[#de3336]'}`}>
                          ({log.scoreDelta > 0 ? '+' : ''}{log.scoreDelta} điểm)
                        </span>
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