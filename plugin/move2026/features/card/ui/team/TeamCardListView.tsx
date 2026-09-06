import { useParams, useNavigate } from 'react-router-dom'
import { CardMembershipIcon } from '@/core/assets'
import { Badge, Skeleton } from '@/core/shared'
import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout'
import { useTeamCardList } from '../../model/server/useCardQueries'

export const TeamCardListView = () => {
  const { raceId = '' } = useParams<{ raceId: string }>()
  const navigate = useNavigate()
  const query = useTeamCardList(raceId)
  return <MobileScreenLayout title="Danh sách card" onBack={() => navigate(`/team/races/${raceId}`)} contentClassName="bg-[#fafafa] px-4 py-5">
    <div className="mb-5 flex items-center gap-2"><CardMembershipIcon className="size-6 text-[#de3336]" /><div><h2 className="text-lg font-bold text-[#1a1c1c]">Card của đội</h2><p className="text-xs text-[#737373]">Mỗi card là một bản riêng và có lịch sử sử dụng riêng.</p></div></div>
    {query.isLoading ? <div className="space-y-3"><Skeleton className="h-28 w-full rounded-xl" /><Skeleton className="h-28 w-full rounded-xl" /></div> : query.isError ? <p className="py-10 text-center text-sm text-red-500">Không thể tải danh sách card.</p> : query.data?.length ? <div className="space-y-3">{query.data.map((card) => <button type="button" key={card.cardInstanceId} className="w-full rounded-xl border border-[#e2e2e2] bg-white p-4 text-left shadow-sm transition hover:border-[#de3336]" onClick={() => navigate(`/team/races/${raceId}/cards/${card.cardInstanceId}`)}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="mb-1 flex flex-wrap items-center gap-2"><h3 className="font-bold text-[#111111]">{card.cardName}</h3><span className="rounded bg-[#f5f5f5] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#737373]">{card.cardType === 'core_chip' ? 'Core Chip' : 'Data Patch'}</span></div><p className="line-clamp-2 text-xs text-[#737373]">{card.description}</p></div><Badge variant={card.availability.canUse ? 'success' : 'neutral'}>{card.availability.canUse ? 'Có thể dùng' : card.status === 'used' ? 'Đã sử dụng' : 'Chưa thể dùng'}</Badge></div><div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#8a8a8a]"><span>Còn {card.cardUseCountRemain} lượt</span><span>{card.availability.reason}</span></div></button>)}</div> : <p className="py-10 text-center text-sm italic text-[#8a8a8a]">Kho card của đội đang trống.</p>}
  </MobileScreenLayout>
}
