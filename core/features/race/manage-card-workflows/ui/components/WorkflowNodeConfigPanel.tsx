import { TrashIcon } from '@/core/assets'
import { Button, MultiSelectDropdown, TagInput, Tooltip } from '@/core/shared'
import type { RaceCardTeam } from '../../api/functionCard.api'
import type { BuilderNode } from '../../model/workflow.builder'

type Props = {
  node?: BuilderNode
  teams: RaceCardTeam[]
  variableNames: string[]
  onChange: (config: Record<string, unknown>) => void
  onTitleChange: (title: string) => void
  onDelete: () => void
}

const Field = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <label className="block">
    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#737373]">{label}</span>
    {children}
  </label>
)

const inputClass = 'h-9 w-full rounded-lg border border-[#dedede] bg-white px-3 text-xs text-[#262626] outline-none focus:border-[#de3336] focus:ring-2 focus:ring-[#de3336]/10'
const textareaClass = `${inputClass} h-auto min-h-20 py-2 leading-5`

const asString = (value: unknown) => typeof value === 'string' ? value : ''
const asStringArray = (value: unknown) => Array.isArray(value)
  ? value.filter((item): item is string => typeof item === 'string')
  : []
const asNumber = (value: unknown, fallback = 0) => typeof value === 'number' ? value : fallback
const attackSubActionLabels: Record<string, string> = {
  subtract: 'Trừ điểm',
  freeze: 'Đóng băng',
  steal: 'Cướp điểm',
  transfer: 'Chuyển điểm',
}

