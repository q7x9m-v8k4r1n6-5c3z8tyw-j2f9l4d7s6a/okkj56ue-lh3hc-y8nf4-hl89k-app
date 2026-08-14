import { ModalOptionChoice } from '@/core/shared/ui'
import { useSecretMissionDetailContainer } from './hooks/useSecretMissionDetailContainer'
import { SecretMissionInfoView } from './components/SecretMissionInfoView'
import { SecretMissionEvidenceView } from './components/SecretMissionEvidenceView'
import { SecretMissionEvidencePreview } from './components/SecretMissionEvidencePreview' // Thêm dòng này

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

  if (container.viewMode === 'preview' && container.tempFile) {
    return (
      <SecretMissionEvidencePreview
        missionName={missionData.name}
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