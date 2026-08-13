import { LeaderboardTable } from './components/LeaderboardTable'
import { ScoreHistoryList } from './components/ScoreHistoryList'
import { ScoreSummary } from './components/ScoreSummary'
import { TeamResultsTabs } from './components/TeamResultsTabs'
import { useTeamLeaderboard } from './hooks/useTeamLeaderboard'

export const TeamLeaderboardView = () => {
  const view = useTeamLeaderboard()

  return (
    <section className="mx-auto w-full max-w-md pb-5">
      <TeamResultsTabs
        activeTab={view.activeTab}
        onChange={view.setActiveTab}
      />

      {view.isLeaderboardLoading ? (
        <p className="px-5 py-12 text-center text-sm text-[#737373]">
          Đang tải thông tin điểm...
        </p>
      ) : null}
      {view.isLeaderboardError ? (
        <div className="px-5 py-12 text-center text-sm text-[#737373]">
          <p>Không thể tải thông tin điểm.</p>
          <button
            type="button"
            className="mt-2 font-medium text-[#de3336]"
            onClick={view.retryLeaderboard}
          >
            Thử lại
          </button>
        </div>
      ) : null}

      {!view.isLeaderboardLoading && !view.isLeaderboardError ? (
        <div className="px-[clamp(10px,4vw,20px)] pt-4">
          {view.activeTab === 'score' && view.currentTeam ? (
            <div className="space-y-6">
              <ScoreSummary team={view.currentTeam} />
              <ScoreHistoryList
                hasMore={view.hasMoreHistory}
                isError={view.isHistoryError}
                isLoading={view.isHistoryLoading}
                isLoadingMore={view.isHistoryLoadingMore}
                items={view.historyItems}
                onLoadMore={view.loadMoreHistory}
                onRetry={view.retryHistory}
              />
            </div>
          ) : null}
          {view.activeTab === 'leaderboard' ? (
            <LeaderboardTable
              areOtherTeamPointsHidden={view.areOtherTeamPointsHidden}
              isVisible={view.isLeaderboardVisible}
              teams={view.teams}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
