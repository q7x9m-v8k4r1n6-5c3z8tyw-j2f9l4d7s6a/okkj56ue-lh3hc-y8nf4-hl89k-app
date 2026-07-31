import { ArrowLeftIcon, HistoryIcon, SaveIcon } from '@/core/assets/icons'
import { Skeleton } from '@/core/shared'
import type { LiveRaceSelectedTeam } from '../../model/liveRace.selection'
import { useEditScore } from './hooks/useEditScore'

type EditScoreViewProps = {
  raceId: string
  team: LiveRaceSelectedTeam
  onBack: () => void
}

export const EditScoreView = ({ raceId, team, onBack }: EditScoreViewProps) => {
  const editScore = useEditScore({ raceId, team, onBack })

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_414px]">
      <section className="flex min-h-0 flex-col bg-white">
        <div className="mb-4 flex items-center gap-3 text-base font-bold text-[#1a1c1c]">
          <span className="flex size-5 items-center justify-center rounded-full bg-[#3a3a3a] text-xs text-white">
            i
          </span>
          <h2>Chi tiết đội chơi {team.displayName}</h2>
        </div>

        <div className="mb-2 flex h-12 items-center rounded-[10px] border border-[#e5e5e5] bg-white px-4">
          <button
            type="button"
            className="flex h-full items-center gap-3 pr-6 text-sm text-[#564240] hover:text-[#de3336]"
            onClick={editScore.onBack}
          >
            <ArrowLeftIcon className="size-5" />
            Quay lại
          </button>
          <div className="h-7 w-px bg-[#dcc0bd]" />
          <button
            type="button"
            className="flex h-full items-center gap-3 px-6 text-sm text-[#564240] hover:text-[#de3336] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!editScore.canSave || editScore.isSaving}
            onClick={editScore.save}
          >
            <SaveIcon className="size-5 text-[#e71313]" />
            {editScore.isSaving ? 'Đang lưu' : 'Lưu'}
          </button>
        </div>

        <div className="grid gap-2 lg:grid-cols-[285px_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <div className="flex h-[189px] flex-col items-center justify-center rounded-[10px] bg-[#166534] text-white">
              <span className="text-[18px] font-medium uppercase tracking-[0.34em] text-white/70">
                Số điểm hiện tại
              </span>
              <strong className="mt-5 text-[50px] leading-none">
                {editScore.currentScore}
              </strong>
              <span className="mt-4 text-[16px] text-white/70">
                Hạng # {team.rank}
              </span>
            </div>

            <div className="grid h-[42px] grid-cols-[66px_minmax(0,1fr)_66px] gap-2">
              <button
                type="button"
                className="rounded-[10px] border border-[#a6a6a6] text-2xl text-[#777777] hover:bg-[#fafafa]"
                onClick={editScore.decreaseDelta}
              >
                -
              </button>
              <input
                className="min-w-0 rounded-[10px] border border-[#a6a6a6] text-center text-2xl font-medium text-[#040000] outline-none focus:border-[#de3336]"
                type="number"
                value={editScore.delta}
                onChange={(event) => editScore.setDelta(Number(event.target.value))}
              />
              <button
                type="button"
                className="rounded-[10px] border border-[#a6a6a6] text-2xl text-[#777777] hover:bg-[#fafafa]"
                onClick={editScore.increaseDelta}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex min-h-[251px] flex-col">
            <textarea
              className="h-full min-h-[251px] resize-none rounded-[10px] border border-[#e5e5e5] px-4 py-6 text-base text-[#525252] outline-none placeholder:text-[#8a8f9c] focus:border-[#de3336]"
              placeholder="Nhập lý do sửa điểm"
              value={editScore.reason}
              onChange={(event) => editScore.setReason(event.target.value)}
            />
            {editScore.errorMessage ? (
              <p className="mt-2 text-sm font-medium text-[#de3336]">
                {editScore.errorMessage}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex h-11 items-end gap-6 border-b-2 border-[#eeeeee]">
          <button
            type="button"
            className={`h-full border-b-2 px-0 text-sm ${editScore.activeTab === 'cards' ? 'border-[#de3336] text-[#420001]' : 'border-transparent text-[#1a1c1c]'}`}
            onClick={() => editScore.setActiveTab('cards')}
          >
            Quản lý thẻ
          </button>
          <button
            type="button"
            className={`h-full border-b-2 px-0 text-sm ${editScore.activeTab === 'secret' ? 'border-[#de3336] text-[#420001]' : 'border-transparent text-[#1a1c1c]'}`}
            onClick={() => editScore.setActiveTab('secret')}
          >
            Quản lý nhiệm vụ bí mật
          </button>
        </div>

        <div className="min-h-0 flex-1 bg-white" />
      </section>

      <aside className="flex min-h-0 flex-col rounded-[10px] border border-[#e5e5e5] bg-white">
        <div className="flex h-[76px] items-center gap-3 border-b border-[#f1e7e6] px-5">
          <HistoryIcon className="size-5 text-[#040000]" />
          <h3 className="text-base font-bold text-[#040000]">Nhật Ký Hoạt Động</h3>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {editScore.isLoadingLogs ? (
            <Skeleton lines={7} className="py-6" />
          ) : editScore.activityLogs.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm italic text-gray-400">
              Chưa có hoạt động nào.
            </div>
          ) : (
            editScore.activityLogs.map((log) => (
              <div key={log.id} className="border-b border-[#f1e7e6] px-4 py-7">
                <p className="text-base text-[#5e5e5e]">{log.title}</p>
                <p className="mt-2 text-xs text-[#5e5e5e]">{log.time}</p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}
