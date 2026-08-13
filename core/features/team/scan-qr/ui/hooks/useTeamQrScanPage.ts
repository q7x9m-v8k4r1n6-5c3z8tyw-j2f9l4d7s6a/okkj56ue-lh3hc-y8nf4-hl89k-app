import {
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import { useParams } from 'react-router-dom'
import { useTeamBoothSessionQuery } from '@/core/entities/booth'
import { useAuthSession } from '@/core/features/auth'
import { useToast } from '@/core/shared'
import { shouldResetBoothRequest } from '../../model/frontend/teamBoothSessionRecovery'
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
  const { raceId } = useParams<{ raceId: string }>()
  const form = useTeamQrScanForm()
  const mutation = useScanQrMutation(raceId)
  const sessionQuery = useTeamBoothSessionQuery(raceId)
  const authSession = useAuthSession()
  const { toast } = useToast()
  const teamId = authSession.user?.id
  const session = sessionQuery.data ?? null
  const hadActiveSessionRef = useRef(false)

  const resetBoothRequest = useCallback(() => {
    hadActiveSessionRef.current = false
    mutation.reset()
    form.setRawQrCode('')
    form.setErrorMessage(null)
  }, [form, mutation])

  useEffect(() => {
    if (session) {
      hadActiveSessionRef.current = true
      return
    }

    if (shouldResetBoothRequest({
      hadActiveSession: hadActiveSessionRef.current,
      hasSession: Boolean(session),
      isFetched: sessionQuery.isFetched,
      isFetching: sessionQuery.isFetching,
    })) {
      resetBoothRequest()
    }
  }, [
    resetBoothRequest,
    session,
    sessionQuery.isFetched,
    sessionQuery.isFetching,
  ])

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
    activeBoothId: session?.boothId,
    raceId,
    teamId,
    onEntryRejected: handleEntryRejected,
    onSessionCancelled: handleSessionCancelled,
    onSessionReleased: resetBoothRequest,
  })

  const handleScan = (qrCode: string) => {
    if (
      mutation.isPending ||
      mutation.isSuccess ||
      sessionQuery.isLoading ||
      sessionQuery.isError ||
      session
    ) return

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

    mutation.mutate(mapQrToRequest(qrCode), {
      onError: (requestError: unknown) => {
        form.setErrorMessage(
          getErrorMessage(requestError) || 'Không thể gửi mã QR. Vui lòng thử lại!',
        )
      },
    })
  }

  const handleQrCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setRawQrCode(event.target.value)
  }

  const handleQrCodeKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleScan(form.rawQrCode)
  }

  const retrySession = () => {
    void sessionQuery.refetch()
  }

  const statusMessage = session?.status === 'occupied'
    ? `Ban tổ chức đã chấp nhận. Bạn có thể bắt đầu chơi tại ${session.boothName}.`
    : session?.status === 'pending'
      ? `Đã gửi yêu cầu vào ${session.boothName}. Vui lòng chờ Ban tổ chức xác nhận!`
      : mutation.isPending
        ? 'Đang gửi dữ liệu trạm...'
        : mutation.isSuccess
          ? mutation.data?.message ?? 'Đã gửi yêu cầu vào trạm.'
          : ''

  return {
    canScan: Boolean(raceId) &&
      !sessionQuery.isLoading &&
      !sessionQuery.isError &&
      !session &&
      !mutation.isPending &&
      !mutation.isSuccess,
    errorMessage: form.errorMessage,
    handleScan,
    handleQrCodeChange,
    handleQrCodeKeyDown,
    isCheckingSession: sessionQuery.isLoading,
    isSessionError: sessionQuery.isError,
    rawQrCode: form.rawQrCode,
    retrySession,
    session,
    sessionStatus: session?.status ?? null,
    statusMessage,
  }
}
