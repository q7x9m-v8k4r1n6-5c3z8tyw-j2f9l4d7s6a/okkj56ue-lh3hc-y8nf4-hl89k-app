import { useState } from 'react'

export const useTeamMap = () => {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)

  return {
    selectedStationId,
    selectStation: (id: string) => setSelectedStationId(id),
    clearSelection: () => setSelectedStationId(null),
  }
}
