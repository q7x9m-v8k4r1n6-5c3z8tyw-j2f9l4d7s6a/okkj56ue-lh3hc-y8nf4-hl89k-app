import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRaceDetailQuery } from '@/core/entities/race'
import { canEditRace, mapRaceDetailToDraft } from '@/core/features/race/edit-race'
import { createRaceActions } from '@/core/features/race/create-race/stores/createRaceSlice'
import { Button, TableCard, useAppDispatch } from '@/core/shared'
import { CreateRacePage } from '../create-race'

export const EditRacePage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { raceId = '' } = useParams()
  const loadedRaceIdRef = useRef('')
  const raceQuery = useRaceDetailQuery(raceId)
  const race = raceQuery.data

  useEffect(() => {
    if (!race || !canEditRace(race) || loadedRaceIdRef.current === raceId) return

    dispatch(createRaceActions.loadRaceDraft(mapRaceDetailToDraft(race)))
    loadedRaceIdRef.current = raceId
  }, [dispatch, race, raceId])

  if (raceQuery.isPending) {
    return (
      <main className="flex h-[calc(100svh-61px)] flex-1 p-5">
        <TableCard className="flex flex-1 items-center justify-center rounded-[20px] border-[#dde2e5] text-sm text-[#737373] shadow-none">
          Đang tải thông tin giải đấu...
        </TableCard>
      </main>
    )
  }

  if (raceQuery.isError || !race) {
    return (
      <main className="flex h-[calc(100svh-61px)] flex-1 p-5">
        <TableCard className="flex flex-1 flex-col items-center justify-center gap-4 rounded-[20px] border-[#dde2e5] text-center shadow-none">
          <h1 className="text-xl font-semibold text-[#171717]">Không thể tải thông tin giải đấu</h1>
          <p className="max-w-xl text-sm text-[#737373]">Vui lòng kiểm tra lại đường dẫn hoặc thử tải lại danh sách Race.</p>
          <Button variant="secondary" onClick={() => navigate('/')}>Quay lại danh sách</Button>
        </TableCard>
      </main>
    )
  }

  if (!canEditRace(race)) {
    return (
      <main className="flex h-[calc(100svh-61px)] flex-1 p-5">
        <TableCard className="flex flex-1 flex-col items-center justify-center gap-4 rounded-[20px] border-[#dde2e5] text-center shadow-none">
          <h1 className="text-xl font-semibold text-[#171717]">Không thể chỉnh sửa giải đấu này</h1>
          <p className="max-w-xl text-sm text-[#737373]">Chỉ các Race ở trạng thái Upcoming, chưa bắt đầu, mới được phép chỉnh sửa.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="secondary" onClick={() => navigate(-1)}>Quay lại</Button>
            <Button onClick={() => navigate(`/races/${raceId}`)}>Xem chi tiết</Button>
          </div>
        </TableCard>
      </main>
    )
  }

  return <CreateRacePage mode="edit" raceId={raceId} resetOnMount={false} />
}
