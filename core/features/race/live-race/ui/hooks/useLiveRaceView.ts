import { useParams } from 'react-router-dom'

export const useLiveRaceView = () => {
  // Đổi { id } thành { raceId } hoặc đúng tên bạn vừa thấy trên Console
  const { raceId } = useParams() 

  return {
    raceId: raceId,
  }
}