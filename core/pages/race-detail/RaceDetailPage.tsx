import { useEffect } from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, TableCard, useToast } from '@/core/shared'
import { canEditRace } from '@/core/features/race/edit-race'
import { useRaceDetailQuery, type RaceDetailModel } from '@/core/entities/race'

type PageState = {
  toastMessage?: string
}

const formatDateTime = (value?: string) => {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

const firstText = (...values: Array<string | undefined>) => {
  return values.find((value) => value?.trim())?.trim() ?? ''
}

const getRaceName = (race: RaceDetailModel) => firstText(race.raceName, race.name) || 'Giải đấu chưa đặt tên'
const getRacePlace = (race: RaceDetailModel) => firstText(race.place, race.location) || 'Chưa cập nhật'
const getRaceStart = (race: RaceDetailModel) => firstText(race.timeStart, race.startAt)
const getRaceEnd = (race: RaceDetailModel) => firstText(race.timeEnd, race.endAt)
const getRaceBooths = (race: RaceDetailModel) => race.booth ?? race.booths ?? race.stations ?? []
const getRaceTeams = (race: RaceDetailModel) => race.raceTeam ?? race.teams ?? []
const getRaceOrganizers = (race: RaceDetailModel) => race.organizers ?? []

export const RaceDetailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const { raceId = '' } = useParams()
  const raceQuery = useRaceDetailQuery(raceId)
  const race = raceQuery.data

  useEffect(() => {
    const state = location.state as PageState | null
    if (!state?.toastMessage) return

    toast({ title: state.toastMessage, variant: 'success' })
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.pathname, location.state, navigate, toast])

  if (raceQuery.isPending) {
    return (
      <main className="flex h-[calc(100svh-61px)] flex-1 p-5">
        <TableCard className="flex flex-1 items-center justify-center rounded-[20px] border-[#dde2e5] text-sm text-[#737373] shadow-none">
          Đang tải chi tiết giải đấu...
        </TableCard>
      </main>
    )
  }

  if (raceQuery.isError || !race) {
    return (
      <main className="flex h-[calc(100svh-61px)] flex-1 p-5">
        <TableCard className="flex flex-1 flex-col items-center justify-center gap-4 rounded-[20px] border-[#dde2e5] text-center shadow-none">
          <h1 className="text-xl font-semibold text-[#171717]">Không tìm thấy giải đấu</h1>
          <p className="max-w-xl text-sm text-[#737373]">Dữ liệu chi tiết Race không tồn tại hoặc API chưa trả về kết quả hợp lệ.</p>
          <Button variant="secondary" onClick={() => navigate('/')}>Quay lại danh sách</Button>
        </TableCard>
      </main>
    )
  }

  const editable = canEditRace(race)
  const booths = getRaceBooths(race)
  const teams = getRaceTeams(race)
  const organizers = getRaceOrganizers(race)

  return (
    <main className="flex h-[calc(100svh-61px)] min-h-[40rem] flex-1 p-5">
      <TableCard className="min-h-0 flex-1 rounded-[20px] border-[#dde2e5] px-[34px] py-7 shadow-none">
        <div className="flex h-full min-h-0 flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#eeeeee] pb-5">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <Badge variant={editable ? 'warning' : 'neutral'}>{race.status ?? 'upcoming'}</Badge>
              </div>
              <h1 className="text-2xl font-semibold text-[#171717]">{getRaceName(race)}</h1>
              <p className="mt-2 text-sm text-[#666666]">Thông tin chi tiết của Race sau khi tạo hoặc cập nhật.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => navigate('/')}>Danh sách</Button>
              {editable ? <Button onClick={() => navigate(`/races/${raceId}/edit`)}>Chỉnh sửa</Button> : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoBox label="Địa điểm" value={getRacePlace(race)} />
            <InfoBox label="Bắt đầu" value={formatDateTime(getRaceStart(race))} />
            <InfoBox label="Kết thúc" value={formatDateTime(getRaceEnd(race))} />
            <InfoBox label="Số đội" value={String(teams.length)} />
          </div>

          <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto lg:grid-cols-2">
            <DetailSection title="Danh sách trạm">
              {booths.length ? booths.map((booth, index) => (
                <DetailRow
                  key={`${booth.name ?? 'booth'}-${index}`}
                  title={firstText(booth.name) || `Trạm ${index + 1}`}
                  description={firstText(booth.place, booth.location) || 'Chưa cập nhật địa điểm'}
                  meta={firstText(booth.description)}
                />
              )) : <EmptyText>Chưa có trạm nào.</EmptyText>}
            </DetailSection>

            <DetailSection title="Đội chơi">
              {teams.length ? teams.map((team, index) => (
                <DetailRow
                  key={`${team.id ?? team.teamId ?? team.teamID ?? 'team'}-${index}`}
                  title={firstText(team.name, team.email, team.leaderEmail) || `Đội ${index + 1}`}
                  description={firstText(team.email, team.leaderEmail) || 'Chưa cập nhật email'}
                />
              )) : <EmptyText>Chưa có đội chơi nào.</EmptyText>}
            </DetailSection>

            <DetailSection title="Ban tổ chức">
              {organizers.length ? organizers.map((organizer, index) => (
                <DetailRow
                  key={`${organizer.id ?? organizer.organizerId ?? 'organizer'}-${index}`}
                  title={firstText(organizer.displayName, organizer.name, organizer.email) || `BTC ${index + 1}`}
                  description={firstText(organizer.email) || 'Chưa cập nhật email'}
                />
              )) : <EmptyText>Chưa có ban tổ chức nào.</EmptyText>}
            </DetailSection>

            <DetailSection title="Cài đặt">
              <DetailRow title="Bảng xếp hạng" description={race.isToggledLeaderboard ? 'Đang bật' : 'Đang tắt'} />
              <DetailRow title="Hiển thị điểm" description={race.isHiddenPoint ? 'Đang bật' : 'Đang tắt'} />
            </DetailSection>
          </div>
        </div>
      </TableCard>
    </main>
  )
}

const InfoBox = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-[#eeeeee] bg-[#fafafa] p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.15px] text-[#737373]">{label}</p>
    <p className="mt-2 text-sm font-medium text-[#171717]">{value}</p>
  </div>
)

const DetailSection = ({ children, title }: { children: ReactNode; title: string }) => (
  <section className="rounded-lg border border-[#eeeeee]">
    <h2 className="border-b border-[#eeeeee] px-4 py-3 text-sm font-semibold text-[#171717]">{title}</h2>
    <div className="space-y-3 p-4">{children}</div>
  </section>
)

const DetailRow = ({ description, meta, title }: { description: string; meta?: string; title: string }) => (
  <article className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
    <h3 className="text-sm font-medium text-[#171717]">{title}</h3>
    <p className="mt-1 text-sm text-[#666666]">{description}</p>
    {meta ? <p className="mt-1 line-clamp-2 text-xs text-[#737373]">{meta}</p> : null}
  </article>
)

const EmptyText = ({ children }: PropsWithChildren) => (
  <p className="text-sm text-[#737373]">{children}</p>
)
