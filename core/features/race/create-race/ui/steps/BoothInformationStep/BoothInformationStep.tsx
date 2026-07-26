import { Button, Drawer, Input, RichTextEditor } from '@/core/shared'
import { TrashGlyph } from '@/core/assets/icons'
import { CreateRaceStepLayout, } from '../../CreateRaceStepLayout/CreateRaceStepLayout'
import { useBoothInformationStep } from '@/core/features/race/create-race/hooks'
import { OrganizerSearchBox } from '@/core/entities/organizer/ui/OrganizerSearchBox/OrganizerSearchBox'

export const BoothInformationStep = () => {
    const {
        rows,
        errors,
        selectedStation,
        setDetailId,
        update,
        updateTextField,
        createStation,
        createStationWithDescription,
        closeDetails,
        getManagerValue,
        updateManagers,
        setInputRef,
        removeStation,
    } = useBoothInformationStep()

    return (
        <CreateRaceStepLayout step={2} title="THÔNG TIN TRẠM">
            <div className="min-w-0 overflow-hidden rounded-xl border border-[#e5e5e5] bg-white shadow-sm">
                <div className="max-h-[calc(100svh-360px)] min-w-0 overflow-y-auto overflow-x-hidden">
                    <div className="w-full min-w-0">
                        <div className="sticky top-0 z-10 hidden grid-cols-[minmax(0,1fr)_minmax(0,.85fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_44px] gap-4 border-b border-[#eeeeee] bg-[#fbfbfb] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#737373] md:grid"><span>Tên trạm</span><span>Địa điểm</span><span>Quản trạm</span><span>Mô tả trạm</span><span /></div>
                        {rows.map((row) => {
                            const descriptionText = row.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

                            return (
                                <div key={row.id} className="grid min-w-0 grid-cols-1 items-start gap-3 border-b border-[#f2f2f2] px-5 py-3 text-sm text-[#525252] transition-colors hover:bg-[#fcfcfc] md:grid-cols-[minmax(0,1fr)_minmax(0,.85fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_44px] md:gap-4">
                                    <Input
                                        ref={(node) => setInputRef(row.id, 'name', node)}
                                        className="border-[#eeeeee] bg-[#fcfcfc]"
                                        aria-label="Tên trạm"
                                        value={row.name}
                                        error={errors[row.id]?.name}
                                        onChange={(event) => updateTextField(row.id, 'name', event.target.value)}
                                    />

                                    <Input
                                        ref={(node) => setInputRef(row.id, 'location', node)}
                                        className="border-[#eeeeee] bg-[#fcfcfc]"
                                        aria-label="Địa điểm"
                                        value={row.location}
                                        error={errors[row.id]?.location}
                                        onChange={(event) => updateTextField(row.id, 'location', event.target.value)}
                                    />

                                    <OrganizerSearchBox
                                        type="multiple"
                                        value={getManagerValue(row)}
                                        error={errors[row.id]?.managers}
                                        onChange={(organizers) => updateManagers(row, organizers)}
                                    />

                                    <button
                                        type="button"
                                        className="h-10 min-w-0 rounded-lg border border-[#eeeeee] bg-[#fcfcfc] px-3 py-2 text-left text-sm text-[#525252] transition hover:border-[#de3336] hover:bg-white"
                                        onClick={() => setDetailId(row.id)}
                                    >
                                        <span className="block truncate">{descriptionText || ''}</span>
                                    </button>

                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            className="rounded-md p-2 text-[#525252] transition hover:bg-[#fff1f1] hover:text-[#de3336]"
                                            aria-label="Xóa trạm"
                                            onClick={() => removeStation(row.id)}
                                        >
                                            <TrashGlyph />
                                        </button>
                                    </div>

                                </div>

                            )
                        })}
                        <div key={`new-station-${rows.length}`} className="grid min-w-0 grid-cols-1 items-start gap-3 px-5 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,.85fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_44px] md:gap-4">
                            <Input className="h-10 border-dashed bg-white" placeholder="Nhập tên trạm" onChange={(event) => createStation({ name: event.target.value }, 'name')} />
                            <Input className="h-10 border-dashed bg-white" placeholder="Nhập địa điểm" onChange={(event) => createStation({ location: event.target.value }, 'location')} />
                            <OrganizerSearchBox type="multiple" onChange={(organizers) => createStation({ managers: organizers })} />
                            <button type="button" className="flex h-10 items-center rounded-lg border border-dashed border-[#e2e2e2] bg-white px-3 text-left text-[14px] leading-5 text-[#9ca3af] transition hover:border-[#de3336] hover:text-[#525252]" onClick={createStationWithDescription}>Thêm mô tả</button>
                            <span className="hidden md:block" />
                        </div>
                    </div>
                </div>
            </div>
            <Drawer open={Boolean(selectedStation)} panelClassName="!max-w-[760px]" title={selectedStation ? `Mô tả trạm: ${selectedStation.name || 'Trạm mới'}` : 'Mô tả trạm'} onClose={closeDetails} footer={<><Button variant="secondary" onClick={closeDetails}>Hủy</Button><Button onClick={closeDetails}>Lưu</Button></>}>
                {selectedStation ? <RichTextEditor value={selectedStation.description} placeholder="Nhập luật và mô tả cho trạm..." onChange={(description) => update(selectedStation.id, { description })} /> : null}
            </Drawer>
        </CreateRaceStepLayout>
    );
}
