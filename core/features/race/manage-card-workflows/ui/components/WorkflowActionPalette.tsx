import { useState, type DragEvent } from 'react'
import { createPortal } from 'react-dom'
import type { WorkflowPaletteItem } from '../../model/workflow.builder'

type Props = { items: WorkflowPaletteItem[] }

const categoryLabels: Record<string, string> = {
  logic: 'Logic',
  data: 'Dữ liệu',
  team: 'Đội chơi',
  notify: 'Thông báo',
  card: 'Thẻ',
  flow: 'Luồng',
  input: 'Dữ liệu nhập',
  attack: 'Tấn công',
}

export const WorkflowActionPalette = ({ items }: Props) => {
  const [tooltip, setTooltip] = useState<{ content: string; left: number; top: number } | null>(null)
  const actions = items.filter((item) => !item.isTrigger)
  const groups = [...actions.reduce((grouped, item) => {
    grouped.set(item.category, [...(grouped.get(item.category) ?? []), item])
    return grouped
  }, new Map<string, WorkflowPaletteItem[]>()).entries()]

  const startDrag = (event: DragEvent, type: string) => {
    event.dataTransfer.setData('application/move-workflow-node', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  const showTooltip = (element: HTMLElement, content: string) => {
    const rect = element.getBoundingClientRect()
    setTooltip({ content, left: rect.right + 10, top: rect.top + rect.height / 2 })
  }

  return (
    <aside className="h-full min-h-0 overflow-y-auto overscroll-contain border-r border-[#eeeeee] bg-white p-4">
      <h3 className="text-sm font-semibold text-[#262626]">Thư viện action</h3>
      <div className="mt-4 space-y-5">
        {groups.map(([category, entries]) => (
          <section key={category}>
            <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9a9a9a]">
              {categoryLabels[category] ?? category}
            </h4>
            <div className="space-y-2">
              {entries?.map((item) => (
                <button
                  key={item.paletteKey ?? item.type}
                  type="button"
                  draggable
                  className="block w-full cursor-grab rounded-lg border border-[#e8e8e8] bg-white px-3 py-2.5 text-left transition hover:border-[#de3336]/50 hover:bg-[#fffafa] active:cursor-grabbing"
                  onDragStart={(event) => startDrag(event, item.paletteKey ?? item.type)}
                >
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#333]">
                    <span>{item.label}</span>
                    <span
                      tabIndex={0}
                      aria-label={`Thông tin ${item.label}`}
                      className="grid size-4 shrink-0 place-items-center rounded-full border border-[#b7b7b7] text-[9px] font-bold text-[#737373]"
                      onMouseEnter={(event) => showTooltip(event.currentTarget, item.description)}
                      onMouseLeave={() => setTooltip(null)}
                      onFocus={(event) => showTooltip(event.currentTarget, item.description)}
                      onBlur={() => setTooltip(null)}
                    >i</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      {tooltip ? createPortal(
        <div
          role="tooltip"
          className="pointer-events-none fixed z-[100] w-72 -translate-y-1/2 rounded-lg bg-[#1f1f1f] px-3 py-2 text-xs font-medium leading-5 text-white shadow-xl"
          style={{ left: tooltip.left, top: tooltip.top }}
        >
          {tooltip.content}
        </div>,
        document.body,
      ) : null}
    </aside>
  )
}
