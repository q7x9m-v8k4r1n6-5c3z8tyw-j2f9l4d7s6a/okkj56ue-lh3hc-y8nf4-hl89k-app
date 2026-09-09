import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useToast } from '@/core/shared'
import { useSecretMissionDetailQuery } from '../../model/server/useSecretMissionDetailQuery'
import { useSubmitMissionEvidenceMutation } from '../../model/server/useSubmitMissionEvidenceMutation'
import { useVerifyMissionCodeMutation, useSubmitTechCacheResultMutation } from '../../model/server/useTechCacheMutations'
import type { TechCacheResultType } from '../../model/techcache.contract'

export type FileSource = 'camera' | 'gallery'

export const useSecretMissionDetailContainer = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { raceId, missionId } = useParams<{ raceId: string; missionId: string }>()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('view')

  const query = useSecretMissionDetailQuery(missionId)
  const submitMutation = useSubmitMissionEvidenceMutation(missionId!)

  // ==================== [Tech Cache State] ====================
  const verifyCodeMutation = useVerifyMissionCodeMutation()
  const submitTechCacheMutation = useSubmitTechCacheResultMutation(missionId!)
  const [techCacheCode, setTechCacheCode] = useState('')
  const [codeErrorMessage, setCodeErrorMessage] = useState('')
  const [techCacheVideo, setTechCacheVideo] = useState<File | null>(null)

  const [tempFile, setTempFile] = useState<{ file: File; source: FileSource } | null>(null)

  useEffect(() => {
    if (!query.data) return
    const isTechCache = !query.data.isAssigned

    if (isTechCache && !techCacheCode && viewMode !== 'techcache-code') {
      navigate('?view=techcache-code', { replace: true })
    }
  }, [query.data, techCacheCode, viewMode, navigate])

  const handleClose = () => navigate(`/team/races/${raceId}/secret-missions`)
  const handleOpenInfo = () => navigate(`?view=info`, { replace: true })

  const handleOpenEvidence = (withEdit?: boolean | unknown) => {
  const isEdit = withEdit === true

  if (query.data && !query.data.isAssigned) {
    const alreadySubmitted =
      (query.data.evidenceVideoUrls?.length ?? 0) > 0 ||
      (query.data.evidenceImageUrls?.length ?? 0) > 0

    if (alreadySubmitted) {
      toast({ title: 'Nhiệm vụ này đã được nộp minh chứng!', variant: 'success' })
      return
    }

    if (techCacheCode) {
      navigate(`?view=techcache-camera`, { replace: true })
      return
    }

    navigate(`?view=techcache-code`, { replace: true })
    return
  }

  navigate(`?view=evidence${isEdit ? '&edit=true' : ''}`, { replace: true })
}

  const handlePreviewFile = (file: File, source: FileSource) => {
    setTempFile({ file, source })
    navigate(`?view=preview`, { replace: true })
  }

  const handleCancelPreview = () => {
    setTempFile(null)
    handleOpenEvidence(true)
  }

  const handleSubmitEvidence = () => {
    if (!tempFile) return
    submitMutation.mutate(tempFile.file, {
      onSuccess: () => {
        setTempFile(null)
        handleOpenEvidence(true)
      },
    })
  }

  const handleVerifyTechCacheCode = (code: string) => {
    if (!missionId) return
    setCodeErrorMessage('')
    verifyCodeMutation.mutate(
      { missionId, code },
      {
        onSuccess: (isValid) => {
          if (!isValid) {
            setCodeErrorMessage('Mã Tech Cache không đúng. Vui lòng thử lại.')
            return
          }
          setTechCacheCode(code)
          navigate(`?view=info`, { replace: true })
        },
        onError: () => setCodeErrorMessage('Không thể xác nhận mã. Vui lòng thử lại.'),
      },
    )
  }

  const handleTechCacheVideoSelected = (video: File) => {
    setTechCacheVideo(video)
    navigate(`?view=techcache-preview`, { replace: true })
  }

  const handleRetakeTechCacheVideo = () => {
    setTechCacheVideo(null)
    navigate(`?view=techcache-camera`, { replace: true })
  }

  const handleSubmitTechCacheResult = (result: TechCacheResultType) => {
    if (!techCacheVideo) return
    submitTechCacheMutation.mutate(
      { code: techCacheCode, result, video: techCacheVideo },
      {
        onSuccess: (response) => {
          setTechCacheVideo(null)
          toast({
            title: response.isMapPieceReward
              ? 'Nhận được mảnh bản đồ!'
              : result === 'success'
                ? `+${response.scoreDelta} điểm`
                : `${response.scoreDelta} điểm`,
            variant: result === 'success' ? 'success' : 'warning',
          })
          navigate(`?view=info`, { replace: true })
        },
        onError: () => {
          toast({ title: 'Không thể gửi kết quả. Vui lòng thử lại.', variant: 'danger' })
        },
      },
    )
  }

  return {
    missionId,
    viewMode,
    missionData: query.data,
    isLoading: query.isLoading,
    tempFile,
    isSubmitting: submitMutation.isPending,
    handleClose,
    handleOpenInfo,
    handleOpenEvidence,
    handlePreviewFile,
    handleCancelPreview,
    handleSubmitEvidence,
    setTempFile,

    // Tech Cache
    codeErrorMessage,
    isVerifyingCode: verifyCodeMutation.isPending,
    handleVerifyTechCacheCode,
    techCacheVideo,
    handleTechCacheVideoSelected,
    handleRetakeTechCacheVideo,
    isSubmittingTechCacheResult: submitTechCacheMutation.isPending,
    handleSubmitTechCacheResult,
  }
}