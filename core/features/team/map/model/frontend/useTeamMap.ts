import { useState } from 'react'

/**
 * Frontend presentation state hook managing station selection on the map.
 * Supports toggle selection (re-clicking selected pin deselects it) and click-away dismissal.
 */
export const useTeamMap = () => {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)

  return {
    selectedStationId,
    selectStation: (id: string) =>
      setSelectedStationId((prev) => (prev === id ? null : id)),
    clearSelection: () => setSelectedStationId(null),
  }
}
