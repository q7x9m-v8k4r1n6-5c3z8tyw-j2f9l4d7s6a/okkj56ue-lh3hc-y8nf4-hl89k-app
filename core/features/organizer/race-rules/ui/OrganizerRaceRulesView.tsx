import DOMPurify from 'dompurify'
import { QRCodeSVG } from 'qrcode.react'
import { useOrganizerRaceRules } from './hooks/useOrganizerRaceRules'

export const OrganizerRaceRulesView = () => {
  const rules = useOrganizerRaceRules()

  if (rules.isLoading) {
    return (
      <section
        className="flex min-h-[calc(100svh-137px)] items-center justify-center px-5 py-6 text-sm text-[#737373]"
        aria-label="Luật trận đấu"
      >
        Đang tải thông tin trạm...
      </section>
    )
  }

  if (rules.isError || !rules.boothId) {
    return (
      <section
        className="flex min-h-[calc(100svh-137px)] items-center justify-center px-5 py-6 text-center text-sm text-[#737373]"
        aria-label="Luật trận đấu"
      >
        Bạn chưa được gán vào trạm nào trong trận đấu này.
      </section>
    )
  }

  const sanitizedDescription = rules.boothDescription
    ? DOMPurify.sanitize(rules.boothDescription)
    : ''

  return (
    <section
      className="flex min-h-[calc(100svh-137px)] flex-col items-center px-5 py-8"
      aria-label="Luật trận đấu"
    >
      <h2 className="text-[18px] font-semibold text-[#111]">{rules.boothName}</h2>
      {rules.boothPlace && (
        <p className="mt-1 text-sm text-[#8a8a8a]">{rules.boothPlace}</p>
      )}

      <div className="mt-6 rounded-lg border border-[#e5e5e5] p-4">
        <QRCodeSVG value={rules.boothId} size={200} />
      </div>

      {sanitizedDescription && (
        <div
          className="prose prose-sm mt-6 max-w-none text-center text-[#525252]"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      )}
    </section>
  )
}