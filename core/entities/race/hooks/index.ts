import { useNavigate } from 'react-router-dom'

export const useRaceHooks = () => {
    const navigate = useNavigate()

    const onDetailRaceView = (raceId: string) => {
        navigate(`/races/${raceId}`)
    }

    return {
        onDetailRaceView
    }
}