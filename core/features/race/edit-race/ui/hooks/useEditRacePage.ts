import { useParams } from 'react-router-dom'
import { getEditRaceErrorMessage } from '../../model/frontend/editRace.error'
import { useRaceDetailQuery } from '../../model/server/useRaceDetailQuery'

/**
 * Coordinates route parameters and race detail server state for the page.
 */
export const useEditRacePage = () => {
  const { raceId } = useParams()
  const detailQuery = useRaceDetailQuery(raceId)
  const initialForm = detailQuery.data ?? null

  return {
    detailErrorMessage: detailQuery.error
      ? getEditRaceErrorMessage(
        detailQuery.error,
        'Không thể tải thông tin trận đấu.',
      )
      : '',
    editorKey: initialForm
      ? `${raceId ?? 'unknown'}:${initialForm.modifiedAt}`
      : '',
    initialForm,
    isLoading: detailQuery.isLoading,
    raceId,
  }
}
