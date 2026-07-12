import { useEffect, useMemo, useRef, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TrashIcon } from '@/core/assets'
import { useAdminRaceDetail, useCreateRaceMutation, useUpdateRaceMutation } from '@/core/features'
import { MoveButton, MoveIconButton, MovePanel, MoveProgressBar } from '@/core/shared'
import {
  createDefaultRaceDraft,
  type MoveNameMissionRow,
  type MoveRaceStation,
} from '@/core/shared/lib'

type RaceFormPageProps = {
  mode: 'create' | 'edit'
}

type StepKey = 'basic' | 'stations' | 'teams' | 'final'

const STEP_ORDER: StepKey[] = ['basic', 'stations', 'teams', 'final']
const STEP_META: Record<StepKey, { label: string; progress: number; step: number }> = {
  basic: { label: '(1) THÔNG TIN CƠ BẢN', progress: 25, step: 1 },
  stations: { label: '(2) THÔNG TIN TRẠM', progress: 50, step: 2 },
  teams: { label: '(3) THÔNG TIN ĐỘI CHƠI', progress: 75, step: 3 },
  final: { label: '(4) BAN TỔ CHỨC LIÊN QUAN & CÀI ĐẶT', progress: 100, step: 4 },
}

const cloneSimpleRows = (rows: MoveNameMissionRow[]) => rows.map((row) => ({ ...row }))
const cloneStationRows = (rows: MoveRaceStation[]) => rows.map((row) => ({ ...row }))
const managerInitial = (value: string) => value.trim().charAt(0).toUpperCase() || '?'

