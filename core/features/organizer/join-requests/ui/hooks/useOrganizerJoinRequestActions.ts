import { useCallback, useRef } from 'react'
import { useConfirmDialog } from '@/core/shared'
import type { BannerVariant } from '@/core/shared/ui/StatusBanner'
import { createAsyncActionLock } from '../../model/frontend/asyncActionLock'
import { getActionErrorMessage } from '../../model/getActionErrorMessage'
import type { OrganizerJoinRequest } from '../../model/organizerJoinRequest'
import { useAcceptEntryMutation } from '../../model/server/useAcceptEntryMutation'
import { useRejectEntryMutation } from '../../model/server/useRejectEntryMutation'

type UseOrganizerJoinRequestActionsOptions = {
  raceId?: string
  request: OrganizerJoinRequest | null
  setErrorMessage: (message: string) => void
  showStatus: (message: string, variant: BannerVariant) => void
}

export const useOrganizerJoinRequestActions = ({
  raceId,
  request,
  setErrorMessage,
  showStatus,
}: UseOrganizerJoinRequestActionsOptions) => {
  const { confirm } = useConfirmDialog()
  const acceptMutation = useAcceptEntryMutation(raceId)
  const rejectMutation = useRejectEntryMutation(raceId)
  const acceptLock = useRef(createAsyncActionLock())
  const rejectLock = useRef(createAsyncActionLock())

  const acceptRequest = useCallback(async () => {
    if (!request) return

    await acceptLock.current.run(async () => {
      const accepted = await confirm({
        title: 'Xác nhận cho đội vào trạm',
        description: `Bạn có chắc chắn muốn cho đội ${request.teamName} vào trạm này không?`,
      })
      if (!accepted) return

      setErrorMessage('')
      try {
        await acceptMutation.mutateAsync({
          boothId: request.boothId,
          teamId: request.id,
        })
        showStatus(`Đội ${request.teamName} đã vào trạm`, 'success')
      } catch (error) {
        setErrorMessage(getActionErrorMessage(error))
      }
    })
  }, [acceptMutation, confirm, request, setErrorMessage, showStatus])

  const rejectRequest = useCallback(async () => {
    if (!request) return

    await rejectLock.current.run(async () => {
      const rejected = await confirm({
        title: 'Xác nhận hủy yêu cầu',
        description: `Bạn có chắc chắn muốn từ chối yêu cầu của đội ${request.teamName} không?`,
      })
      if (!rejected) return

      setErrorMessage('')
      try {
        await rejectMutation.mutateAsync({
          boothId: request.boothId,
          teamId: request.id,
        })
        showStatus(`Đã từ chối yêu cầu của đội ${request.teamName}`, 'neutral')
      } catch (error) {
        setErrorMessage(getActionErrorMessage(error))
      }
    })
  }, [confirm, rejectMutation, request, setErrorMessage, showStatus])

  return {
    acceptRequest,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
    rejectRequest,
  }
}
