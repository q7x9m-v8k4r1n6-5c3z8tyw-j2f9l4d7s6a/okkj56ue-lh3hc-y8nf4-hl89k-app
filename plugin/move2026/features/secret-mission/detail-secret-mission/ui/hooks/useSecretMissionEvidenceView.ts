import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom' // THÊM IMPORT NÀY
import type { SecretMissionDetailDto } from '../../model/detailSecretMission.contract'
import { useDeleteMissionEvidenceMutation } from '../../model/server/useDeleteMissionEvidenceMutation'

export const useSecretMissionEvidenceView = (missionData: SecretMissionDetailDto) => {
  const [searchParams] = useSearchParams()
  const initialEditMode = searchParams.get('edit') === 'true'
  const [isEditMode, setIsEditMode] = useState(initialEditMode)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [evidenceToDelete, setEvidenceToDelete] = useState<string | null>(null)
  const [viewingMedia, setViewingMedia] = useState<{ url: string; isVideo: boolean } | null>(null)
  const deleteMutation = useDeleteMissionEvidenceMutation(missionData.id)

  const mergedEvidences = useMemo(() => {
    const images = (missionData.evidenceImageUrls || []).map((e) => ({ ...e, isVideo: false }))
    const videos = (missionData.evidenceVideoUrls || []).map((e) => ({ ...e, isVideo: true }))
    
    return [...images, ...videos].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }, [missionData.evidenceImageUrls, missionData.evidenceVideoUrls])

  const hasAnyEvidence = mergedEvidences.length > 0

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev)
  }

  const confirmDelete = () => {
    if (!evidenceToDelete) return
    deleteMutation.mutate(evidenceToDelete, {
      onSuccess: () => setEvidenceToDelete(null)
    })
  }

  return {
    mergedEvidences,
    hasAnyEvidence,
    isEditMode,
    isAddModalOpen,
    evidenceToDelete,
    isDeleting: deleteMutation.isPending,
    viewingMedia,
    openMediaViewer: (url: string, isVideo: boolean) => setViewingMedia({ url, isVideo }),
    closeMediaViewer: () => setViewingMedia(null),
    toggleEditMode,
    openAddModal: () => setIsAddModalOpen(true),
    closeAddModal: () => setIsAddModalOpen(false),
    requestDelete: (id: string) => setEvidenceToDelete(id),
    cancelDelete: () => setEvidenceToDelete(null),
    confirmDelete,
  }
}