import { useState } from 'react'
import { Button, Drawer, Input, RichTextEditor } from '@/core/shared'
import { useBasicInformationStep } from './useBasicInformationStep'
import { CreateRaceStepLayout } from '../../CreateRaceStepLayout/CreateRaceStepLayout'

export const BasicInformationStep = () => {
    const {
        errors,
        imageInputRef,
        openImagePicker,
        update,
        value,
        previewUrl,
        uploadError,
        handleImageSelected,
    } = useBasicInformationStep()

    const [isRulesOpen, setIsRulesOpen] = useState(false)

    const getPlainText = (html: string) => {
        if (!html) return ''
        const doc = new DOMParser().parseFromString(html, 'text/html')
        return doc.body.textContent?.replace(/\s+/g, ' ').trim() || ''
    }

    const rulesTextPreview = getPlainText(value.rules || '')

    return (
        <CreateRaceStepLayout step={1} title="THÔNG TIN CƠ BẢN">
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                <div className="md:col-span-2">
                    <Input
                        label="Tên trận đấu"
                        requiredMark
                        placeholder="Nhập tên trận đấu"
                        value={value.name}
                        error={errors.name}
                        onChange={(e) => update('name', e.target.value)}
                    />
                </div>
                <Input
                    type="datetime-local"
                    label="Thời gian bắt đầu"
                    requiredMark
                    value={value.startAt}
                    error={errors.startAt}
                    onChange={(e) => update('startAt', e.target.value)}
                />
                <Input
                    type="datetime-local"
                    label="Thời gian kết thúc"
                    requiredMark
                    value={value.endAt}
                    error={errors.endAt}
                    onChange={(e) => update('endAt', e.target.value)}
                />
                <div>
                    <span className="mb-2 block text-xs font-semibold uppercase leading-[14px] tracking-[0.15px] text-[#1a1c1c]">Ảnh bìa</span>
                    <input
                        ref={imageInputRef}
                        className="sr-only"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelected(e.target.files?.[0])}
                    />
                    <button
                        type="button"
                        onClick={openImagePicker}
                        className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#e2e2e2] bg-white px-4 text-left text-sm text-[#6b7280] transition hover:border-[#de3336] focus:outline-none focus:ring-2 focus:ring-[#de3336]/10"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0 text-[#525252]" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M12 16V4m0 0-4 4m4-4 4 4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className={value.imageName ? 'text-[#171717] text-sm' : 'text-sm'}>
                            {value.imageName || 'Tải ảnh bìa lên'}
                        </span>
                    </button>

                    {uploadError ? (
                        <p className="mt-1.5 text-xs text-[#de3336]">{uploadError}</p>
                    ) : null}
                </div>
                <Input
                    label="Địa điểm"
                    requiredMark
                    placeholder="Nhập địa điểm trận đấu"
                    value={value.location}
                    error={errors.location}
                    onChange={(e) => update('location', e.target.value)}
                />

                <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase leading-[14px] tracking-[0.15px] text-[#1a1c1c]">
                        Luật trận đấu
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsRulesOpen(true)}
                        className="flex h-10 w-full items-center justify-between rounded-lg border border-[#e2e2e2] bg-white px-3 text-left text-sm transition hover:border-[#de3336] focus:outline-none focus:ring-2 focus:ring-[#de3336]/10"
                    >
                        <span className={rulesTextPreview ? 'truncate text-[#171717]' : 'text-[#6b7280]'}>
                            {rulesTextPreview || 'Nhập luật trận đấu...'}
                        </span>
                    </button>
                    {errors.rules ? (
                        <p className="mt-1.5 text-xs text-[#de3336]">{errors.rules}</p>
                    ) : null}
                </div>

                {previewUrl ? (
                    <div className="md:col-span-2">
                        <img
                            src={previewUrl}
                            alt="Xem trước ảnh bìa"
                            className="h-48 w-full rounded-lg border border-[#e5e5e5] object-cover"
                        />
                    </div>
                ) : null}
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
                    value={value.rules || ''}
                    placeholder="Nhập luật trận đấu..."
                    onChange={(content) => update('rules', content)}
                />
            </Drawer>
        </CreateRaceStepLayout>
    )
}