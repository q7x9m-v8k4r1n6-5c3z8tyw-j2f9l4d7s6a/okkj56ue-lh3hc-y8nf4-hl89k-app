import DOMPurify from 'dompurify'
import { useTeamRaceRules } from './hooks/useTeamRaceRules'

export const TeamRaceRulesView = () => {
  const { isLoading, isError, rules } = useTeamRaceRules()

  if (isLoading) {
    return (
      <section
        className="flex min-h-[calc(100svh-137px)] items-center justify-center px-5 py-6 text-sm text-[#737373]"
        aria-label="Luật trận đấu"
      >
        Đang tải luật trận đấu...
      </section>
    )
  }

  if (isError) {
    return (
      <section
        className="flex min-h-[calc(100svh-137px)] items-center justify-center px-5 py-6 text-center text-sm text-[#737373]"
        aria-label="Luật trận đấu"
      >
        Không thể tải luật trận đấu. Vui lòng thử lại.
      </section>
    )
  }

  if (!rules) {
    return (
      <section
        className="flex min-h-[calc(100svh-137px)] items-center justify-center px-5 py-6 text-center text-sm text-[#737373]"
        aria-label="Luật trận đấu"
      >
        Trận đấu này chưa có luật được công bố.
      </section>
    )
  }

  const sanitizedRules = DOMPurify.sanitize(rules)

  return (
    <section className="min-h-[calc(100svh-137px)] px-5 py-6" aria-label="Luật trận đấu">
      <div
        className="prose prose-sm max-w-none text-[#525252]"
        dangerouslySetInnerHTML={{ __html: sanitizedRules }}
      />
    </section>
  )
}