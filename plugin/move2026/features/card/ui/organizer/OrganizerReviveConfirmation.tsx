import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMyBoothQuery } from '@/core/entities/booth'
import { Button, Modal, useToast } from '@/core/shared'
import { useConfirmRevive, usePendingRevive } from '../../model/server/useCardQueries'

export const OrganizerReviveConfirmation = () => {
  const { raceId = '' } = useParams<{ raceId: string }>()
  const boothQuery = useMyBoothQuery(raceId)
  const booth = boothQuery.data
  const boothId = booth?.status === 'occupied' ? booth.boothId : undefined
  const reviveQuery = usePendingRevive(raceId, boothId)
  const confirmMutation = useConfirmRevive(raceId, boothId ?? '')
  const { toast } = useToast()
  const [dismissedEffectId, setDismissedEffectId] = useState<string | null>(null)
  const revive = reviveQuery.data

  if (!booth || !boothId || !revive) return null

  const confirm = () => {
    confirmMutation.mutate(revive.effectId, {
      onSuccess: () => {
        setDismissedEffectId(null)
        toast({
          title: 'Đã xác nhận Revive',
          description: `Đội ${booth.teamName ?? 'đang chơi'} được phép chơi lại tại booth này.`,
        })
      },
      onError: (error) => toast({
        title: 'Không thể xác nhận Revive',
        description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
        variant: 'danger',
      }),
    })
  }

  if (revive.effectId === dismissedEffectId) {
    return <section className="mx-5 mt-4 flex items-center justify-between gap-3 rounded-lg border border-[#f1d7d8] bg-[#fffafa] p-3">
      <p className="text-sm font-medium text-[#8f2023]">Đội đang chơi có yêu cầu Revive chờ xác nhận.</p>
      <Button size="sm" onClick={() => setDismissedEffectId(null)}>Xem yêu cầu</Button>
    </section>
  }

  return <Modal
    open
    title="Xác nhận sử dụng Revive"
    onClose={() => setDismissedEffectId(revive.effectId)}
    footer={<Button disabled={confirmMutation.isPending} onClick={confirm}>
      {confirmMutation.isPending ? 'Đang xác nhận...' : 'Xác nhận đội đã dùng thẻ'}
    </Button>}
  >
    <p className="text-sm leading-6 text-[#525252]">
      Đội <strong className="text-[#262626]">{booth.teamName ?? revive.teamId}</strong> đã xác nhận muốn dùng Revive tại booth này.
      Khi bạn xác nhận, card sẽ bị tiêu thụ và đội được chơi lại.
    </p>
    <p className="mt-3 text-xs text-[#8a8a8a]">
      Yêu cầu lúc {new Date(revive.requestedAt).toLocaleString('vi-VN')}.
    </p>
  </Modal>
}
