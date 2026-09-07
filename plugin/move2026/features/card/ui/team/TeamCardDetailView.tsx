import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'
import { Badge, Button, Skeleton, useConfirmDialog, useToast } from '@/core/shared'
import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout'
import { useRaceOptions, useTeamCardDetail, useUseTeamCard } from '../../model/server/useCardQueries'
import type { TeamCard } from '../../model/card.contract'

const selectClassName = 'h-11 w-full rounded-lg border border-[#d4d4d4] bg-white px-3 text-sm text-[#262626] outline-none transition focus:border-[#de3336] focus:ring-2 focus:ring-[#fde8e8] disabled:bg-[#f5f5f5]'

type OverclockPrediction = { targetTeamId: string; boothId: string }

const readPredictions = (value: unknown): OverclockPrediction[] => Array.isArray(value)
  ? value.filter((item): item is OverclockPrediction => Boolean(
    item && typeof item === 'object' &&
    typeof (item as OverclockPrediction).targetTeamId === 'string' &&
    typeof (item as OverclockPrediction).boothId === 'string',
  ))
  : []

const statusLabel: Record<TeamCard['cardUses'][number]['status'], string> = {
  pending: 'Chờ xác nhận',
  active: 'Đang hiệu lực',
  resolved: 'Đã xử lý',
  failed: 'Thất bại',
}

