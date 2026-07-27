import { UploadIcon } from '@/core/assets'
import {
  formatDateTime,
  Input,
} from '@/core/shared'
import { ReadonlyField } from './ReadonlyField'
import { SectionCard } from './SectionCard'
import { SectionTitle } from './SectionTitle'
import { useBasicInformationSection } from '../hooks/useBasicInformationSection'

export const BasicInformationSection = () => {
  const section = useBasicInformationSection()

  return (
    <SectionCard>
      <SectionTitle index={1} title="Thông tin cơ bản" />
      <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
          {section.isEditing ? (
            <Input error={section.errors.raceName} label="Tên trận đấu" requiredMark value={section.raceName} onChange={section.onRaceNameChange} />
          ) : (
            <ReadonlyField label="Tên trận đấu" requiredMark value={section.raceName} />
          )}
        </div>
        {section.isEditing ? (
          <>
            <Input error={section.errors.timeStart} type="datetime-local" step={1} label="Thời gian bắt đầu" requiredMark value={section.timeStart} onChange={section.onTimeStartChange} />
            <Input error={section.errors.timeEnd} type="datetime-local" step={1} label="Thời gian kết thúc" requiredMark value={section.timeEnd} onChange={section.onTimeEndChange} />
          </>
        ) : (
          <>
            <ReadonlyField label="Thời gian bắt đầu" requiredMark value={formatDateTime(section.timeStart)} />
            <ReadonlyField label="Thời gian kết thúc" requiredMark value={formatDateTime(section.timeEnd)} />
          </>
        )}
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase leading-[14px] tracking-[0.15px] text-[#1a1c1c]">
            Ảnh bìa <span className="text-[#de3336]">(*)</span>
          </span>
          {section.isEditing ? (
            <>
              <input id={section.coverInputId} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={section.onCoverFileChange} />
              <label
                htmlFor={section.coverInputId}
                className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#e2e2e2] bg-white px-4 text-left text-sm text-[#737373] transition hover:border-[#de3336] focus:outline-none focus:ring-2 focus:ring-[#de3336]/10"
              >
                <UploadIcon className="size-5 shrink-0 text-[#525252]" />
                <span className="min-w-0 truncate">{section.coverFileName || 'Upload file ảnh bìa tại đây'}</span>
              </label>
              {section.errors.coverFile ? <span className="mt-1.5 block text-xs text-[#de3336]">{section.errors.coverFile}</span> : null}
            </>
          ) : (
            <div className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#e2e2e2] bg-[#fafafa] px-4 text-sm text-[#8a8f98]">
              <UploadIcon className="size-5 shrink-0 text-[#525252]" />
              <span className="min-w-0 truncate">{section.coverFileName || 'Upload file ảnh bìa tại đây'}</span>
            </div>
          )}
        </div>
        {section.isEditing ? (
          <Input error={section.errors.place} label="Địa điểm" requiredMark value={section.place} onChange={section.onPlaceChange} />
        ) : (
          <ReadonlyField label="Địa điểm" requiredMark value={section.place} />
        )}
        {section.coverUrl ? (
          <div className="lg:col-span-2">
            <img src={section.coverUrl} alt="Xem trước ảnh bìa" className="h-48 w-full rounded-lg border border-[#e5e5e5] object-cover" />
          </div>
        ) : null}
      </div>
    </SectionCard>
  )
}
