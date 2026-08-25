import type { SecretMissionDetailDto } from '../../model/detailSecretMission.contract'
import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout'
import { formatSecretMissionName } from '@plugin/move2026/features/secret-mission/shared/formatSecretMissionName'

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
    <MobileScreenLayout
      title={`Thông tin ${formatSecretMissionName(missionData.name, missionData.isAssigned)}`}
      onBack={onBack}
      contentClassName="px-5 pt-3"
      footer={
        <button
          type="button"
          onClick={onViewEvidence}
          className="flex w-full items-center justify-center rounded-full bg-[#de3336] py-3 text-base font-semibold text-white transition-all active:scale-95"
        >
          Xem minh chứng
        </button>
      }
    >
      {renderSimpleMarkdown(missionData.description)}
    </MobileScreenLayout>
  )
}