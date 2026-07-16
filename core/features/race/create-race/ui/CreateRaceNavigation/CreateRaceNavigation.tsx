import { Button } from '@/core/shared'
import { useCreateRaceNavigation, type RaceFormMode } from './useCreateRaceNavigation'

type CreateRaceNavigationProps = {
    mode?: RaceFormMode
    raceId?: string
}

export const CreateRaceNavigation = ({ mode = 'create', raceId }: CreateRaceNavigationProps) => {
    const { cancel, continueToNextStep, goBack, isSubmitting, step, submit } = useCreateRaceNavigation({ mode, raceId })
    const submitLabel = mode === 'edit' ? 'Lưu' : 'Tạo trận đấu'

    return (
        <div className="flex min-h-[85px] items-center justify-end gap-4 border-t border-[#e5e5e5]">
            <Button variant="secondary" className="min-w-24" onClick={cancel}>Hủy</Button>
            {step > 1 ?
                <Button variant="secondary" className="min-w-[130px]"
                    onClick={goBack}>
                    Quay lại
                </Button> : null}
            <Button className="min-w-32"
                disabled={isSubmitting}
                onClick={() => step === 5 ? void submit() : continueToNextStep()}>{step === 5 ? submitLabel : 'Tiếp tục'}
            </Button>
        </div>
    );
}
