import { SearchBox } from '@/core/shared'
import {
  useOrganizerSearchBox,
  type OrganizerSearchBoxProps,
} from './useOrganizerSearchBox'

/**
 * Renders reusable organizer search and selection UI.
 */
export const OrganizerSearchBox = (props: OrganizerSearchBoxProps) => {
  const searchBox = useOrganizerSearchBox(props)

  return (
    <div className="min-w-0">
      <SearchBox
        key={searchBox.selectedKey}
        options={searchBox.options}
        filterOptions={false}
        onQueryChange={searchBox.onQueryChange}
        placeholder={searchBox.hasValue ? '' : searchBox.placeholder}
        emptyText={searchBox.emptyText}
        clearOnSelect
        inputClassName={searchBox.hasValue
          ? 'border-[#eeeeee] bg-[#fcfcfc]'
          : 'h-10 border-[#eeeeee] bg-[#fcfcfc]'}
        selectedContent={searchBox.selectedItems.map((organizer) => (
          <span
            key={organizer.id}
            className="inline-flex h-6 max-w-full items-center gap-1 rounded-full bg-[#f5f5f5] px-2 py-1 text-xs font-medium text-[#525252]"
          >
            <span className="max-w-[120px] truncate">{organizer.label}</span>
            <button
              type="button"
              className="text-[#737373] hover:text-[#de3336]"
              aria-label={`Xóa ${organizer.label}`}
              onClick={organizer.onRemove}
            >
              ×
            </button>
          </span>
        ))}
        onSelect={searchBox.selectOrganizer}
      />
      {searchBox.validationError ? (
        <span className="mt-1.5 block text-xs text-[#de3336]">
          {searchBox.validationError}
        </span>
      ) : null}
      {searchBox.queryErrorMessage ? (
        <span className="mt-1.5 block text-xs text-[#de3336]">
          {searchBox.queryErrorMessage}
        </span>
      ) : null}
    </div>
  )
}
