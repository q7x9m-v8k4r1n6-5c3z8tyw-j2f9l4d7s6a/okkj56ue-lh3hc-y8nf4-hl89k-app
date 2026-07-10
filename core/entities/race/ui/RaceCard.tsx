import type { Race } from '@/core/entities/race/model'

type RaceCardProps = {
  race: Race
}

export const RaceCard = ({ race }: RaceCardProps) => {
  return (
    <article className="rounded-lg border border-slate-200 p-4">
      <h2 className="font-medium text-slate-950">{race.name}</h2>
    </article>
  )
}
