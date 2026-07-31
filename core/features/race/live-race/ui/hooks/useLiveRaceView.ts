import { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { LiveRaceSelectedTeam } from '../../model/liveRace.selection'
import { useLiveRaceSignalR } from '../../model/server/useLiveRaceSignalR'

export const useLiveRaceView = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const [editingTeam, setEditingTeam] = useState<LiveRaceSelectedTeam | null>(null)

  useLiveRaceSignalR({ raceId })

  return {
    raceId,
    editingTeam,
    openEditScore: setEditingTeam,
    closeEditScore: () => setEditingTeam(null),
  }
}
