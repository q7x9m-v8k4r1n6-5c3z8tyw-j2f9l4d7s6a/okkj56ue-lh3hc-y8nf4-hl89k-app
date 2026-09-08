import { ModalOptionChoice } from '@/core/shared/ui'
import { useSecretMissionDetailContainer } from './hooks/useSecretMissionDetailContainer'
import { SecretMissionInfoView } from './components/SecretMissionInfoView'
import { SecretMissionEvidenceView } from './components/SecretMissionEvidenceView'
import { SecretMissionEvidencePreview } from './components/SecretMissionEvidencePreview'
import { TechCacheCodeEntryView } from './components/TechCacheCodeEntryView'
import { TechCacheResultPreview } from './components/TechCacheResultPreview'

export const SecretMissionDetailContainer = () => {
  const container = useSecretMissionDetailContainer()

  if (!container.missionId) return null

  if (container.isLoading) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
        <div className="rounded-xl bg-white p-5 shadow-lg">
          <p className="text-sm font-medium text-[#5e5e5e]">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  const missionData = container.missionData
  if (!missionData) return null

  if (container.viewMode === 'info') {
    return <SecretMissionInfoView missionData={missionData} onBack={container.handleClose} onViewEvidence={container.handleOpenEvidence} />
  }

  // ==================== [Tech Cache Flow] START ====================
  if (container.viewMode === 'techcache-code') {
    return (
      <TechCacheCodeEntryView
        missionName={missionData.name}
        onBack={container.handleClose}
        onVerify={container.handleVerifyTechCacheCode}
        isVerifying={container.isVerifyingCode}
        errorMessage={container.codeErrorMessage}
      />
    )
  }

  // Tái sử dụng UI của NVBM thay cho màn hình đen
  if (container.viewMode === 'techcache-camera') {
    return (
      <SecretMissionEvidenceView
        missionData={missionData}
        onBack={container.handleOpenInfo}
        onFileSelected={(file) => container.handleTechCacheVideoSelected(file)}
      />
    )
  }

  if (container.viewMode === 'techcache-preview' && container.techCacheVideo) {
    return (
      <TechCacheResultPreview
        video={container.techCacheVideo}
        onRetake={container.handleRetakeTechCacheVideo}
        onSubmitResult={container.handleSubmitTechCacheResult}
        isSubmitting={container.isSubmittingTechCacheResult}
      />
    )
  }
  // ==================== [Tech Cache Flow] END ======================

  if (container.viewMode === 'preview' && container.tempFile) {
    return (
      <SecretMissionEvidencePreview
        missionName={missionNameData(missionData)}
        file={container.tempFile.file}
        source={container.tempFile.source}
        onCancel={container.handleCancelPreview}
        onUpdateFile={(newFile) => container.setTempFile({ file: newFile, source: container.tempFile!.source })}
        onConfirmUpload={container.handleSubmitEvidence}
        isSubmitting={container.isSubmitting}
      />
    )
  }

  if (container.viewMode === 'evidence') {
    return (
      <SecretMissionEvidenceView
        missionData={missionData}
        onBack={container.handleClose}
        onFileSelected={container.handlePreviewFile}
      />
    )
  }

  return (
    <ModalOptionChoice
      open={true}
      title="Vui lòng chọn thao tác"
      onClose={container.handleClose}
      actions={[
        { key: 'info', label: 'Xem thông tin', variant: 'primary', onClick: container.handleOpenInfo },
        { key: 'evidence', label: 'Xem minh chứng', variant: 'primary', onClick: container.handleOpenEvidence },
        { key: 'cancel', label: 'Hủy', variant: 'secondary', onClick: container.handleClose },
      ]}
    />
  )
}

function missionNameData(data: { name: string }) {
  return data.name
}