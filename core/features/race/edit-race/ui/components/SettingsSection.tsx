import { Switch, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/core/shared'
import { SectionCard } from './SectionCard'
import { SectionTitle } from './SectionTitle'

export type SettingsSectionProps = {
  isEditing: boolean
  isHiddenPoint: boolean
  isToggledLeaderboard: boolean
  updateSetting: (key: 'isToggledLeaderboard' | 'isHiddenPoint', value: boolean) => void
}

export const SettingsSection = ({ isEditing, isHiddenPoint, isToggledLeaderboard, updateSetting }: SettingsSectionProps) => (
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
              {isEditing ? 'Ẩn bảng xếp hạng khỏi màn hình đội chơi trong thời gian trận đấu diễn ra.' : 'Chi tiết ...'}
            </TableCell>
            <TableCell>
              <Switch checked={isToggledLeaderboard} disabled={!isEditing} onChange={(checked) => updateSetting('isToggledLeaderboard', checked)} />
            </TableCell>
          </TableRow>
          <TableRow className="border-[#f5f5f5]">
            <TableCell>Ẩn điểm trên BXH</TableCell>
            <TableCell>{isEditing ? 'Ẩn điểm chi tiết nhưng vẫn giữ thông tin xếp hạng cần thiết.' : 'Chi tiết ...'}</TableCell>
            <TableCell>
              <Switch checked={isHiddenPoint} disabled={!isEditing} onChange={(checked) => updateSetting('isHiddenPoint', checked)} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </SectionCard>
)
