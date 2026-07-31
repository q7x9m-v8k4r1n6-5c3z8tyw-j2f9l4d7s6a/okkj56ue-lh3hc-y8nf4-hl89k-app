import { useAuthSession } from '@/core/features/auth'
import { useTeamQrScanForm } from '../../model/frontend/useTeamQrScanForm'
import { useScanQrMutation } from '../../model/server/useScanQrMutation'
import { mapQrToRequest } from '../../model/mapQrToRequest'
import { validateQrCode } from '../../model/scanQr.validation'

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
  const teamId = authSession?.user?.id

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

    const requestPayload = mapQrToRequest(qrCode, teamId)

    mutation.mutate(requestPayload, {
      onSuccess: (data) => {
        console.log('Quét QR vào trạm thành công:', data)
      },
      onError: (err: unknown) => {
        form.setErrorMessage(getErrorMessage(err) || 'Không thể gửi mã QR. Vui lòng thử lại!')
      },
    })
  }

  return {
    rawQrCode: form.rawQrCode,
    errorMessage: form.errorMessage,
    handleScan,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    responseData: mutation.data,
    form,
  }
}
