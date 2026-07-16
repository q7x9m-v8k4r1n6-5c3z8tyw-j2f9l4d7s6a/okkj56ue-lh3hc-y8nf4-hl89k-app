import { useNavigate } from 'react-router-dom'

export * from './useRaceDetailQuery'

export const useRaceHooks = () => {
    const navigate = useNavigate()

    const onDetailRaceView = (raceId: string) => {
        navigate(`/races/${raceId}`)
    }

    return {
        onDetailRaceView
    }
}
