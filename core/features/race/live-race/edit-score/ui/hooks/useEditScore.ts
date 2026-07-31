import { useMemo } from 'react'
import type { LiveRaceSelectedTeam } from '../../../model/liveRace.selection'
import { useScoringLogQuery } from '../../../model/server/useLiveQueries'
import { useEditScoreState } from '../../model/frontend/useEditScoreState'
import { useUpdateTeamScoreMutation } from '../../model/server/useUpdateTeamScoreMutation'

type UseEditScoreOptions = {
  raceId?: string
  team: LiveRaceSelectedTeam
  onBack: () => void
}

export const useEditScore = ({ raceId, team, onBack }: UseEditScoreOptions) => {
  const mutation = useUpdateTeamScoreMutation(raceId)
  const logsQuery = useScoringLogQuery(raceId, 1, 50)
  const currentScore = mutation.data?.scoreAfter ?? team.totalScore
  const state = useEditScoreState(currentScore)

  const teamLogs = useMemo(
    () => (logsQuery.data?.items ?? []).filter((log) => log.teamName === team.displayName),
    [logsQuery.data?.items, team.displayName],
  )
  const activityLogs = useMemo(
    () => teamLogs.map((log) => ({
      id: log.logId,
      title: log.boothName
        ? `${log.teamName} hoàn thành ${log.boothName} (${log.scoreDelta > 0 ? '+' : ''}${log.scoreDelta} điểm).`
        : `${log.teamName} ${log.reason.trim() || log.eventName} (${log.scoreDelta > 0 ? '+' : ''}${log.scoreDelta} điểm).`,
      time: new Date(log.createdAt).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    })),
    [teamLogs],
  )

  const scoreBefore = currentScore
  const scoreAfter = state.scoreAfter

  const save = () => {
    if (!state.canSave || mutation.isPending) return

    mutation.mutate(
      {
        teamId: team.teamId,
        payload: {
          delta: state.delta,
          reason: state.reason,
        },
      },
      {
        onSuccess: () => {
          state.reset()
        },
      },
    )
  }

  return {
    ...state,
    currentScore,
    scoreBefore,
    scoreAfter,
    teamLogs,
    activityLogs,
    isSaving: mutation.isPending,
    isLoadingLogs: logsQuery.isLoading,
    errorMessage: mutation.error instanceof Error ? mutation.error.message : '',
    save,
    onBack,
  }
}
