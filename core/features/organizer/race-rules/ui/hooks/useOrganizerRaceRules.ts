import { useParams } from 'react-router-dom'
import { useMyBoothQuery } from '@/core/entities/booth'

/**
 * Exposes the current organizer's assigned booth (rules text + QR payload)
 * by reading raceId from the route itself.
 */
export const useOrganizerRaceRules = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const myBoothQuery = useMyBoothQuery(raceId)

  return {
    isLoading: myBoothQuery.isLoading,
    isError: myBoothQuery.isError,
    boothId: myBoothQuery.data?.boothId,
    boothName: myBoothQuery.data?.name,
    boothPlace: myBoothQuery.data?.place,
    boothDescription: myBoothQuery.data?.description,
  }
}