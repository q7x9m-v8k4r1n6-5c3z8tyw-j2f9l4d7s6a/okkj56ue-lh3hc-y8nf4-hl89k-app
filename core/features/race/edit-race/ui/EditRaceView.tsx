import { EditRaceFormProvider } from '../model/frontend/EditRaceFormProvider'
import { EditRaceEditor } from './EditRaceEditor'
import { useEditRacePage } from './hooks/useEditRacePage'

/**
 * Handles the page-level loading and error boundary for the isolated editor.
 */
export const EditRaceView = () => {
  const page = useEditRacePage()

  if (page.detailErrorMessage) {
    return (
      <div className="rounded-lg border border-[#fdcacb] bg-[#fff5f5] px-4 py-3 text-sm text-[#c82528]">
        {page.detailErrorMessage}
      </div>
    )
  }

  if (page.isLoading || !page.initialForm) {
    return (
      <div className="rounded-lg border border-[#e5e5e5] px-4 py-8 text-center text-sm text-[#667085]">
        Đang tải thông tin trận đấu...
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <EditRaceFormProvider
        key={page.editorKey}
        initialForm={page.initialForm}
      >
        <EditRaceEditor raceId={page.raceId} />
      </EditRaceFormProvider>
    </div>
  )
}
