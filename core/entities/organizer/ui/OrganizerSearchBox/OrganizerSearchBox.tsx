import { SearchBox } from '@/core/shared'
import type { OrganizerModel, OrganizerSearchMode } from '../../models'
import { useOrganizerSearchBox } from './useOrganizerSearchBox'
import { useOrganizerQuery } from '../../hooks'


type OrganizerSearchBoxProps = {
    type?: OrganizerSearchMode
    value?: OrganizerModel[]
    error?: string
    placeholder?: string
    onChange: (organizers: OrganizerModel[]) => void
}

export const OrganizerSearchBox = ({
    error: validationError,
    onChange,
    placeholder = 'Tìm quản trạm',
    type = 'single',
    value = [],
}: OrganizerSearchBoxProps) => {

   
    const {
        data: organizers, 
        isLoading,
        isError,
        error: queryError,
    } = useOrganizerQuery() // <-- Xóa bỏ hoàn toàn các ký tự bọc Generic phức tạp!

    // 2. Truyền trực tiếp biến dữ liệu dynamic qua lõi xử lý, không bọc lót, không hard code số "1"
    const {
        hasValue,
        options,
        removeOrganizer,
        selectedKey,
        selectOrganizer
    } = useOrganizerSearchBox({ 
        data: organizers, // <-- Truyền thẳng mảng/đối tượng nhận từ API Backend vào đây
        onChange, 
        type, 
        value 
    })
    return (
        <div className="min-w-0">
            <SearchBox
                key={selectedKey}
                options={options}
                placeholder={hasValue ? '' : placeholder}
                emptyText={isLoading ? 'Đang tải quản trạm...' : isError ? 'Không thể tải danh sách quản trạm' : 'Không tìm thấy quản trạm'}
                clearOnSelect
                inputClassName={hasValue ? 'border-[#eeeeee] bg-[#fcfcfc]' : 'h-10 border-[#eeeeee] bg-[#fcfcfc]'}
                selectedContent={value.map((organizer) => (
                    <span
                        key={organizer.id}
                        className="inline-flex h-6 max-w-full items-center gap-1 rounded-full bg-[#f5f5f5] px-2 py-1 text-xs font-medium text-[#525252]"
                    >
                        <span className="max-w-[120px] truncate">{organizer.displayName ?? organizer.email}</span>
                        <button
                            type="button"
                            className="text-[#737373] hover:text-[#de3336]"
                            aria-label={`Xóa ${organizer.displayName ?? organizer.email}`}
                            onClick={(event) => {
                                event.stopPropagation()
                                removeOrganizer(organizer)
                            }}
                        >
                            ×
                        </button>
                    </span>
                ))}
                onSelect={selectOrganizer}
            />
            {validationError ? <span className="mt-1.5 block text-xs text-[#de3336]">{validationError}</span> : null}
            {isError && !validationError ? (
                <span className="mt-1.5 block text-xs text-[#de3336]">
                    {queryError instanceof Error ? queryError.message : 'Không thể tải danh sách quản trạm'}
                </span>
            ) : null}
        </div>
    );
}