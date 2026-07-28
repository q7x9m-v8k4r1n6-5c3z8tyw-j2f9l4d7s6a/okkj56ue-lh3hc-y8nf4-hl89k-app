import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { RaceSummary } from '@/core/entities/race'
import { isOrganizerRaceSelectable } from '@/core/features/organizer/organizer-race'

/** Owns browser-only pagination and navigation for organizer race list. */
export const useOrganizerRaceListState = () => {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  return {
    isRaceSelectable: isOrganizerRaceSelectable,
    openRaceDetail: (race: RaceSummary) => {
      if (!isOrganizerRaceSelectable(race)) return
      navigate(`/organizer/races/${race.id}`)
    },
    page,
    setPage,
  }
}
