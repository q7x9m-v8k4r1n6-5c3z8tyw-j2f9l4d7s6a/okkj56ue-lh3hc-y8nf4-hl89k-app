import type { PropsWithChildren, RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrganizerSearchBox } from '@/core/entities/organizer'
import { TeamSearchBox } from '@/core/entities/team'
import { ArrowLeftIcon, PlusIcon, TrashGlyph, userProfileAvatarUrl } from '@/core/assets'
import {
  Button,
  Input,
  Switch,
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Tabs,
} from '@/core/shared'
import { EDIT_RACE_TABS } from '../constants'
import { useEditRace } from '../hooks'
import type { EditRaceBooth, EditRaceOrganizer, EditRaceTeam } from '../models'

type EditRaceViewProps = {
  raceId?: string
}

const SectionTitle = ({ index, title }: { index: number; title: string }) => (
  <h2 className="text-2xl font-black uppercase leading-8 tracking-normal text-[#111111]">
    <span className="text-[#de3336]">({index}) </span>{title}
  </h2>
)

const SectionCard = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => (
  <TableCard className={`rounded-lg border-[#e5e5e5] px-5 py-6 shadow-none md:px-6 ${className}`}>
    {children}
  </TableCard>
)

const AvatarName = ({ name }: { name: string }) => (
  <span className="flex min-w-0 items-center gap-3">
    <img src={userProfileAvatarUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" />
    <span className="truncate">{name}</span>
  </span>
)

const UploadIcon = () => (
  <span className="inline-flex size-5 items-center justify-center rounded border border-[#737373] text-sm font-semibold leading-none">+</span>
)

const BasicInformationSection = ({
  coverFileName,
  imageInputRef,
  onImageSelected,
  openImagePicker,
  place,
  raceName,
  timeEnd,
  timeStart,
  updateBasic,
}: {
  coverFileName: string
  imageInputRef: RefObject<HTMLInputElement | null>
  onImageSelected: (file?: File) => void
  openImagePicker: () => void
  place: string
  raceName: string
  timeEnd: string
  timeStart: string
  updateBasic: (changes: Partial<{ raceName: string; timeStart: string; timeEnd: string; coverFileName: string; place: string }>) => void
}) => (
  <SectionCard>
    <SectionTitle index={1} title="Thông tin cơ bản" />
    <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-4 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <Input label="Tên trận đấu" requiredMark value={raceName} onChange={(event) => updateBasic({ raceName: event.target.value })} />
      </div>
      <Input type="date" label="Thời gian bắt đầu" requiredMark value={timeStart} onChange={(event) => updateBasic({ timeStart: event.target.value })} />
      <Input type="date" label="Thời gian kết thúc" requiredMark value={timeEnd} onChange={(event) => updateBasic({ timeEnd: event.target.value })} />
      <div>
        <span className="mb-2 block text-xs font-semibold uppercase leading-[14px] tracking-[0.15px] text-[#1a1c1c]">
          Ảnh bìa <span className="text-[#de3336]">(*)</span>
        </span>
        <input
          ref={imageInputRef}
          className="sr-only"
          type="file"
          accept="image/*"
          onChange={(event) => onImageSelected(event.target.files?.[0])}
        />
        <button
          type="button"
          className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#e2e2e2] bg-white px-4 text-left text-sm text-[#737373] transition hover:border-[#de3336] focus:outline-none focus:ring-2 focus:ring-[#de3336]/10"
          onClick={openImagePicker}
        >
          <UploadIcon />
          <span className="min-w-0 truncate">{coverFileName || 'Upload file ảnh bìa tại đây'}</span>
        </button>
      </div>
      <Input label="Địa điểm" requiredMark value={place} onChange={(event) => updateBasic({ place: event.target.value })} />
    </div>
  </SectionCard>
)

const BoothInformationSection = ({
  addBooth,
  booths,
  removeBooth,
  updateBooth,
}: {
  addBooth: () => void
  booths: EditRaceBooth[]
  removeBooth: (id: string) => void
  updateBooth: (id: string, changes: Partial<EditRaceBooth>) => void
}) => (
  <SectionCard>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <SectionTitle index={2} title="Thông tin trạm" />
      <Button variant="secondary" leadingIcon={<PlusIcon className="size-4" />} onClick={addBooth}>Thêm trạm</Button>
    </div>
    <div className="mt-5 overflow-hidden rounded-lg border border-[#eeeeee]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Tên trạm</TableHeaderCell>
            <TableHeaderCell>Địa điểm</TableHeaderCell>
            <TableHeaderCell>Quản trạm</TableHeaderCell>
            <TableHeaderCell>Mô tả trạm</TableHeaderCell>
            <TableHeaderCell className="w-12" />
          </TableRow>
        </TableHead>
        <TableBody>
          {booths.map((booth) => (
            <TableRow key={booth.id} className="border-[#f5f5f5]">
              <TableCell>
                <Input aria-label="Tên trạm" value={booth.name} onChange={(event) => updateBooth(booth.id, { name: event.target.value })} />
              </TableCell>
              <TableCell>
                <Input aria-label="Địa điểm trạm" value={booth.place} onChange={(event) => updateBooth(booth.id, { place: event.target.value })} />
              </TableCell>
              <TableCell className="min-w-[230px]">
                <OrganizerSearchBox
                  value={booth.managerId ? [{ id: booth.managerId, displayName: booth.managerName || booth.managerId, email: `${booth.managerId}@move.local` }] : []}
                  onChange={(organizers) => {
                    const organizer = organizers.at(-1)
                    updateBooth(booth.id, {
                      managerId: organizer?.id ?? '',
                      managerName: organizer?.displayName ?? organizer?.email ?? '',
                    })
                  }}
                />
              </TableCell>
              <TableCell className="min-w-[260px]">
                <Input aria-label="Mô tả trạm" value={booth.description} onChange={(event) => updateBooth(booth.id, { description: event.target.value })} />
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  className="rounded-md p-2 text-[#737373] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                  aria-label="Xóa trạm"
                  onClick={() => removeBooth(booth.id)}
                >
                  <TrashGlyph />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </SectionCard>
)

const TeamInformationSection = ({
  addTeam,
  removeTeam,
  teams,
}: {
  addTeam: (teams: Array<{ id: string; name: string; leaderEmail: string }>) => void
  removeTeam: (id: string) => void
  teams: EditRaceTeam[]
}) => (
  <SectionCard>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <SectionTitle index={3} title="Thông tin đội chơi" />
      <div className="w-full lg:w-[360px]">
        <TeamSearchBox placeholder="Thêm đội chơi" onChange={addTeam} />
      </div>
    </div>
    <div className="mt-9 overflow-hidden rounded-lg border border-[#eeeeee]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Email đội trưởng</TableHeaderCell>
            <TableHeaderCell>Tên đội chơi</TableHeaderCell>
            <TableHeaderCell className="w-12" />
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id} className="border-[#f5f5f5]">
              <TableCell>{team.leaderEmail}</TableCell>
              <TableCell>{team.name}</TableCell>
              <TableCell>
                <button
                  type="button"
                  className="rounded-md p-2 text-[#737373] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                  aria-label="Xóa đội chơi"
                  onClick={() => removeTeam(team.id)}
                >
                  <TrashGlyph />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </SectionCard>
)

const OrganizerInformationSection = ({
  addOrganizer,
  organizers,
  removeOrganizer,
}: {
  addOrganizer: (organizers: Array<{ id: string; displayName?: string; email: string }>) => void
  organizers: EditRaceOrganizer[]
  removeOrganizer: (id: string) => void
}) => (
  <SectionCard>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <SectionTitle index={4} title="Ban tổ chức liên quan" />
      <div className="w-full lg:w-[360px]">
        <OrganizerSearchBox placeholder="Thêm ban tổ chức" onChange={addOrganizer} />
      </div>
    </div>
    <div className="mt-9 overflow-hidden rounded-lg border border-[#eeeeee]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Họ và tên</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell className="w-12" />
          </TableRow>
        </TableHead>
        <TableBody>
          {organizers.map((organizer) => (
            <TableRow key={organizer.id} className="border-[#f5f5f5]">
              <TableCell><AvatarName name={organizer.displayName} /></TableCell>
              <TableCell>{organizer.email}</TableCell>
              <TableCell>
                <button
                  type="button"
                  className="rounded-md p-2 text-[#737373] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                  aria-label="Xóa ban tổ chức"
                  onClick={() => removeOrganizer(organizer.id)}
                >
                  <TrashGlyph />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </SectionCard>
)

const SettingsSection = ({
  isHiddenPoint,
  isToggledLeaderboard,
  updateSetting,
}: {
  isHiddenPoint: boolean
  isToggledLeaderboard: boolean
  updateSetting: (key: 'isToggledLeaderboard' | 'isHiddenPoint', value: boolean) => void
}) => (
  <SectionCard>
    <SectionTitle index={5} title="Cài đặt" />
    <div className="mt-7 overflow-hidden rounded-lg border border-[#eeeeee]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Nội dung</TableHeaderCell>
            <TableHeaderCell>Chi tiết</TableHeaderCell>
            <TableHeaderCell className="w-20" />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow className="border-[#f5f5f5]">
            <TableCell>Tắt BXH đối với đội chơi</TableCell>
            <TableCell>Ẩn bảng xếp hạng khỏi màn hình đội chơi trong thời gian trận đấu diễn ra.</TableCell>
            <TableCell><Switch checked={isToggledLeaderboard} onChange={(checked) => updateSetting('isToggledLeaderboard', checked)} /></TableCell>
          </TableRow>
          <TableRow className="border-[#f5f5f5]">
            <TableCell>Ẩn điểm trên BXH</TableCell>
            <TableCell>Ẩn điểm chi tiết nhưng vẫn giữ thông tin xếp hạng cần thiết.</TableCell>
            <TableCell><Switch checked={isHiddenPoint} onChange={(checked) => updateSetting('isHiddenPoint', checked)} /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </SectionCard>
)

const PlaceholderTab = ({ label }: { label: string }) => (
  <SectionCard>
    <p className="text-sm text-[#737373]">{label} sẽ được cấu hình ở bước tiếp theo.</p>
  </SectionCard>
)

export const EditRaceView = ({ raceId }: EditRaceViewProps) => {
  const navigate = useNavigate()
  const {
    activeTab,
    addBooth,
    addOrganizer,
    addTeam,
    detailQuery,
    form,
    handleImageSelected,
    imageInputRef,
    isSaving,
    openImagePicker,
    removeBooth,
    removeOrganizer,
    removeTeam,
    saveError,
    saveRace,
    setActiveTab,
    updateBasic,
    updateBooth,
    updateSetting,
  } = useEditRace(raceId)

  return (
    <main className="flex min-h-[calc(100svh-61px)] flex-1 flex-col bg-white px-5 py-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <Tabs items={EDIT_RACE_TABS} value={activeTab} onChange={setActiveTab} />
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" leadingIcon={<ArrowLeftIcon className="size-4" />} onClick={() => navigate('/')}>Quay lại</Button>
            <Button onClick={saveRace} disabled={!raceId || isSaving}>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
          </div>
        </div>

        <TableCard className="rounded-lg border-[#e5e5e5] px-4 py-3 text-sm font-semibold italic text-[#111111] shadow-none">
          {detailQuery.isError ? 'Không tải được dữ liệu từ máy chủ, đang hiển thị bản nháp để chỉnh giao diện.' : 'Đây là thanh ribbon, rule hiện follow phía trên'}
        </TableCard>

        {saveError ? (
          <div className="rounded-lg border border-[#fdcacb] bg-[#fff5f5] px-4 py-3 text-sm text-[#c82528]">
            {saveError instanceof Error ? saveError.message : 'Không thể lưu thay đổi.'}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto pb-8">
          {activeTab === 'basic' ? (
            <div className="space-y-5">
              <BasicInformationSection
                coverFileName={form.coverFileName}
                imageInputRef={imageInputRef}
                onImageSelected={handleImageSelected}
                openImagePicker={openImagePicker}
                place={form.place}
                raceName={form.raceName}
                timeEnd={form.timeEnd}
                timeStart={form.timeStart}
                updateBasic={updateBasic}
              />
              <BoothInformationSection
                addBooth={addBooth}
                booths={form.booths}
                removeBooth={removeBooth}
                updateBooth={updateBooth}
              />
              <TeamInformationSection addTeam={addTeam} removeTeam={removeTeam} teams={form.teams} />
              <OrganizerInformationSection addOrganizer={addOrganizer} organizers={form.organizers} removeOrganizer={removeOrganizer} />
              <SettingsSection
                isHiddenPoint={form.settings.isHiddenPoint}
                isToggledLeaderboard={form.settings.isToggledLeaderboard}
                updateSetting={updateSetting}
              />
            </div>
          ) : (
            <PlaceholderTab label={EDIT_RACE_TABS.find((tab) => tab.value === activeTab)?.label ?? 'Nội dung'} />
          )}
        </div>
      </div>
    </main>
  )
}
