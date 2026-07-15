import { Button } from '@/core/shared'
import { useCreateRaceNavigation } from './useCreateRaceNavigation'

export const CreateRaceNavigation = () => {
    const { cancel, continueToNextStep, goBack, isSubmitting, step, submit } = useCreateRaceNavigation()

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
                onClick={() => step === 5 ? void submit() : continueToNextStep()}>{step === 5 ? 'Tạo trận đấu' : 'Tiếp tục'}
            </Button>
        </div>
    );
}
