import { TeamSearchBox } from '@/core/entities/team'
import { useTeamInformationStep } from '../../../hooks'
import { CreateRaceStepLayout } from '../../CreateRaceStepLayout/CreateRaceStepLayout'
import { TrashGlyph } from '@/core/assets/icons'

export const TeamInformationStep = () => {
    const { addTeam, removeTeam, rows } = useTeamInformationStep()

    return (
        <CreateRaceStepLayout step={3} title="THÔNG TIN ĐỘI CHƠI" action={
            <div className="w-[402px] max-w-[45%]">
                <TeamSearchBox placeholder="Nhập tên đội" onChange={addTeam} />
            </div>
        }>
            <div className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <div className="w-max min-w-full">
                        <div className="grid min-w-[640px] grid-cols-[minmax(260px,1fr)_minmax(220px,1fr)_44px] gap-6 bg-[#fafafa] px-6 py-3 text-xs">
                            <span>Email đội trưởng</span>
                            <span>Tên đội chơi</span>
                            <span />
                        </div>
                        {rows.length === 0 ? (
                            <div className="px-6 py-8 text-sm text-[#737373]">
                                Hiện chưa có đội được chọn
                            </div>
                        ) : rows.map(row =>
                            <div key={row.id} className="grid h-[72px] min-w-[640px] grid-cols-[minmax(260px,1fr)_minmax(220px,1fr)_44px] items-center gap-6 border-b border-[#f2f2f2] px-6 text-sm text-[#525252] last:border-b-0">
                                <span className="whitespace-nowrap">{row.email}</span>
                                <span className="whitespace-nowrap">{row.name}</span>
                                <button
                                    type="button"
                                    className="rounded-md p-2 text-[#525252] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                                    aria-label="Xóa đội chơi"
                                    onClick={() => removeTeam(row.id)}
                                >
                                    <TrashGlyph />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CreateRaceStepLayout>
    );
}
