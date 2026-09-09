import { useCallback, useState } from 'react'
 
export const useTeamMap = () => {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)

  const selectStation = useCallback((id: string) => setSelectedStationId(id), [])
  const clearSelection = useCallback(() => setSelectedStationId(null), [])

  return {
    selectedStationId,
    selectStation,
    clearSelection,
  }
}
