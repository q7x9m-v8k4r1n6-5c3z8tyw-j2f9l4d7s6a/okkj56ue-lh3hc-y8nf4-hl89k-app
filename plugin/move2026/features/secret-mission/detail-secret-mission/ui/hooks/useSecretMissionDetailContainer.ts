import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useSecretMissionDetailQuery } from '../../model/server/useSecretMissionDetailQuery'
import { useSubmitMissionEvidenceMutation } from '../../model/server/useSubmitMissionEvidenceMutation'

export type FileSource = 'camera' | 'gallery'

export const useSecretMissionDetailContainer = () => {
  const navigate = useNavigate()
  const { raceId, missionId } = useParams<{ raceId: string; missionId: string }>()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('view') 

  const query = useSecretMissionDetailQuery(missionId)
  const submitMutation = useSubmitMissionEvidenceMutation(missionId!)

  const [tempFile, setTempFile] = useState<{ file: File; source: FileSource } | null>(null)

  const handleClose = () => navigate(`/team/races/${raceId}/secret-missions`)
  const handleOpenInfo = () => navigate(`?view=info`, { replace: true })
  
  // ====================================================================
  // 🎯 FIX TẠI ĐÂY: Kiểm tra type an toàn (Safe Type Checking)
  // Chỉ bật editMode khi withEdit chính xác là giá trị boolean 'true'
  // Bỏ qua nếu withEdit là Event Object từ cú click chuột.
  // ====================================================================
  const handleOpenEvidence = (withEdit?: boolean | unknown) => {
    const isEdit = withEdit === true 
    navigate(`?view=evidence${isEdit ? '&edit=true' : ''}`, { replace: true })
  }

  const handlePreviewFile = (file: File, source: FileSource) => {
    setTempFile({ file, source })
    navigate(`?view=preview`, { replace: true })
  }

  const handleCancelPreview = () => {
    setTempFile(null)
    handleOpenEvidence(true) // Truyền explicitly boolean 'true'
  }

  const handleSubmitEvidence = () => {
    if (!tempFile) return
    submitMutation.mutate(tempFile.file, {
      onSuccess: () => {
        setTempFile(null)
        handleOpenEvidence(true) // Truyền explicitly boolean 'true'
      }
    })
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
  }
}