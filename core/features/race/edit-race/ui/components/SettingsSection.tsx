import {
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/core/shared'
import { SectionCard } from './SectionCard'
import { SectionTitle } from './SectionTitle'
import { useSettingsSection } from '../hooks/useSettingsSection'

export const SettingsSection = () => {
  const section = useSettingsSection()

  return (
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
              <TableCell>
                {section.isEditing
                  ? 'Ẩn bảng xếp hạng khỏi màn hình đội chơi trong thời gian trận đấu diễn ra.'
                  : 'Chi tiết ...'}
              </TableCell>
              <TableCell>
                <Switch checked={section.isToggledLeaderboard} disabled={!section.isEditing} onChange={section.onLeaderboardChange} />
              </TableCell>
            </TableRow>
            <TableRow className="border-[#f5f5f5]">
              <TableCell>Ẩn điểm trên BXH</TableCell>
              <TableCell>
                {section.isEditing
                  ? 'Ẩn điểm chi tiết nhưng vẫn giữ thông tin xếp hạng cần thiết.'
                  : 'Chi tiết ...'}
              </TableCell>
              <TableCell>
                <Switch checked={section.isHiddenPoint} disabled={!section.isEditing} onChange={section.onHiddenPointChange} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  )
}
