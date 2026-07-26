import type { RefObject } from 'react'
import { UploadIcon } from '@/core/assets'
import { formatDateTime, Input } from '@/core/shared'
import type { EditRaceForm } from '../../models'
import { ReadonlyField } from './ReadonlyField'
import { SectionCard } from './SectionCard'
import { SectionTitle } from './SectionTitle'

export type BasicInformationSectionProps = {
  coverFileName: string
  coverUrl: string
  imageInputRef: RefObject<HTMLInputElement | null>
  isEditing: boolean
  onImageSelected: (file?: File) => void
  openImagePicker: () => void
  place: string
  raceName: string
  timeEnd: string
  timeStart: string
  updateBasic: (changes: Partial<Pick<EditRaceForm, 'raceName' | 'timeStart' | 'timeEnd' | 'coverUrl' | 'coverFileName' | 'place'>>) => void
}

export const BasicInformationSection = ({
  coverFileName,
  coverUrl,
  imageInputRef,
  isEditing,
  onImageSelected,
  openImagePicker,
  place,
  raceName,
  timeEnd,
  timeStart,
  updateBasic,
}: BasicInformationSectionProps) => (
  <SectionCard>
    <SectionTitle index={1} title="Thông tin cơ bản" />
    <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-4 lg:grid-cols-2">
      <div className="lg:col-span-2">
        {isEditing ? (
          <Input label="Tên trận đấu" requiredMark value={raceName} onChange={(event) => updateBasic({ raceName: event.target.value })} />
        ) : (
          <ReadonlyField label="Tên trận đấu" requiredMark value={raceName} />
        )}
      </div>
      {isEditing ? (
        <>
          <Input type="datetime-local" step={1} label="Thời gian bắt đầu" requiredMark value={timeStart} onChange={(event) => updateBasic({ timeStart: event.target.value })} />
          <Input type="datetime-local" step={1} label="Thời gian kết thúc" requiredMark value={timeEnd} onChange={(event) => updateBasic({ timeEnd: event.target.value })} />
        </>
      ) : (
        <>
          <ReadonlyField label="Thời gian bắt đầu" requiredMark value={formatDateTime(timeStart)} />
          <ReadonlyField label="Thời gian kết thúc" requiredMark value={formatDateTime(timeEnd)} />
        </>
      )}
      <div>
        <span className="mb-2 block text-xs font-semibold uppercase leading-[14px] tracking-[0.15px] text-[#1a1c1c]">
          Ảnh bìa <span className="text-[#de3336]">(*)</span>
        </span>
        {isEditing ? (
          <>
            <input ref={imageInputRef} className="sr-only" type="file" accept="image/*" onChange={(event) => onImageSelected(event.target.files?.[0])} />
            <button
              type="button"
              className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#e2e2e2] bg-white px-4 text-left text-sm text-[#737373] transition hover:border-[#de3336] focus:outline-none focus:ring-2 focus:ring-[#de3336]/10"
              onClick={openImagePicker}
            >
              <UploadIcon className="size-5 shrink-0 text-[#525252]" />
              <span className="min-w-0 truncate">{coverFileName || 'Upload file ảnh bìa tại đây'}</span>
            </button>
          </>
        ) : (
          <div className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#e2e2e2] bg-[#fafafa] px-4 text-sm text-[#8a8f98]">
            <UploadIcon className="size-5 shrink-0 text-[#525252]" />
            <span className="min-w-0 truncate">{coverFileName || 'Upload file ảnh bìa tại đây'}</span>
          </div>
        )}
      </div>
      {isEditing ? (
        <Input label="Địa điểm" requiredMark value={place} onChange={(event) => updateBasic({ place: event.target.value })} />
      ) : (
        <ReadonlyField label="Địa điểm" requiredMark value={place} />
      )}
      {coverUrl ? (
        <div className="lg:col-span-2">
          <img src={coverUrl} alt="Xem trước ảnh bìa" className="h-48 w-full rounded-lg border border-[#e5e5e5] object-cover" />
        </div>
      ) : null}
    </div>
  </SectionCard>
)
