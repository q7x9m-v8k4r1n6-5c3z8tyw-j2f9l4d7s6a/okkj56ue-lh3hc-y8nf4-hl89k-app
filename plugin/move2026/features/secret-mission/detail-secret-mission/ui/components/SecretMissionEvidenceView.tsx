import { useRef } from 'react' 
import { Modal, ModalOptionChoice } from '@/core/shared/ui'
import type { SecretMissionDetailDto } from '../../model/detailSecretMission.contract'
import { useSecretMissionEvidenceView } from '../hooks/useSecretMissionEvidenceView'
import { AddEvidenceCard } from './AddEvidenceCard'
import { EvidenceCard } from './EvidenceCard'
import type { FileSource } from '../hooks/useSecretMissionDetailContainer' 
import { MediaViewerModal } from './MediaViewerModal'
import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout' 
import { formatSecretMissionName } from '../../../shared/formatSecretMissionName'

export type SecretMissionEvidenceViewProps = {
  missionData: SecretMissionDetailDto
  onBack: () => void
  onFileSelected: (file: File, source: FileSource) => void 
}

export const SecretMissionEvidenceView = ({
  missionData,
  onBack,
  onFileSelected,
}: SecretMissionEvidenceViewProps) => {
  const view = useSecretMissionEvidenceView(missionData)
  
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (source: FileSource) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      view.closeAddModal()
      onFileSelected(file, source)
    }
    e.target.value = '' 
  }

  return (
    <MobileScreenLayout
      title={`Minh chứng ${formatSecretMissionName(missionData.name, missionData.isAssigned)}`}
      onBack={onBack}
      contentClassName="px-5 py-4"
      footer={
        view.hasAnyEvidence ? (
          <button 
            type="button" 
            onClick={view.toggleEditMode} 
            className="flex w-full items-center justify-center rounded-full bg-[#de3336] py-3 text-base font-semibold text-white transition-all active:scale-95"
          >
            {view.isEditMode ? 'Lưu' : 'Chỉnh sửa minh chứng'}
          </button>
        ) : undefined
      }
    >
      <div className="grid grid-cols-3 gap-3">
        {view.mergedEvidences.map((evidence) => (
          <EvidenceCard 
            key={evidence.id} 
            id={evidence.id} 
            url={evidence.url} 
            createdAt={evidence.createdAt} 
            isVideo={evidence.isVideo} 
            isEditMode={view.isEditMode} 
            onDeleteClick={view.requestDelete}
            onViewClick={() => view.openMediaViewer(evidence.url, evidence.isVideo)} 
          />
        ))}
        {!view.hasAnyEvidence || view.isEditMode ? (
          <AddEvidenceCard onClick={view.openAddModal} />
        ) : null}
      </div>

      <input type="file" accept="image/*,video/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange('camera')} className="hidden" />
      <input type="file" accept="image/*,video/*" ref={galleryInputRef} onChange={handleFileChange('gallery')} className="hidden" />

      <ModalOptionChoice
        open={view.isAddModalOpen}
        title="Chọn chế độ thực hiện nhiệm vụ"
        onClose={view.closeAddModal}
        actions={[
          {
            key: 'camera',
            label: 'Chụp ảnh / Quay Video',
            variant: 'primary',
            onClick: () => cameraInputRef.current?.click(), 
          },
          {
            key: 'gallery',
            label: 'Chọn từ thư viện',
            variant: 'primary',
            onClick: () => galleryInputRef.current?.click(), 
          },
          { key: 'cancel', label: 'Hủy', variant: 'secondary', onClick: view.closeAddModal },
        ]}
      />

      <Modal open={Boolean(view.evidenceToDelete)} title="Xác nhận xóa?" onClose={view.cancelDelete} footer={ <><button type="button" className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200" onClick={view.cancelDelete} disabled={view.isDeleting}>Hủy</button><button type="button" className="rounded-lg bg-[#de3336] px-4 py-2 font-medium text-white hover:bg-[#c82d2f]" onClick={view.confirmDelete} disabled={view.isDeleting}>{view.isDeleting ? 'Đang xóa...' : 'Xác nhận'}</button></> }>
        <p className="text-[#525252]">File sau khi xóa sẽ không thể phục hồi! Bạn có chắc chắn muốn xóa file này ?</p>
      </Modal>

      {view.viewingMedia ? (
        <MediaViewerModal
          url={view.viewingMedia.url}
          isVideo={view.viewingMedia.isVideo}
          onClose={view.closeMediaViewer}
        />
      ) : null}

    </MobileScreenLayout>
  )
}