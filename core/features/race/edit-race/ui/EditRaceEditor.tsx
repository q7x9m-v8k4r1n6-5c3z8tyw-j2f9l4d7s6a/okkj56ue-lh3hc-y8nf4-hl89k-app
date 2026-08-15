import { BasicInformationSection } from './components/BasicInformationSection'
import { BoothInformationSection } from './components/BoothInformationSection'
import { OrganizerInformationSection } from './components/OrganizerInformationSection'
import { RaceDetailRibbon } from './components/RaceDetailRibbon'
import { SettingsSection } from './components/SettingsSection'
import { TeamInformationSection } from './components/TeamInformationSection'
import { useEditRaceEditor } from './hooks/useEditRaceEditor'
import { Modal, Button } from '@/core/shared'

type EditRaceEditorProps = {
  raceId?: string
}

/**
 * Renders the editor from its view-model. Business and state logic live in
 * useEditRaceEditor and section-specific hooks.
 */
export const EditRaceEditor = ({ raceId }: EditRaceEditorProps) => {
  const editor = useEditRaceEditor(raceId)

  return (
    <>
      {editor.errorMessage ? (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-[#fdcacb] bg-[#fff5f5] px-4 py-3 text-sm text-[#c82528]">
          <span>{editor.errorMessage}</span>
          {editor.isConflict ? (
            <button
              type="button"
              className="shrink-0 font-semibold underline"
              onClick={editor.reloadLatestVersion}
            >
              Tải dữ liệu mới nhất
            </button>
          ) : null}
        </div>
      ) : null}

      <RaceDetailRibbon {...editor.ribbon} />
      <BasicInformationSection />
      <BoothInformationSection />
      <TeamInformationSection />
      <OrganizerInformationSection />
      <SettingsSection />

      <Modal
        open={editor.isStartModalOpen}
        onClose={editor.closeStartModal}
        title="Bắt đầu trận đấu"
        footer={
          <>
            <Button variant="secondary" onClick={editor.closeStartModal}>
              Hủy
            </Button>
            <Button onClick={editor.confirmStart}>
              Xác nhận Bắt đầu
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-[#525252]">
          Lưu ý quan trọng: Sau khi bắt đầu, sơ đồ bản đồ và vị trí các trạm sẽ bị <strong>KHÓA CỐ ĐỊNH</strong> và không thể thay đổi hay tải ảnh mới lên. Bạn có chắc chắn muốn bắt đầu ngay bây giờ?
        </p>
      </Modal>
    </>
  )
}
