import { OrganizerSearchBox } from '@/core/entities/organizer'
import { TrashGlyph } from '@/core/assets'
import {
  Button,
  Drawer,
  IconButton,
  Input,
  RichTextEditor,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/core/shared'
import { AvatarName } from './AvatarName'
import { SectionCard } from './SectionCard'
import { SectionTitle } from './SectionTitle'
import { useBoothInformationSection } from '../hooks/useBoothInformationSection'

export const BoothInformationSection = () => {
  const section = useBoothInformationSection()

  return (
    <SectionCard>
      <SectionTitle index={2} title="Thông tin trạm" />

      <div className="mt-5 overflow-hidden rounded-lg border border-[#eeeeee]">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Tên trạm</TableHeaderCell>
              <TableHeaderCell>Địa điểm</TableHeaderCell>
              <TableHeaderCell>Quản trạm</TableHeaderCell>
              <TableHeaderCell>Mô tả trạm</TableHeaderCell>
              <TableHeaderCell className="min-w-24 text-center">Loại trạm</TableHeaderCell>
              {section.isEditing ? <TableHeaderCell className="w-12" /> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {section.booths.map((booth) => (
              <TableRow key={booth.id} className="border-[#f5f5f5]">
                <TableCell>
                  {section.isEditing ? (
                    <Input ref={(node) => section.setInputRef(booth.id, 'name', node)} aria-label="Tên trạm" error={section.errors[booth.id]?.name} value={booth.name} onChange={booth.onNameChange} />
                  ) : booth.name}
                </TableCell>
                <TableCell>
                  {section.isEditing ? (
                    <Input ref={(node) => section.setInputRef(booth.id, 'place', node)} aria-label="Địa điểm trạm" error={section.errors[booth.id]?.place} value={booth.place} onChange={booth.onPlaceChange} />
                  ) : booth.place}
                </TableCell>
                <TableCell className="min-w-[230px]">
                  {section.isEditing ? (
                    <OrganizerSearchBox
                      type="single"
                      value={booth.managers}
                      error={section.errors[booth.id]?.managers}
                      onChange={booth.onManagersChange}
                    />
                  ) : (
                    <AvatarName name={booth.managerText} avatarUrl={booth.managers[0]?.avatarUrl} />
                  )}
                </TableCell>
                <TableCell className="min-w-[260px]">
                  {section.isEditing ? (
                    <button
                      type="button"
                      className={`h-10 w-full rounded-lg border bg-[#fcfcfc] px-3 text-left text-sm text-[#525252] transition hover:border-[#de3336] hover:bg-white ${section.errors[booth.id]?.description ? 'border-[#de3336]' : 'border-[#eeeeee]'}`}
                      aria-label="Mô tả trạm"
                      onClick={() => section.openDetails(booth.id)}
                    >
                      <span className="block truncate">{booth.descriptionText}</span>
                    </button>
                  ) : booth.descriptionText}
                </TableCell>
                <TableCell className="min-w-24 text-center">
                  {section.isEditing && !booth.isPersisted ? (
                    <div className="flex justify-center">
                      <Switch
                        checked={booth.isHidden}
                        onChange={booth.onHiddenChange}
                      />
                    </div>
                  ) : (
                    <Switch checked={booth.isHidden} disabled onChange={() => undefined} />
                  )}
                </TableCell>
                {section.isEditing ? (
                  <TableCell>
                    <IconButton
                      className="rounded-md p-2 text-[#737373] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                      aria-label="Xóa trạm"
                      icon={<TrashGlyph />}
                      onClick={booth.onRemove}
                    />
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
            {section.isEditing ? (
              <TableRow
                key={`new-booth-${section.booths.length}`}
                className="border-[#f5f5f5]"
              >
                <TableCell>
                  <Input
                    aria-label="Thêm tên trạm"
                    className="border-dashed bg-white"
                    placeholder="Nhập tên trạm"
                    onChange={(event) => section.createBooth({
                      name: event.target.value,
                    }, 'name')}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    aria-label="Thêm địa điểm trạm"
                    className="border-dashed bg-white"
                    placeholder="Nhập địa điểm"
                    onChange={(event) => section.createBooth({
                      place: event.target.value,
                    }, 'place')}
                  />
                </TableCell>
                <TableCell className="min-w-[230px]">
                  <OrganizerSearchBox
                    type="single"
                    onChange={(managers) => section.createBooth({
                      managers: managers.map((manager) => ({
                        id: manager.id,
                        displayName: manager.displayName ?? manager.email,
                        email: manager.email,
                      })),
                    })}
                  />
                </TableCell>
                <TableCell className="min-w-[260px]">
                  <button
                    type="button"
                    className="flex h-10 w-full items-center rounded-lg border border-dashed border-[#e2e2e2] bg-white px-3 text-left text-sm text-[#9ca3af] transition hover:border-[#de3336] hover:text-[#525252]"
                    onClick={section.createBoothWithDescription}
                  >
                    Thêm mô tả
                  </button>
                </TableCell>
                <TableCell className="min-w-24">
                  <div className="flex justify-center">
                    <Switch checked={false} onChange={section.createHiddenBooth} />
                  </div>
                </TableCell>
                <TableCell />
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Drawer
        open={Boolean(section.selectedBooth)}
        panelClassName="!max-w-[760px]"
        title={`Mô tả trạm: ${section.selectedBooth?.name || 'Trạm mới'}`}
        onClose={section.closeDetails}
        footer={(
          <>
            <Button variant="secondary" onClick={section.closeDetails}>Hủy</Button>
            <Button onClick={section.closeDetails}>Lưu</Button>
          </>
        )}
      >
        {section.selectedBooth ? (
          <RichTextEditor
            value={section.selectedBooth.description}
            placeholder="Nhập luật và mô tả cho trạm..."
            onChange={section.updateSelectedDescription}
          />
        ) : null}
      </Drawer>
    </SectionCard>
  )
}
