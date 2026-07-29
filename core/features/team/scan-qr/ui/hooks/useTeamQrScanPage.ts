import { useTeamQrScanForm } from '../../model/frontend/useTeamQrScanForm'
import { useScanQrMutation } from '../../model/server/useScanQrMutation'
import { mapQrToRequest } from '../../model/mapQrToRequest'
import { validateQrCode } from '../../model/scanQr.validation'

export const useTeamQrScanPage = () => {
  const form = useTeamQrScanForm()
  const mutation = useScanQrMutation()

  const handleScan = (qrCode: string) => {
    const error = validateQrCode(qrCode)
    if (error) {
      form.setErrorMessage(error)
      return
    }

    form.setErrorMessage(null)
    form.setRawQrCode(qrCode)

    const requestPayload = mapQrToRequest(qrCode)
    mutation.mutate(requestPayload, {
      onSuccess: (data) => {
        console.log('⚡ Quét QR thành công:', data)
      },
      onError: () => {
        form.setErrorMessage('Không thể gửi mã QR. Vui lòng thử lại!')
      },
    })
  }

  return {
    rawQrCode: form.rawQrCode,
    errorMessage: form.errorMessage,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    responseData: mutation.data,
    handleScan,
  }
}