import type { TeamSummary } from '@/core/entities/team'
import { useCreateRaceForm } from '../../../model/frontend/useCreateRaceForm'

/** Adapts selected teams for the team step. */
export const useTeamInformationStep = () => {
  const { dispatch, form } = useCreateRaceForm()
  const rows = form.teams
  const error = form.errors.team

  const addTeam = (teams: TeamSummary[]) => {
    const team = teams[0]
    if (!team || rows.some((row) => (
      row.id === team.id || row.leaderEmail === team.leaderEmail
    ))) return

    dispatch({ type: 'teams/add', team })
  }

  const removeTeam = (id: string) => {
    dispatch({ type: 'teams/remove', id })
  }

  return {
    addTeam,
    error,
    removeTeam,
    rows,
  }
}
