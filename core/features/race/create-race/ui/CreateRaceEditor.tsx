import { TableCard } from '@/core/shared'
import { CreateRaceNavigation } from './CreateRaceNavigation/CreateRaceNavigation'
import { useCreateRaceEditor } from './hooks/useCreateRaceEditor'

/** Renders the multi-step create-race editor using hook-provided state. */
export const CreateRaceEditor = () => {
  const { currentStep } = useCreateRaceEditor()

  return (
    <main className="flex h-[calc(100svh-61px)] min-h-[40rem] min-w-0 flex-1 p-5">
      <TableCard className="flex min-h-0 min-w-0 flex-1 rounded-[20px] border-[#dde2e5] px-4 shadow-none md:px-[43px]">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="min-w-0 flex-1 overflow-y-auto py-[30px]">
            {currentStep}
          </div>
          <CreateRaceNavigation />
        </div>
      </TableCard>
    </main>
  )
}
