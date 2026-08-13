import { ReturnHeader } from '../../../../../shared/ui/ReturnHeader'
import type { SecretMissionDetailDto } from '../../model/detailSecretMission.contract'

export type SecretMissionInfoViewProps = {
  missionData: SecretMissionDetailDto
  onBack: () => void
  onViewEvidence: () => void
}

export const SecretMissionInfoView = ({
  missionData,
  onBack,
  onViewEvidence,
}: SecretMissionInfoViewProps) => {
  
  const renderSimpleMarkdown = (text: string) => {
    return (
      <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#333333]">
        {text.split('**').map((chunk, index) =>
          index % 2 === 1 ? <strong key={index} className="font-bold text-[#111111]">{chunk}</strong> : chunk
        )}
      </div>
    )
  }

  return (
    // Dùng flex flex-1 để ôm sát không gian bên trong TeamLayout
    <div className="flex flex-1 flex-col bg-white relative">
      
      {/* HEADER: Sticky dính chặt lên trần của vùng cuộn */}
      <header className="sticky top-0 z-10 bg-white">
        <ReturnHeader
          title={`Thông tin nhiệm vụ ${missionData.name}`}
          onBack={onBack}
        />
      </header>

      {/* CONTENT: Khoảng đệm cho văn bản */}
      <div className="flex-1 px-5 py-6">
        {renderSimpleMarkdown(missionData.description)}
      </div>

      {/* FOOTER: Sticky dính chặt xuống đáy của vùng cuộn */}
      <footer className="sticky bottom-0 z-10 bg-transparent px-3 pb-8">
        <button
          type="button"
          onClick={onViewEvidence}
          className="flex w-full items-center justify-center rounded-full bg-[#de3336] py-2.5 text-base font-semibold text-white transition-all active:scale-95"
        >
          Xem minh chứng
        </button>
      </footer>
      
    </div>
  )
}