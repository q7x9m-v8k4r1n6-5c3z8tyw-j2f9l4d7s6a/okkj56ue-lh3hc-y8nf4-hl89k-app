import { useState } from 'react'
import { Button, Drawer, Input, RichTextEditor } from '@/core/shared'
import { useBasicInformationSection } from '../hooks/useBasicInformationSection'

export const BasicInformationSection = () => {
  const section = useBasicInformationSection()
  const [isRulesOpen, setIsRulesOpen] = useState(false)

  const getPlainText = (html: string) => {
    if (!html) return ''
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent?.replace(/\s+/g, ' ').trim() || ''
  }

  const rulesPreviewText = getPlainText(section.rules || '')

  const inputDisabledStyle = "disabled:bg-[#fcfcfc] disabled:opacity-100 disabled:cursor-default disabled:text-[#171717] disabled:border-[#eeeeee]"

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold uppercase tracking-tight text-[#1a1c1c]">
        <span className="text-[#de3336]">(1) </span>THÔNG TIN CƠ BẢN
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Input
            label="Tên trận đấu"
            disabled={!section.isEditing}
            className={inputDisabledStyle}
            value={section.raceName}
            onChange={section.onRaceNameChange}
          />
        </div>

        <Input
          type="datetime-local"
          label="Thời gian bắt đầu"
          disabled={!section.isEditing}
          className={inputDisabledStyle}
          value={section.timeStart}
          onChange={section.onTimeStartChange}
        />

        <Input
          type="datetime-local"
          label="Thời gian kết thúc"
          disabled={!section.isEditing}
          className={inputDisabledStyle}
          value={section.timeEnd}
          onChange={section.onTimeEndChange}
        />

        <Input
          label="Địa điểm"
          disabled={!section.isEditing}
          className={inputDisabledStyle}
          value={section.place}
          onChange={section.onPlaceChange}
        />

        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase leading-[14px] tracking-[0.15px] text-[#1a1c1c]">
            Luật trận đấu
          </label>
          
          {section.isEditing ? (
            <button
              type="button"
              onClick={() => setIsRulesOpen(true)}
              className="flex h-10 w-full items-center justify-between rounded-lg border border-[#e2e2e2] bg-white px-3 text-left text-sm transition hover:border-[#de3336] focus:outline-none focus:ring-2 focus:ring-[#de3336]/10"
            >
              <span className={rulesPreviewText ? 'truncate text-[#171717]' : 'text-[#6b7280]'}>
                {rulesPreviewText || 'Nhập luật trận đấu...'}
              </span>
            </button>
          ) : (
            <div className="flex h-10 w-full items-center rounded-lg border border-[#eeeeee] bg-[#fcfcfc] px-3 text-sm text-[#171717] cursor-default">
              <span className="truncate">{rulesPreviewText || 'Chưa có thông tin luật trận đấu.'}</span>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={isRulesOpen}
        panelClassName="!max-w-[760px]"
        title="Luật trận đấu"
        onClose={() => setIsRulesOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsRulesOpen(false)}>Hủy</Button>
            <Button onClick={() => setIsRulesOpen(false)}>Lưu</Button>
          </>
        }
      >
        <RichTextEditor
          value={section.rules}
          placeholder="Nhập luật trận đấu..."
          onChange={section.onRulesChange}
        />
      </Drawer>
    </div>
  )
}