export const TeamCardDetailView = () => {
  const { raceId = '', cardInstanceId = '' } = useParams<{ raceId: string; cardInstanceId: string }>()
  const navigate = useNavigate()
  const auth = useAuthSession()
  const query = useTeamCardDetail(raceId, cardInstanceId)
  const optionsQuery = useRaceOptions(raceId)
  const useMutation = useUseTeamCard(raceId, cardInstanceId)
  const { confirm } = useConfirmDialog()
  const { toast } = useToast()
  const [inputs, setInputs] = useState<Record<string, unknown>>({})
  const cardUseIdRef = useRef<string | null>(null)

  const card = query.data
  const teams = (optionsQuery.data?.teams ?? []).filter((team) => team.id !== auth.user?.id)
  const booths = optionsQuery.data?.booths ?? []
  const missingRequiredInput = card?.inputs.some((input) => {
    if (!input.required) return false
    if (input.type !== 'overclock_predictions') return !inputs[input.key]
    const predictions = readPredictions(inputs[input.key])
    return predictions.length !== teams.length || predictions.some((prediction) => !prediction.boothId)
  }) ?? false
  const disabled = !card || !card.availability.canUse || missingRequiredInput ||
    optionsQuery.isLoading || optionsQuery.isError || useMutation.isPending

  const setOverclockPrediction = (key: string, targetTeamId: string, boothId: string) => {
    setInputs((current) => {
      const predictions = readPredictions(current[key])
      const next = predictions.filter((item) => item.targetTeamId !== targetTeamId)
      next.push({ targetTeamId, boothId })
      return { ...current, [key]: next }
    })
  }

  const submit = async () => {
    if (!card) return
    const accepted = await confirm({
      title: `Sử dụng ${card.cardName}?`,
      description: 'Hành động này sẽ được ghi nhận và có thể trừ lượt dùng của card.',
    })
    if (!accepted) return
    cardUseIdRef.current ??= crypto.randomUUID()
    useMutation.mutate(
      { cardUseId: cardUseIdRef.current, inputs },
      {
        onSuccess: (result) => {
          cardUseIdRef.current = null
          toast({ title: result.message, description: 'Trạng thái card đã được cập nhật.' })
        },
        onError: (error) => toast({ title: 'Không thể sử dụng card', description: error instanceof Error ? error.message : 'Vui lòng thử lại.', variant: 'danger' }),
      },
    )
  }

  return <MobileScreenLayout
    title={card?.cardName ?? 'Chi tiết card'}
    onBack={() => navigate(`/team/races/${raceId}/cards`)}
    contentClassName="bg-white px-5 pt-5"
    footer={<Button className="w-full rounded-full" disabled={disabled} onClick={() => void submit()}>{useMutation.isPending ? 'Đang ghi nhận...' : card?.availability.canUse ? 'Sử dụng card' : (card?.availability.reason ?? 'Chưa thể sử dụng')}</Button>}
  >
    {query.isLoading ? <div className="space-y-3"><Skeleton className="h-5 w-1/2" /><Skeleton className="h-20 w-full" /></div> : query.isError || !card ? <p className="py-10 text-center text-sm text-red-500">Không thể tải thông tin card.</p> : <div className="space-y-5">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2"><Badge variant={card.cardType === 'core_chip' ? 'danger' : 'neutral'}>{card.cardType === 'core_chip' ? 'Core Chip' : 'Data Patch'}</Badge><span className="text-xs text-[#737373]">Còn {card.cardUseCountRemain} lượt</span></div>
        <p className="whitespace-pre-wrap text-[15px] leading-7 text-[#333333]">{card.description}</p>
        <p className="mt-3 rounded-lg bg-[#fff7f7] p-3 text-sm text-[#525252]">Cách sử dụng: {card.usage}</p>
      </div>

      {!card.availability.canUse ? <div className="rounded-lg border border-[#f1d7d8] bg-[#fffafa] p-3 text-sm text-[#8f2023]">{card.availability.reason}{card.availability.nextTimeAvailable ? ` Có thể dùng lại sau ${new Date(card.availability.nextTimeAvailable).toLocaleString('vi-VN')}.` : ''}</div> : null}

      <div className="space-y-4">{card.inputs.map((input) => <div key={input.key} className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#525252]">{input.label}{input.required ? <span className="text-[#de3336]"> (*)</span> : null}</span>{input.type === 'opponent_team' ? <select className={selectClassName} value={String(inputs[input.key] ?? '')} onChange={(event) => setInputs((current) => ({ ...current, [input.key]: event.target.value }))}><option value="">Chọn đội đối thủ</option>{teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select> : input.type === 'booth' ? <select className={selectClassName} value={String(inputs[input.key] ?? '')} onChange={(event) => setInputs((current) => ({ ...current, [input.key]: event.target.value }))}><option value="">Chọn booth</option>{booths.map((booth) => <option key={booth.id} value={booth.id}>{booth.name}{booth.type !== 'other' ? ` · ${booth.type === 'physical' ? 'Thể chất' : 'Trí óc'}` : ''}</option>)}</select> : <div className="space-y-3 rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-3">{teams.map((team) => { const prediction = readPredictions(inputs[input.key]).find((item) => item.targetTeamId === team.id); return <label key={team.id} className="block"><span className="mb-1 block text-sm font-medium text-[#333333]">{team.name}</span><select className={selectClassName} value={prediction?.boothId ?? ''} onChange={(event) => setOverclockPrediction(input.key, team.id, event.target.value)}><option value="">Chọn booth đội này đã thất bại</option>{booths.map((booth) => <option key={booth.id} value={booth.id}>{booth.name}</option>)}</select></label> })}</div>}<span className="mt-1 block text-xs text-[#8a8a8a]">{input.description}</span></div>)}</div>

      {card.cardUses.length ? <section><h2 className="mb-3 text-sm font-semibold text-[#262626]">Lịch sử sử dụng</h2><div className="space-y-2">{[...card.cardUses].reverse().map((use) => <div key={use.cardUseId} className="rounded-lg border border-[#eeeeee] p-3"><div className="flex items-center justify-between gap-3"><Badge variant={use.status === 'failed' ? 'danger' : use.status === 'resolved' ? 'success' : 'neutral'}>{statusLabel[use.status]}</Badge><time className="text-xs text-[#8a8a8a]">{new Date(use.usedAt).toLocaleString('vi-VN')}</time></div>{use.failureReason ? <p className="mt-2 text-xs text-[#b91c1c]">{use.failureReason}</p> : null}</div>)}</div></section> : null}
    </div>}
  </MobileScreenLayout>
}
