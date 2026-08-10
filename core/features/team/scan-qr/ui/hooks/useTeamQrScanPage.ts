import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'
import { useToast } from '@/core/shared'
import { useTeamQrScanForm } from '../../model/frontend/useTeamQrScanForm'
import { mapQrToRequest } from '../../model/mapQrToRequest'
import { validateQrCode } from '../../model/scanQr.validation'
import { useScanQrMutation } from '../../model/server/useScanQrMutation'
import { useTeamBoothSignalR } from '../../model/server/useTeamBoothSignalR'

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message?: unknown }).message ?? '')
  }

  return ''
}

export const useTeamQrScanPage = () => {
  const form = useTeamQrScanForm()
  const mutation = useScanQrMutation()
  const authSession = useAuthSession()
  const { raceId } = useParams<{ raceId: string }>()
  const { toast } = useToast()
  const teamId = authSession.user?.id

  const resetBoothRequest = useCallback(() => {
    mutation.reset()
    form.setRawQrCode('')
    form.setErrorMessage(null)
  }, [form, mutation])

  const handleEntryRejected = useCallback(() => {
    resetBoothRequest()
    toast({
      title: 'Yêu cầu vào trạm bị từ chối',
      description: 'Quản trạm đã từ chối yêu cầu. Vui lòng chọn trạm khác.',
      variant: 'warning',
    })
  }, [resetBoothRequest, toast])

  const handleSessionCancelled = useCallback(() => {
    resetBoothRequest()
    toast({
      title: 'Lượt chơi đã bị hủy',
      description: 'Quản trạm đã hủy lượt chơi. Vui lòng chọn trạm khác.',
      variant: 'warning',
    })
  }, [resetBoothRequest, toast])

  useTeamBoothSignalR({
    raceId,
    teamId,
    onEntryRejected: handleEntryRejected,
    onSessionCancelled: handleSessionCancelled,
  })

  const handleScan = (qrCode: string) => {
    if (mutation.isPending || mutation.isSuccess) return

    const error = validateQrCode(qrCode)
    if (error) {
      form.setErrorMessage(error)
      return
    }

    if (!teamId) {
      form.setErrorMessage('Không tìm thấy thông tin đội chơi. Vui lòng đăng nhập lại!')
      return
    }

    form.setErrorMessage(null)
    form.setRawQrCode(qrCode)

    mutation.mutate(mapQrToRequest(qrCode, teamId), {
      onError: (requestError: unknown) => {
        form.setErrorMessage(
          getErrorMessage(requestError) || 'Không thể gửi mã QR. Vui lòng thử lại!',
        )
      },
    })
  }

  return {
    errorMessage: form.errorMessage,
    form,
    handleScan,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    rawQrCode: form.rawQrCode,
    responseData: mutation.data,
  }
}
