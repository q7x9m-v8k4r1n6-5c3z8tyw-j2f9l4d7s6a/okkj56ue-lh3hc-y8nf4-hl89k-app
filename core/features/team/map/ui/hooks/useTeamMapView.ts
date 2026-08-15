import { useParams } from 'react-router-dom'
import { useTeamMapQuery } from '../../model/server/useTeamMapQuery'
import { useTeamMap } from '../../model/frontend/useTeamMap'

export const useTeamMapView = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const query = useTeamMapQuery(raceId)
  const selection = useTeamMap()

  const selectedStation =
    query.stations.find((s) => s.id === selection.selectedStationId) ?? null

  return {
    raceId,
    mapImageUrl: query.mapImageUrl,
    stations: query.stations,
    placedStations: query.stations,
    selectedStation,
    selectedStationId: selection.selectedStationId,
    selectStation: selection.selectStation,
    clearSelection: selection.clearSelection,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  }
}
