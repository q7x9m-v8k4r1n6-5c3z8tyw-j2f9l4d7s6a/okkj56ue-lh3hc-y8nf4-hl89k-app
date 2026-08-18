import { useEffect, useState } from 'react'
import { Handle, Position, useUpdateNodeInternals, type NodeProps } from '@xyflow/react'
import { Tooltip } from '@/core/shared'
import type { BuilderNode } from '../../model/workflow.builder'

const categoryStyles: Record<string, string> = {
  trigger: 'border-[#de3336] bg-[#fff5f5] text-[#9f1f22]',
  logic: 'border-[#f59e0b] bg-[#fffbeb] text-[#92400e]',
  data: 'border-[#8b5cf6] bg-[#f5f3ff] text-[#5b21b6]',
  team: 'border-[#2563eb] bg-[#eff6ff] text-[#1e40af]',
  notify: 'border-[#0891b2] bg-[#ecfeff] text-[#155e75]',
  card: 'border-[#db2777] bg-[#fdf2f8] text-[#9d174d]',
  flow: 'border-[#737373] bg-[#fafafa] text-[#404040]',
  input: 'border-[#059669] bg-[#ecfdf5] text-[#065f46]',
  attack: 'border-[#dc2626] bg-[#fef2f2] text-[#991b1b]',
}

const attackSubActionLabels = {
  subtract: 'Trừ điểm',
  freeze: 'Đóng băng',
  steal: 'Cướp điểm',
  transfer: 'Chuyển điểm',
} as const

const Port = ({ id, position, className = '' }: { id?: string; position: Position; className?: string }) => (
  <Handle
    id={id}
    type={position === Position.Left ? 'target' : 'source'}
    position={position}
    className={`!size-3 !border-2 !border-white !bg-[#de3336] ${className}`}
  />
)

export const WorkflowNodeCard = ({ data, id, selected }: NodeProps<BuilderNode>) => {
  const [attackMenuOpen, setAttackMenuOpen] = useState(false)
  const updateNodeInternals = useUpdateNodeInternals()
  const isTrigger = data.workflowType.startsWith('trigger.')
  const isCondition = data.workflowType === 'logic.condition'
  const isScope = data.workflowType === 'flow.scope'
  const isStop = data.workflowType === 'flow.stop'
  const isAttack = data.workflowType === 'attack.execute'
  const attackSubAction = typeof data.config.subAction === 'string' && data.config.subAction in attackSubActionLabels
    ? data.config.subAction as keyof typeof attackSubActionLabels
    : null

  useEffect(() => {
    if (isAttack) updateNodeInternals(id)
  }, [attackSubAction, id, isAttack, updateNodeInternals])

  const attackSubActionMenu = (className: string) => attackMenuOpen ? (
    <div className={`nodrag nopan z-50 w-40 rounded-xl border border-[#e5e5e5] bg-white p-1.5 shadow-xl ${className}`}>
      {Object.entries(attackSubActionLabels).map(([value, label]) => (
        <button
          key={value}
          type="button"
          className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-medium hover:bg-[#fff1f1] ${attackSubAction === value ? 'bg-[#eff6ff] text-[#1d4ed8]' : 'text-[#333]'}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation()
            data.onAttackSubActionSelect?.(value as keyof typeof attackSubActionLabels)
            setAttackMenuOpen(false)
          }}
        >{label}</button>
      ))}
    </div>
  ) : null

  const toggleAttackMenu = (event: React.MouseEvent) => {
    event.stopPropagation()
    setAttackMenuOpen((open) => !open)
  }

  return (
    <div className={`relative w-[210px] rounded-xl border-2 bg-white shadow-sm transition ${selected ? 'border-[#de3336] shadow-[0_0_0_3px_rgba(222,51,54,0.12)]' : 'border-[#e5e5e5]'}`}>
      {!isTrigger && <Port position={Position.Left} />}
      <div className={`rounded-t-[10px] border-b px-3 py-2 text-xs font-semibold ${categoryStyles[data.category] ?? categoryStyles.flow}`}>
        <span className="block truncate">{data.label}</span>
      </div>
      <div className="px-3 py-3">
        <div className="flex items-center gap-1.5 text-sm font-medium text-[#525252]">
          <span className="min-w-0 truncate">{data.actionName}</span>
          <Tooltip content={data.description}>
            <span tabIndex={0} aria-label={`Thông tin ${data.actionName}`} className="grid size-4 shrink-0 place-items-center rounded-full border border-[#b7b7b7] text-[9px] font-bold text-[#737373]">i</span>
          </Tooltip>
        </div>
      </div>
      {!isStop && !isCondition && !isScope && !isAttack && <Port position={Position.Right} />}
      {isAttack && !attackSubAction ? (
        <>
          <button
            type="button"
            aria-label="Chọn sub-action tấn công"
            className="nodrag nopan absolute -right-4 top-1/2 z-20 grid size-8 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-[#dc2626] text-lg font-semibold text-white shadow-md"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={toggleAttackMenu}
          >+</button>
          {attackSubActionMenu('absolute left-[calc(100%+24px)] top-1/2 -translate-y-1/2')}
        </>
      ) : null}
      {isAttack && attackSubAction ? (
        <div className="nodrag nopan absolute left-full top-1/2 z-20 flex -translate-y-1/2 items-center">
          <button
            type="button"
            aria-label="Thay đổi sub-action tấn công"
            className="flex h-8 w-8 items-center"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={toggleAttackMenu}
          >
            <span className="h-1 w-full bg-[#2563eb]" />
          </button>
          <div className="relative">
            <button
              type="button"
              className="whitespace-nowrap rounded-lg border-2 border-[#2563eb] bg-[#eff6ff] px-3 py-2 text-xs font-semibold text-[#1d4ed8] shadow-sm"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={toggleAttackMenu}
            >
              {attackSubActionLabels[attackSubAction]}
            </button>
            <Port position={Position.Right} className="!bg-[#2563eb]" />
            {attackSubActionMenu('absolute left-0 top-[calc(100%+8px)]')}
          </div>
        </div>
      ) : null}
      {isCondition ? (
        <>
          <Port id="true" position={Position.Right} className="!top-[42%] !bg-[#16a34a]" />
          <Port id="false" position={Position.Right} className="!top-[76%] !bg-[#dc2626]" />
          <span className="absolute -right-9 top-[34%] text-[9px] font-semibold text-[#15803d]">Đúng</span>
          <span className="absolute -right-7 top-[68%] text-[9px] font-semibold text-[#b91c1c]">Sai</span>
        </>
      ) : null}
      {isScope ? (
        <>
          <Port id="try" position={Position.Right} className="!top-[42%] !bg-[#2563eb]" />
          <Port id="catch" position={Position.Right} className="!top-[76%] !bg-[#dc2626]" />
          <span className="absolute -right-8 top-[34%] text-[9px] font-semibold text-[#1d4ed8]">Try</span>
          <span className="absolute -right-11 top-[68%] text-[9px] font-semibold text-[#b91c1c]">Catch</span>
        </>
      ) : null}
    </div>
  )
}
