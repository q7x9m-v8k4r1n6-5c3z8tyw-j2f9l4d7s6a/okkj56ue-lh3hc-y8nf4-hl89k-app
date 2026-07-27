import type { TeamSummary } from '@/core/entities/team'
import { useEditRaceForm } from '../../model/frontend/useEditRaceForm'

/**
 * Adapts team search results to the frontend form model.
 */
export const useTeamInformationSection = () => {
  const editor = useEditRaceForm()

  return {
    isEditing: editor.isEditing,
    onAddTeams: (teams: TeamSummary[]) => {
      editor.addTeams(teams.map((team) => ({
        id: team.id,
        name: team.name,
        leaderEmail: team.leaderEmail,
      })))
    },
    teams: editor.form.teams.map((team) => ({
      ...team,
      onRemove: () => editor.removeTeam(team.id),
    })),
  }
}
