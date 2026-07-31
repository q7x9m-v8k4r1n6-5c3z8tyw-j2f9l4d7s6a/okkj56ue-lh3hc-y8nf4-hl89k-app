import { useParams } from 'react-router-dom'

export const useLiveRaceView = () => {
  const { raceId } = useParams() 

  return {
    raceId: raceId,
  }
}