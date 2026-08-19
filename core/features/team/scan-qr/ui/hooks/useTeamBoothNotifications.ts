import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useTeamBoothSessionQuery } from '@/core/entities/booth'
import { useAuthSession } from '@/core/features/auth'
import { useToast } from '@/core/shared'
import { useTeamBoothSignalR } from '../../model/server/useTeamBoothSignalR'

const formatScore = (score: number) => score > 0 ? `+${score}` : String(score)

/** Keeps booth notifications active while the team navigates between race tabs. */
export const useTeamBoothNotifications = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const { user } = useAuthSession()
  const { toast } = useToast()
  const sessionQuery = useTeamBoothSessionQuery(raceId)
  const session = sessionQuery.data ?? null

  const notifyAccepted = useCallback(() => {
    toast({
      title: 'Yêu cầu đã được chấp nhận',
      description: session?.boothName
        ? `Bạn có thể bắt đầu chơi tại ${session.boothName}.`
        : 'Bạn có thể bắt đầu chơi tại trạm.',
      variant: 'success',
    })
  }, [session, toast])

  const notifyCompleted = useCallback((
    _boothId: string,
    boothName: string,
    score: number,
  ) => {
    toast({
      title: 'Hoàn thành trạm',
      description: `Bạn đã hoàn thành ${boothName} và nhận ${formatScore(score)} điểm.`,
      variant: 'success',
    })
  }, [toast])

  const notifyRejected = useCallback(() => {
    toast({
      title: 'Yêu cầu vào trạm bị từ chối',
      description: 'Quản trạm đã từ chối yêu cầu. Vui lòng chọn trạm khác.',
      variant: 'warning',
    })
  }, [toast])

  const notifyCancelled = useCallback(() => {
    toast({
      title: 'Lượt chơi đã bị hủy',
      description: 'Quản trạm đã hủy lượt chơi. Vui lòng chọn trạm khác.',
      variant: 'warning',
    })
  }, [toast])

  useTeamBoothSignalR({
    activeBoothId: session?.boothId,
    raceId,
    teamId: user?.id,
    onBoothCompleted: notifyCompleted,
    onEntryRejected: notifyRejected,
    onSessionAccepted: notifyAccepted,
    onSessionCancelled: notifyCancelled,
  })
}
