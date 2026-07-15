import { useNavigate } from 'react-router-dom'

export const useCreateRaceButton = () => {
    const navigate = useNavigate()

    const onClickCreateRaceButton = () => {
        navigate('/races/new')
    }

    return {
        onClickCreateRaceButton
    }
}