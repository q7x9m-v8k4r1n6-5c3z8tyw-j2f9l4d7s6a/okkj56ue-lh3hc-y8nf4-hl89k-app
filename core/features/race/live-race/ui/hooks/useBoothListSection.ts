import { useState } from 'react'
import { useBoothListQuery } from '../../model/server/useLiveQueries'
import type { BoothListItem } from '../../model/liveRace.schemas'

export const useBoothListSection = (raceId?: string) => {
  const query = useBoothListQuery(raceId)
  
  const [selectedBooth, setSelectedBooth] = useState<BoothListItem | null>(null)

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    
    selectedBooth,
    openBoothDetail: (booth: BoothListItem) => setSelectedBooth(booth),
    closeBoothDetail: () => setSelectedBooth(null),
  }
}