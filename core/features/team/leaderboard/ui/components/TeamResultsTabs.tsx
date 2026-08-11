import type { TeamResultsTab } from '../../model/frontend/useTeamResultsTab'

type TeamResultsTabsProps = {
  activeTab: TeamResultsTab
  onChange: (tab: TeamResultsTab) => void
}

const tabs: ReadonlyArray<{ id: TeamResultsTab; label: string }> = [
  { id: 'score', label: 'Thông tin điểm số' },
  { id: 'leaderboard', label: 'Bảng xếp hạng' },
]

export const TeamResultsTabs = ({
  activeTab,
  onChange,
}: TeamResultsTabsProps) => (
  <div
    className="grid h-11 grid-cols-2 border-b border-[#e7e7e7] bg-white"
    role="tablist"
    aria-label="Kết quả trận đấu"
  >
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab
      return (
        <button
          key={tab.id}
          type="button"
          className={`relative px-2 text-[13px] transition-colors ${
            isActive ? 'font-medium text-[#7f2729]' : 'text-[#424242]'
          }`}
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {isActive ? (
            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#de3336]" />
          ) : null}
        </button>
      )
    })}
  </div>
)
