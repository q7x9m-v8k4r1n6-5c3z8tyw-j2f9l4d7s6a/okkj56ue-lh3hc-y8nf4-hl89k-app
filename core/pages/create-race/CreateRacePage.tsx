import { CreateRaceNavigation } from '@/core/features/race/create-race/ui'
import { BasicInformationStep, BoothInformationStep, OrganizerInformationStep, SettingsStep, TeamInformationStep } from '@/core/features/race/create-race/ui/steps'
import { TableCard, useAppDispatch, useAppSelector } from '@/core/shared'
import { useEffect } from 'react'
import { createRaceActions } from '@/core/features/race/create-race/stores/createRaceSlice'

export const CreateRacePage = () => {
    const dispatch = useAppDispatch()
    const step = useAppSelector((state) => state.createRace.step)
    useEffect(() => {
        dispatch(createRaceActions.resetCreateRace())
    }, [dispatch])

    const steps = [
        <BasicInformationStep />,
        <BoothInformationStep />,
        <TeamInformationStep />,
        <OrganizerInformationStep />,
        <SettingsStep />
    ]

    return <main className="flex h-[calc(100svh-61px)] min-h-[40rem] flex-1 p-5">
        <TableCard className="flex min-h-0 flex-1 rounded-[20px] border-[#dde2e5] px-[43px] shadow-none">
            <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto py-[30px]">{steps[step - 1]}</div>
                <CreateRaceNavigation />
            </div>
        </TableCard>
    </main>
}
