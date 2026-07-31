import { useBoothListQuery } from '../../model/server/useLiveQueries'

export const useBoothListSection = (raceId?: string) => {
  const query = useBoothListQuery(raceId)

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError, 
  }
}