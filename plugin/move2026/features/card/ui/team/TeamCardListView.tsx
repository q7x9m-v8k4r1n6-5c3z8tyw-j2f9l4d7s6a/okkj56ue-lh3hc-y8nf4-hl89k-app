import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Skeleton, Table, TableBody, TableCell, TableRow } from '@/core/shared'
import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout'
import { useTeamCardList } from '../../model/server/useCardQueries'

export const TeamCardListView = () => {
  const { raceId = '' } = useParams<{ raceId: string }>()
  const navigate = useNavigate()
  const query = useTeamCardList(raceId)

  return (
    <MobileScreenLayout
      title="Card của đội"
      onBack={() => navigate(`/team/races/${raceId}`)}
      contentClassName="px-3"
    >
      <div className="overflow-hidden rounded-[20px] border border-[#e2e2e2] bg-white shadow-sm">
        <Table>
          <TableBody>
            {query.isLoading ? (
              <>
                <TableRow><TableCell><Skeleton lines={1} className="h-5 w-1/2" /></TableCell></TableRow>
                <TableRow><TableCell><Skeleton lines={1} className="h-5 w-2/3" /></TableCell></TableRow>
              </>
            ) : query.isError ? (
              <TableRow><TableCell className="py-10 text-center italic text-red-500">Không thể tải danh sách card.</TableCell></TableRow>
            ) : !query.data?.length ? (
              <TableRow><TableCell className="py-10 text-center italic text-gray-400">Kho card của đội đang trống.</TableCell></TableRow>
            ) : query.data.map((card) => (
              <TableRow
                key={card.cardInstanceId}
                className="cursor-pointer transition-colors hover:bg-gray-50 active:bg-gray-100"
                onClick={() => navigate(`/team/races/${raceId}/cards/${card.cardInstanceId}`)}
              >
                <TableCell className="flex w-full items-center justify-between gap-4 border-b border-[#f5f5f5] px-5 py-6 last:border-none">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold text-[#420001] underline underline-offset-4">{card.cardName}</span>
                      <span className="rounded bg-[#f5f5f5] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#737373]">
                        {card.cardType === 'core_chip' ? 'Core Chip' : 'Data Patch'}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#737373]">{card.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge variant={card.availability.canUse ? 'success' : 'neutral'}>
                      {card.availability.canUse ? 'Có thể dùng' : card.status === 'used' ? 'Đã sử dụng' : 'Chưa thể dùng'}
                    </Badge>
                    <span className="mt-2 block text-xs text-[#8a8a8a]">Còn {card.cardUseCountRemain} lượt</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MobileScreenLayout>
  )
}
