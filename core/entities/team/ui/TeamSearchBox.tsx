import { SearchBox } from '@/core/shared'
import {
  useTeamSearchBox,
  type TeamSearchBoxProps,
} from './useTeamSearchBox'

/**
 * Renders reusable team search and selection UI.
 */
export const TeamSearchBox = (props: TeamSearchBoxProps) => {
  const searchBox = useTeamSearchBox(props)

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
        selectedContent={searchBox.selectedItems.map((team) => (
          <span
            key={team.id}
            className="inline-flex h-6 max-w-full items-center gap-1 rounded-full bg-[#f5f5f5] px-2 py-1 text-xs font-medium text-[#525252]"
          >
            <span className="max-w-[120px] truncate">{team.name}</span>
            <button
              type="button"
              className="text-[#737373] hover:text-[#de3336]"
              aria-label={`Xóa ${team.name}`}
              onClick={team.onRemove}
            >
              ×
            </button>
          </span>
        ))}
        onSelect={searchBox.selectTeam}
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
