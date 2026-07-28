import { Switch } from '@/core/shared'
import { SectionCard } from './SectionCard'
import { SectionTitle } from './SectionTitle'
import { useSettingsSection } from '../hooks/useSettingsSection'

export const SettingsSection = () => {
  const section = useSettingsSection()

  return (
    <SectionCard>
      <SectionTitle index={5} title="Cài đặt" />
      <div className="mt-7 overflow-hidden rounded-xl border border-[#e5e5e5] shadow-sm">
        <div className="grid grid-cols-[1fr_2fr_80px] bg-[#fafafa] px-6 py-3 text-xs text-[#525252]">
          <span>Nội dung</span>
          <span>Chi tiết</span>
          <span />
        </div>
        <div className="grid min-h-[72px] grid-cols-[1fr_2fr_80px] items-center border-t border-[#f5f5f5] px-6 text-sm text-[#525252]">
          <span>Bật Bảng xếp hạng trên màn hình đội chơi</span>
          <span>Khi bật lựa chọn này, bảng xếp hạng sẽ được hiển thị trên màn hình của đội chơi.</span>
          <Switch
            checked={section.showLeaderboard}
            disabled={!section.isEditing}
            onChange={section.onLeaderboardChange}
          />
        </div>
        <div className="grid min-h-[72px] grid-cols-[1fr_2fr_80px] items-center border-t border-[#f5f5f5] px-6 text-sm text-[#525252]">
          <span>Hiện điểm trên Bảng xếp hạng</span>
          <span>Nếu bảng xếp hạng được bật, khi bật lựa chọn này, điểm của các đội sẽ được hiện thị trên bảng xếp hạng. Ngược lại, điểm sẽ được ẩn.</span>
          <Switch
            checked={section.showScores}
            disabled={!section.isEditing}
            onChange={section.onScoresChange}
          />
        </div>
      </div>
    </SectionCard>
  )
}
