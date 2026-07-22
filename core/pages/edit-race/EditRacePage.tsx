import { useParams } from 'react-router-dom'
import { EditRaceView } from '@/core/features/race/edit-race'

export const EditRacePage = () => {
  const { raceId } = useParams()

  return <EditRaceView raceId={raceId} />
}
