import { Switch } from '@/core/shared'
import { CreateRaceStepLayout } from '../../CreateRaceStepLayout/CreateRaceStepLayout'
import { useSettingsStep } from './useSettingsStep'

export const SettingsStep = () => {
    const { settings, setShowLeaderboard, setShowScores } = useSettingsStep()

    return (
        <CreateRaceStepLayout step={5} title="CÀI ĐẶT">
            <div className="overflow-hidden rounded-xl border border-[#e5e5e5] shadow-sm">
                <div className="grid grid-cols-[1fr_2fr_80px] bg-[#fafafa] px-6 py-3 text-xs">
                    <span>Nội dung</span>
                    <span>Chi tiết</span>
                    <span />
                </div>
                <div className="grid h-[72px] grid-cols-[1fr_2fr_80px] items-center px-6 text-sm text-[#525252]">
                    <span>Bật Bảng xếp hạng trên màn hình đội chơi</span>
                    <span>Khi bật lựa chọn này, bảng xếp hạng sẽ được hiển thị trên màn hình của đội chơi.</span>
                    <Switch checked={settings.showLeaderboard} onChange={setShowLeaderboard} />
                </div>
                <div className="grid h-[72px] grid-cols-[1fr_2fr_80px] items-center px-6 text-sm text-[#525252]">
                    <span>Hiện điểm trên Bảng xếp hạng</span>
                    <span>Nếu bảng xếp hạng được bật, khi bật lựa chọn này, điểm của các đội sẽ được hiện thị trên bảng xếp hạng. Ngược lại, điểm sẽ được ẩn.</span>
                    <Switch checked={settings.showScores} onChange={setShowScores} />
                </div>
            </div>
        </CreateRaceStepLayout>
    );
}
