import { useNavigate, useParams } from 'react-router-dom'
import { CardMembershipIcon, QuestionBubbleIcon } from '@/core/assets'

export const TeamRaceMoreMenu = () => {
  const navigate = useNavigate()
  const { raceId } = useParams<{ raceId: string }>()

  const handleNavigateToCards = () => {
    navigate(`/team/races/${raceId}/cards`)
  }

  const handleNavigateToSecretMissions = () => {
    navigate(`/team/races/${raceId}/secret-missions`)
  }

  return (
    <section className="flex flex-1 flex-col justify-center gap-4 px-5 py-8">
      {/* Nút Thẻ chức năng */}
      <button
        type="button"
        onClick={handleNavigateToCards}
        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-10 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
      >
        <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <CardMembershipIcon className="size-6" />
        </div>
        <span className="text-base font-medium text-gray-700">Thẻ chức năng</span>
      </button>

      <button
        type="button"
        onClick={handleNavigateToSecretMissions}
        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-9 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
      >
        <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <QuestionBubbleIcon className="size-6" />
        </div>
        <span className="text-base font-medium text-gray-700">Nhiệm vụ bí mật và Tech Cache</span>
      </button>
    </section>
  )
}