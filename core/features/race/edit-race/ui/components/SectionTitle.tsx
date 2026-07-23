export const SectionTitle = ({ index, title }: { index: number; title: string }) => (
  <h2 className="text-2xl font-black uppercase leading-8 tracking-normal text-[#111111]">
    <span className="text-[#de3336]">({index}) </span>
    {title}
  </h2>
)
