import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { RaceSummary } from '@/core/entities/race'
import { isTeamRaceSelectable } from '@/core/features/team/team-race'

/** Owns browser-only pagination and navigation for team race list. */
export const useTeamRaceListState = () => {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  return {
    isRaceSelectable: isTeamRaceSelectable,
    openRaceDetail: (race: RaceSummary) => {
      if (!isTeamRaceSelectable(race)) return
      navigate(`/team/races/${race.id}`)
    },
    page,
    setPage,
  }
}