export const WorkflowNodeConfigPanel = ({ node, onChange, onDelete, onTitleChange, teams, variableNames }: Props) => {
  if (!node) return null

  const { config, workflowType } = node.data
  const patch = (field: string, value: unknown) => onChange({ ...config, [field]: value })
  const selectedTeamIds = asStringArray(config.teamIds).length
    ? asStringArray(config.teamIds)
    : asString(config.teamId)
      ? [asString(config.teamId)]
      : []
  const targetField = (allowAll = false) => (
    <Field label="Đối tượng">
      <select className={inputClass} value={asString(config.target)} onChange={(event) => patch('target', event.target.value)}>
        <option value="actor">Đội kích hoạt</option>
        <option value="target">Đội mục tiêu</option>
        {allowAll && <option value="all-teams">Tất cả đội</option>}
        <option value="custom">Tùy chọn</option>
      </select>
      {config.target === 'custom' && (
        <div className="mt-2">
          <MultiSelectDropdown
            buttonClassName="!h-9 !px-3 !text-xs"
            values={selectedTeamIds}
            placeholder="Chọn một hoặc nhiều đội"
            options={teams.map((team) => ({ value: team.id, label: team.name || team.email, description: team.name ? team.email : undefined }))}
            onChange={(teamIds) => onChange({ ...config, teamId: undefined, teamIds })}
          />
        </div>
      )}
    </Field>
  )

  return (
    <aside className="min-h-0 overflow-y-auto border-l border-[#eeeeee] bg-white p-5">
      <div className="mb-5 border-b border-[#eeeeee] pb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-[#262626]">{node.data.label}</h3>
          <Tooltip content={node.data.description} position="bottom">
            <span tabIndex={0} aria-label={`Thông tin ${node.data.label}`} className="grid size-4 place-items-center rounded-full border border-[#b7b7b7] text-[9px] font-bold text-[#737373]">i</span>
          </Tooltip>
        </div>
      </div>

      <div className="space-y-4">
        {!workflowType.startsWith('trigger.') && (
          <Field label="Tiêu đề">
            <input className={inputClass} value={node.data.label} maxLength={120} onChange={(event) => onTitleChange(event.target.value)} />
          </Field>
        )}
        {workflowType.startsWith('trigger.') && (
          <p className="rounded-lg bg-[#fff5f5] p-3 text-xs leading-5 text-[#8f2426]">Trigger được xác định tự động theo loại thẻ chức năng và không thể chỉnh sửa.</p>
        )}
        {workflowType === 'logic.condition' && (
          <>
            <Field label="Dữ liệu bên trái">
              <input className={inputClass} value={asString((config.left as Record<string, unknown>)?.path)} placeholder="event.actorTeamId" onChange={(event) => patch('left', { kind: 'path', path: event.target.value })} />
            </Field>
            <Field label="Toán tử">
              <select className={inputClass} value={asString(config.operator)} onChange={(event) => patch('operator', event.target.value)}>
                <option value="equals">Bằng</option><option value="not_equals">Khác</option>
                <option value="greater_than">Lớn hơn</option><option value="greater_or_equal">Lớn hơn hoặc bằng</option>
                <option value="less_than">Nhỏ hơn</option><option value="less_or_equal">Nhỏ hơn hoặc bằng</option>
                <option value="contains">Có chứa</option><option value="is_empty">Rỗng</option>
              </select>
            </Field>
            {config.operator !== 'is_empty' && (
              <Field label="Giá trị bên phải">
                <input className={inputClass} value={String((config.right as Record<string, unknown>)?.value ?? '')} placeholder="Giá trị so sánh" onChange={(event) => patch('right', { kind: 'literal', value: event.target.value })} />
              </Field>
            )}
          </>
        )}
        {workflowType === 'data.create_variable' && (
          <>
            <Field label="Tên biến"><input className={inputClass} value={asString(config.name)} placeholder="tenBien" onChange={(event) => patch('name', event.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} /></Field>
            <Field label="Giá trị ban đầu"><input className={inputClass} value={String((config.value as Record<string, unknown>)?.value ?? '')} onChange={(event) => patch('value', { kind: 'literal', value: event.target.value })} /></Field>
          </>
        )}
        {workflowType === 'data.set_variable' && (
          <>
            <Field label="Tên biến">
              <select className={inputClass} value={asString(config.name)} onChange={(event) => patch('name', event.target.value)}>
                <option value="">{variableNames.length ? 'Chọn biến' : 'Chưa có biến được tạo trước đó'}</option>
                {variableNames.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </Field>
            <Field label="Giá trị"><input className={inputClass} value={String((config.value as Record<string, unknown>)?.value ?? '')} onChange={(event) => patch('value', { kind: 'literal', value: event.target.value })} /></Field>
          </>
        )}
        {workflowType === 'data.random_number' && (
          <>
            <Field label="Tên biến"><input className={inputClass} value={asString(config.name)} onChange={(event) => patch('name', event.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nhỏ nhất"><input type="number" className={inputClass} value={asNumber(config.min, 1)} onChange={(event) => patch('min', Number(event.target.value))} /></Field>
              <Field label="Lớn nhất"><input type="number" className={inputClass} value={asNumber(config.max, 6)} onChange={(event) => patch('max', Number(event.target.value))} /></Field>
            </div>
          </>
        )}
        {workflowType === 'input.read_value' && (
          <>
            <Field label="Input nguồn">
              <input className={`${inputClass} bg-[#f7f7f7]`} value={asString(config.inputKey)} disabled />
            </Field>
            <Field label="Lưu vào biến">
              <input className={inputClass} value={asString(config.variableName)} placeholder="Tên biến dùng trong workflow" onChange={(event) => patch('variableName', event.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} />
            </Field>
          </>
        )}
        {workflowType === 'team.adjust_score' && (
          <>
            {targetField()}
            <Field label="Điểm cộng"><input type="number" min={1} className={inputClass} value={asNumber(config.delta, 10)} onChange={(event) => patch('delta', Math.max(1, Math.abs(Number(event.target.value)) || 1))} /></Field>
            <Field label="Lý do"><textarea className={textareaClass} value={asString(config.reason)} onChange={(event) => patch('reason', event.target.value)} /></Field>
          </>
        )}
        {workflowType === 'attack.execute' && (
          <>
            <Field label="Sub-action">
              <div className="rounded-lg border border-[#dedede] bg-[#fafafa] px-3 py-2 text-xs font-medium text-[#525252]">
                {attackSubActionLabels[asString(config.subAction)] ?? 'Bấm dấu + trên node để chọn sub-action'}
              </div>
            </Field>
            {config.subAction === 'freeze' ? (
              <Field label="Thời gian đóng băng (giây)">
                <input type="number" min={1} className={inputClass} value={asNumber(config.durationSeconds, 60)} onChange={(event) => patch('durationSeconds', Math.max(1, Math.abs(Number(event.target.value)) || 1))} />
              </Field>
            ) : config.subAction ? (
              <Field label="Số điểm">
                <input type="number" min={1} className={inputClass} value={asNumber(config.amount, 10)} onChange={(event) => patch('amount', Math.max(1, Math.abs(Number(event.target.value)) || 1))} />
              </Field>
            ) : null}
            <Field label="Nhãn thẻ phòng thủ được kích hoạt">
              <TagInput values={asStringArray(config.defenseTags)} onChange={(defenseTags) => patch('defenseTags', defenseTags)} />
            </Field>
          </>
        )}
        {workflowType === 'notify.send_message' && (
          <>
            {targetField(true)}
            <Field label="Nội dung"><textarea className={textareaClass} value={asString(config.message)} placeholder="Dùng {{variables.tenBien}} để chèn dữ liệu" onChange={(event) => patch('message', event.target.value)} /></Field>
          </>
        )}
        {workflowType === 'flow.scope' && (
          <p className="rounded-lg bg-[#f5f7ff] p-3 text-xs leading-5 text-[#334155]">Nối luồng chính vào nhánh Try. Nếu một action trong nhánh này lỗi, workflow sẽ tiếp tục từ nhánh Catch.</p>
        )}
      </div>

      {!workflowType.startsWith('trigger.') && (
        <Button variant="danger" className="mt-6 w-full" leadingIcon={<TrashIcon className="size-4" />} onClick={onDelete}>
          Xóa node
        </Button>
      )}
    </aside>
  )
}
