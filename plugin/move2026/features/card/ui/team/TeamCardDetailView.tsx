import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Input, Skeleton, useToast } from '@/core/shared'
import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout'
import { useTeamCardDetail, useUseTeamCard } from '../../model/server/useCardQueries'

export const TeamCardDetailView = () => {
  const { raceId = '', cardId = '' } = useParams<{ raceId: string; cardId: string }>()
  const navigate = useNavigate()
  const query = useTeamCardDetail(raceId, cardId)
  const useMutation = useUseTeamCard(raceId, cardId)
  const { toast } = useToast()
  const [inputs, setInputs] = useState<Record<string, string>>({})

  const submit = () => useMutation.mutate(inputs, { onSuccess: (result) => toast({ title: result.message, description: 'Card đã được ghi nhận.' }), onError: (error) => toast({ title: 'Không thể sử dụng card', description: error instanceof Error ? error.message : 'Vui lòng thử lại.', variant: 'danger' }) })
  const card = query.data
  const disabled = !card || card.status !== 'received' || useMutation.isPending
  return <MobileScreenLayout title={card?.cardName ?? 'Chi tiết card'} onBack={() => navigate(`/team/races/${raceId}/cards`)} contentClassName="bg-white px-5 pt-5" footer={<Button className="w-full rounded-full" disabled={disabled} onClick={submit}>{useMutation.isPending ? 'Đang ghi nhận...' : card?.status === 'used' ? 'Đã sử dụng' : 'Sử dụng card'}</Button>}>
    {query.isLoading ? <div className="space-y-3"><Skeleton className="h-5 w-1/2" /><Skeleton className="h-20 w-full" /></div> : query.isError || !card ? <p className="py-10 text-center text-sm text-red-500">Không thể tải thông tin card.</p> : <div className="space-y-5"><div><p className="whitespace-pre-wrap text-[15px] leading-7 text-[#333333]">{card.description}</p><p className="mt-3 rounded-lg bg-[#fff7f7] p-3 text-sm text-[#525252]">Cách sử dụng: {card.usage}</p></div><div className="space-y-4">{card.inputs.map((input) => <Input key={input.key} label={input.label} requiredMark={input.required} placeholder={input.description} value={inputs[input.key] ?? ''} onChange={(event) => setInputs((current) => ({ ...current, [input.key]: event.target.value }))} />)}</div>{card.usedAt ? <p className="text-xs text-[#737373]">Đã sử dụng lúc {new Date(card.usedAt).toLocaleString('vi-VN')}</p> : null}</div>}
  </MobileScreenLayout>
}
