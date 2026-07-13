import { PlusIcon } from '@/core/assets'
import { Button } from '@/core/shared'
import { useCreateRaceButton } from '@/core/features/race/create-race/hooks'

export const CreateRaceAction = () => {
    const { onClickCreateRaceButton } = useCreateRaceButton()

    return (
        <section
            className="flex h-[34px] items-center justify-end"
            aria-label="Thao tác trận đấu"
        >
            <Button
                className="h-[34px] min-h-0 px-2.5 py-0 font-normal leading-[14px] tracking-[0.7px]"
                leadingIcon={<PlusIcon className="size-6" />}
                onClick={onClickCreateRaceButton}
            >
                Tạo trận đấu mới
            </Button>
        </section>
    )
}