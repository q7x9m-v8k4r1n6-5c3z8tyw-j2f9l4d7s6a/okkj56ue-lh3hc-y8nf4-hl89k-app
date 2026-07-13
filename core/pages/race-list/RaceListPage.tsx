import { CreateRaceAction } from '@/core/features/race/create-race/ui'
import { RaceCollection } from '@/core/features/race/list-race/ui';

export const RaceListPage = () => {
  return (
    <main className="flex h-[calc(100svh-61px)] min-h-[36rem] flex-1 flex-col px-5 py-6">
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <CreateRaceAction />
        <RaceCollection />
      </div>
    </main>
  )
}
