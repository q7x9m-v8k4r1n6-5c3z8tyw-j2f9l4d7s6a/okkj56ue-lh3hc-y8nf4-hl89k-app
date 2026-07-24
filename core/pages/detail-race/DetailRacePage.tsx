import { useParams } from 'react-router-dom'
import { DetailRaceView } from './ui'

export const DetailRacePage = () => {
  const { raceId } = useParams()

  return <DetailRaceView raceId={raceId} />
}
