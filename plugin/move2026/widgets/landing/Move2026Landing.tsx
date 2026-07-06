import { move2026LandingContent } from '../../features/showcase-move'

export const Move2026Landing = () => {
  return (
    <section className="p-6">
      <h2 className="text-xl font-semibold text-slate-950">{move2026LandingContent.title}</h2>
      <p className="mt-2 text-slate-600">{move2026LandingContent.description}</p>
    </section>
  )
}
