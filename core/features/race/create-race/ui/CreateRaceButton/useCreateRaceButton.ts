import { useNavigate } from 'react-router-dom'

/** Exposes the named navigation action used by the create-race button. */
export const useCreateRaceButton = () => {
    const navigate = useNavigate()

    const onClickCreateRaceButton = () => {
        navigate('/races/new')
    }

    return {
        onClickCreateRaceButton
    }
}
