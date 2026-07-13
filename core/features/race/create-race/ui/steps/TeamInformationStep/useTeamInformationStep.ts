import { useAppDispatch, useAppSelector } from '@/core/shared'
import { createRaceActions } from '../../../stores/createRaceSlice'
import type { TeamModel } from '@/core/entities/team'

export const useTeamInformationStep = () => {
  const dispatch = useAppDispatch()
  const rows = useAppSelector((state) => state.createRace.teams)

  const addTeam = (teams: TeamModel[]) => {
    const team = teams[0]
    if (!team || rows.some((row) => row.id === team.id || row.email === team.leaderEmail)) return

    dispatch(createRaceActions.addTeam({
      id: team.id,
      name: team.name,
      email: team.leaderEmail,
    }))
  }

  const removeTeam = (id: string) => {
    dispatch(createRaceActions.removeTeam(id))
  }

  return {
    addTeam,
    removeTeam,
    rows,
  }
}