export const RaceFormPage = ({ mode }: RaceFormPageProps) => {
  const navigate = useNavigate()
  const { raceId = '' } = useParams()
  const defaults = useMemo(() => createDefaultRaceDraft(), [])
  const imageInputRef = useRef<HTMLInputElement>(null)
  const raceQuery = useAdminRaceDetail(raceId, { enabled: mode === 'edit' && Boolean(raceId), refetchInterval: false })
  const createRaceMutation = useCreateRaceMutation()
  const updateRaceMutation = useUpdateRaceMutation(raceId)
  const existingRow = raceQuery.data
  const [currentStep, setCurrentStep] = useState<StepKey>('basic')
  const [name, setName] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [location, setLocation] = useState('')
  const [imageName, setImageName] = useState(defaults.imageName)
  const [stations, setStations] = useState<MoveRaceStation[]>(() => cloneStationRows(defaults.stations))
  const [teams, setTeams] = useState<MoveNameMissionRow[]>(() => cloneSimpleRows(defaults.teams))
  const [organizers, setOrganizers] = useState<MoveNameMissionRow[]>(() => cloneSimpleRows(defaults.organizers))
  const [settingsRows, setSettingsRows] = useState<MoveNameMissionRow[]>(() => cloneSimpleRows(defaults.settingsRows))
  const [stationDraft, setStationDraft] = useState<MoveRaceStation>({ name: '', location: '', manager: '', points: '' })
  const [teamDraft, setTeamDraft] = useState<MoveNameMissionRow>({ name: '', mission: '' })
  const [organizerDraft, setOrganizerDraft] = useState<MoveNameMissionRow>({ name: '', mission: '' })
  const [settingDraft, setSettingDraft] = useState<MoveNameMissionRow>({ name: '', mission: '' })
  const [error, setError] = useState('')
  const isSaving = createRaceMutation.isPending || updateRaceMutation.isPending

  useEffect(() => {
    if (mode !== 'edit' || !existingRow) return

    setName(existingRow.name)
    setStartAt(existingRow.startAt.slice(0, 16))
    setEndAt(existingRow.endAt.slice(0, 16))
    setLocation(existingRow.location)
    setImageName(existingRow.imageName)
    setStations(cloneStationRows(existingRow.stations))
    setTeams(cloneSimpleRows(existingRow.teams))
    setOrganizers(cloneSimpleRows(existingRow.organizers))
    setSettingsRows(cloneSimpleRows(existingRow.settingsRows))
  }, [existingRow, mode])

  if (mode === 'edit' && raceQuery.isLoading) {
    return (
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
        <section className="w-full">
          <MovePanel className="p-6 text-sm text-[#8b8580]">Đang tải dữ liệu trận đấu...</MovePanel>
        </section>
      </main>
    )
  }

  if (mode === 'edit' && !existingRow) {
    return (
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
        <section className="w-full">
          <MovePanel className="p-6">
            <h2 className="text-lg font-semibold text-[#1f1f22]">Không tìm thấy dữ liệu</h2>
            <p className="mt-2 text-sm text-[#8b8580]">
              Trận đấu cần chỉnh sửa không còn tồn tại hoặc đường dẫn không hợp lệ.
            </p>
            <div className="mt-4">
              <MoveButton variant="secondary" onClick={() => navigate('/')}>Quay lại danh sách</MoveButton>
            </div>
          </MovePanel>
        </section>
      </main>
    )
  }

  const meta = STEP_META[currentStep]

  const openStep = (step: StepKey) => setCurrentStep(step)

  const validateBasicStep = () => {
    const startDate = new Date(startAt)
    const endDate = new Date(endAt)

    if (!name.trim() || !startAt.trim() || !endAt.trim() || !location.trim()) {
      setError('Vui lòng nhập đầy đủ tên trận đấu, thời gian và địa điểm.')
      openStep('basic')
      return false
    }

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setError('Vui lòng nhập thời gian bắt đầu và kết thúc hợp lệ.')
      openStep('basic')
      return false
    }

    if (endDate <= startDate) {
      setError('Thời gian kết thúc phải sau thời gian bắt đầu.')
      openStep('basic')
      return false
    }

    return true
  }

  const nextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    if (currentIndex < STEP_ORDER.length - 1) {
      setError('')
      openStep(STEP_ORDER[currentIndex + 1])
    }
  }

  const previousStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    if (currentIndex > 0) {
      setError('')
      openStep(STEP_ORDER[currentIndex - 1])
    }
  }

  const addStation = () => {
    if (!stationDraft.name.trim() || !stationDraft.location.trim() || !stationDraft.manager.trim() || !stationDraft.points.trim()) {
      setError('Vui lòng nhập đủ thông tin trạm trước khi thêm.')
      return
    }

    setStations((current) => [...current, { ...stationDraft }])
    setStationDraft({ name: '', location: '', manager: '', points: '' })
    setError('')
  }

  const addSimpleRow = (
    draft: MoveNameMissionRow,
    setRows: Dispatch<SetStateAction<MoveNameMissionRow[]>>,
    resetDraft: () => void,
    message: string,
  ) => {
    if (!draft.name.trim() || !draft.mission.trim()) {
      setError(message)
      return
    }

    setRows((current) => [...current, { ...draft }])
    resetDraft()
    setError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (currentStep !== 'final') {
      if (currentStep === 'basic' && !validateBasicStep()) return
      nextStep()
      return
    }

    if (!validateBasicStep()) return

    try {
      const payload = {
        name: name.trim(),
        location: location.trim(),
        startAt: startAt.trim(),
        endAt: endAt.trim(),
        imageName,
        stations,
        teams,
        organizers,
        settingsRows,
      }

      if (mode === 'edit') {
        await updateRaceMutation.mutateAsync(payload)
      } else {
        await createRaceMutation.mutateAsync(payload)
      }

      navigate('/', {
        state: {
          toastMessage: mode === 'edit' ? 'Đã cập nhật trận đấu.' : 'Đã tạo trận đấu mới.',
        },
      })
    } catch (submitError) {
      const detail = submitError instanceof Error ? submitError.message : 'Không thể lưu dữ liệu trận đấu trên máy chủ.'
      setError(detail)
    }
  }

  return (
    <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
      <section className="w-full">
        <MovePanel>
          <form className="flex min-h-[40rem] flex-col" onSubmit={handleSubmit}>
            <div className="border-b border-[#f1ebe8] px-5 py-4">
              <div className="flex items-center justify-between gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#ef4444]">
                <span>Step {meta.step} of 4</span>
                <span className="text-[#d65d5d]">{meta.label}</span>
              </div>
              <MoveProgressBar className="mt-3" value={meta.progress} />
            </div>

            <div className="flex-1 px-5 py-5">
              {currentStep === 'basic' ? (
                <div className="space-y-5">
                  <h2 className="text-[1.45rem] font-semibold tracking-tight text-[#1f1f22]"><span className="text-[#ef4444]">(1)</span> THÔNG TIN CƠ BẢN</h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7f7772]">Tên trận đấu (*)</span>
                      <input value={name} onChange={(event) => setName(event.target.value)} type="text" required placeholder="Nhập tên trận đấu" className="w-full rounded-lg border border-[#ebe4e0] bg-white px-4 py-3 text-sm text-[#403c39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7f7772]">Thời gian bắt đầu (*)</span>
                      <input value={startAt} onChange={(event) => setStartAt(event.target.value)} type="datetime-local" required className="w-full rounded-lg border border-[#ebe4e0] bg-white px-4 py-3 text-sm text-[#403c39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7f7772]">Thời gian kết thúc (*)</span>
                      <input value={endAt} onChange={(event) => setEndAt(event.target.value)} type="datetime-local" required className="w-full rounded-lg border border-[#ebe4e0] bg-white px-4 py-3 text-sm text-[#403c39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7f7772]">Ảnh bìa (*)</span>
                      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => setImageName(event.target.files?.[0]?.name ?? '')} />
                      <MoveButton type="button" variant="muted" size="lg" className="w-full justify-start text-[#4b5563]" onClick={() => imageInputRef.current?.click()}>
                        <span>{imageName || 'Upload file ảnh bìa tại đây'}</span>
                      </MoveButton>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7f7772]">Địa điểm (*)</span>
                      <input value={location} onChange={(event) => setLocation(event.target.value)} type="text" required placeholder="Nhập địa điểm trận đấu" className="w-full rounded-lg border border-[#ebe4e0] bg-white px-4 py-3 text-sm text-[#403c39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" />
                    </label>
                  </div>
                </div>
              ) : null}

              {currentStep === 'stations' ? (
                <div className="space-y-5">
                  <h2 className="text-[1.45rem] font-semibold tracking-tight text-[#1f1f22]"><span className="text-[#ef4444]">(2)</span> THÔNG TIN TRẠM</h2>
                  <div className="overflow-hidden rounded-xl border border-[#f0eae7]">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left">
                        <thead className="bg-[#faf8f7] text-[0.68rem] font-semibold tracking-[0.08em] text-[#908883]">
                          <tr>
                            <th className="px-4 py-3">Tên trạm</th>
                            <th className="px-4 py-3">Địa điểm</th>
                            <th className="px-4 py-3">Quản trạm</th>
                            <th className="px-4 py-3">Điểm đạt được</th>
                            <th className="w-12 px-4 py-3" />
                          </tr>
                        </thead>
                        <tbody className="text-sm text-[#47413e]">
                          {stations.map((station, index) => (
                            <tr className="border-t border-[#f3eeeb]" key={`${station.name}-${index}`}>
                              <td className="border-t border-[#f3eeeb] px-4 py-3.5">{station.name}</td>
                              <td className="border-t border-[#f3eeeb] px-4 py-3.5">{station.location}</td>
                              <td className="border-t border-[#f3eeeb] px-4 py-3.5">
                                <div className="flex items-center gap-2">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f1d7c5,#9a6b53)] text-[0.68rem] font-bold text-white">{managerInitial(station.manager)}</span>
                                  <span>{station.manager}</span>
                                </div>
                              </td>
                              <td className="border-t border-[#f3eeeb] px-4 py-3.5">{station.points}</td>
                              <td className="border-t border-[#f3eeeb] px-4 py-3.5 text-right">
                                <MoveIconButton icon={<TrashIcon className="h-4 w-4" />} onClick={() => setStations((current) => current.filter((_, rowIndex) => rowIndex !== index))} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="grid gap-3 border-t border-[#f3eeeb] px-4 py-4 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                      <input value={stationDraft.name} onChange={(event) => setStationDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Nhập tên trạm" className="rounded-lg border border-[#ebe4e0] bg-white px-4 py-3 text-sm text-[#403c39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" />
                      <input value={stationDraft.location} onChange={(event) => setStationDraft((current) => ({ ...current, location: event.target.value }))} placeholder="Nhập địa điểm" className="rounded-lg border border-[#ebe4e0] bg-white px-4 py-3 text-sm text-[#403c39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" />
                      <input value={stationDraft.manager} onChange={(event) => setStationDraft((current) => ({ ...current, manager: event.target.value }))} placeholder="Nhập họ tên" className="rounded-lg border border-[#ebe4e0] bg-white px-4 py-3 text-sm text-[#403c39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" />
                      <input value={stationDraft.points} onChange={(event) => setStationDraft((current) => ({ ...current, points: event.target.value }))} type="number" min="0" step="1" placeholder="Nhập điểm" className="rounded-lg border border-[#ebe4e0] bg-white px-4 py-3 text-sm text-[#403c39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" />
                      <MoveButton type="button" variant="muted" size="lg" onClick={addStation}>Thêm</MoveButton>
                    </div>
                  </div>
                </div>
              ) : null}

              {currentStep === 'teams' ? (
                <SimpleCollectionSection
                  addButtonLabel="Thêm"
                  draft={teamDraft}
                  rows={teams}
                  title="(3) THÔNG TIN ĐỘI CHƠI"
                  firstPlaceholder="Nhập tên đội"
                  secondPlaceholder="Nhập nhiệm vụ bí mật"
                  onAdd={() => addSimpleRow(teamDraft, setTeams, () => setTeamDraft({ name: '', mission: '' }), 'Vui lòng nhập đủ thông tin đội chơi trước khi thêm.')}
                  onChange={setTeamDraft}
                  onDelete={(index) => setTeams((current) => current.filter((_, rowIndex) => rowIndex !== index))}
                />
              ) : null}

              {currentStep === 'final' ? (
                <div className="space-y-5">
                  <h2 className="text-[1.45rem] font-semibold tracking-tight text-[#1f1f22]"><span className="text-[#ef4444]">(4)</span> BAN TỔ CHỨC LIÊN QUAN & CÀI ĐẶT</h2>
                  <div className="space-y-5">
                    <SimpleCollectionSection
                      addButtonLabel="Thêm"
                      draft={organizerDraft}
                      headerLabel="Ban tổ chức liên quan"
                      rows={organizers}
                      title=""
                      firstPlaceholder="Nhập tên ban tổ chức"
                      secondPlaceholder="Nhập vai trò hoặc nhiệm vụ"
                      onAdd={() => addSimpleRow(organizerDraft, setOrganizers, () => setOrganizerDraft({ name: '', mission: '' }), 'Vui lòng nhập đủ thông tin ban tổ chức liên quan trước khi thêm.')}
                      onChange={setOrganizerDraft}
                      onDelete={(index) => setOrganizers((current) => current.filter((_, rowIndex) => rowIndex !== index))}
                    />
                    <SimpleCollectionSection
                      addButtonLabel="Thêm"
                      draft={settingDraft}
                      headerLabel="Cài đặt áp dụng"
                      rows={settingsRows}
                      title=""
                      firstPlaceholder="Nhập tên cài đặt"
                      secondPlaceholder="Nhập nội dung cấu hình"
                      onAdd={() => addSimpleRow(settingDraft, setSettingsRows, () => setSettingDraft({ name: '', mission: '' }), 'Vui lòng nhập đủ thông tin cài đặt trước khi thêm.')}
                      onChange={setSettingDraft}
                      onDelete={(index) => setSettingsRows((current) => current.filter((_, rowIndex) => rowIndex !== index))}
                    />
                  </div>
                </div>
              ) : null}

              {error ? <p className="mt-5 rounded-xl border border-[#f3d7d5] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-[#b43b35]">{error}</p> : null}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#f1ebe8] px-5 py-4">
              <MoveButton type="button" variant="secondary" size="md" disabled={isSaving} onClick={() => navigate('/')}>Hủy</MoveButton>
              {currentStep !== 'basic' ? <MoveButton type="button" variant="secondary" size="md" disabled={isSaving} onClick={previousStep}>Quay lại</MoveButton> : null}
              <MoveButton type="submit" size="md" disabled={isSaving}>{currentStep === 'final' ? (isSaving ? 'Đang lưu...' : 'Lưu') : 'Tiếp tục'}</MoveButton>
            </div>
          </form>
        </MovePanel>
      </section>
    </main>
  )
}

type SimpleCollectionSectionProps = {
  title: string
  headerLabel?: string
  rows: MoveNameMissionRow[]
  draft: MoveNameMissionRow
  firstPlaceholder: string
  secondPlaceholder: string
  addButtonLabel: string
  onChange: (draft: MoveNameMissionRow) => void
  onAdd: () => void
  onDelete: (index: number) => void
}

const SimpleCollectionSection = ({
  addButtonLabel,
  draft,
  firstPlaceholder,
  headerLabel,
  onAdd,
  onChange,
  onDelete,
  rows,
  secondPlaceholder,
  title,
}: SimpleCollectionSectionProps) => (
  <div className="space-y-5">
    {title ? <h2 className="text-[1.45rem] font-semibold tracking-tight text-[#1f1f22]"><span className="text-[#ef4444]">{title.slice(0, 3)}</span> {title.slice(4)}</h2> : null}

    <div className="overflow-hidden rounded-xl border border-[#f0eae7]">
      {headerLabel ? (
        <div className="border-b border-[#f3eeeb] bg-[#faf8f7] px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#908883]">
          {headerLabel}
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#faf8f7] text-[0.68rem] font-semibold tracking-[0.08em] text-[#908883]">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Nội dung</th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="text-sm text-[#47413e]">
            {rows.map((row, index) => (
              <tr className="border-t border-[#f3eeeb]" key={`${row.name}-${index}`}>
                <td className="border-t border-[#f3eeeb] px-4 py-3.5">{row.name}</td>
                <td className="border-t border-[#f3eeeb] px-4 py-3.5">{row.mission}</td>
                <td className="border-t border-[#f3eeeb] px-4 py-3.5 text-right">
                  <MoveIconButton icon={<TrashIcon className="h-4 w-4" />} onClick={() => onDelete(index)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 border-t border-[#f3eeeb] px-4 py-4 md:grid-cols-[1fr_2fr_auto]">
        <input value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} placeholder={firstPlaceholder} className="rounded-lg border border-[#ebe4e0] bg-white px-4 py-3 text-sm text-[#403c39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" />
        <input value={draft.mission} onChange={(event) => onChange({ ...draft, mission: event.target.value })} placeholder={secondPlaceholder} className="rounded-lg border border-[#ebe4e0] bg-white px-4 py-3 text-sm text-[#403c39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" />
        <MoveButton type="button" variant="muted" size="lg" onClick={onAdd}>{addButtonLabel}</MoveButton>
      </div>
    </div>
  </div>
)
