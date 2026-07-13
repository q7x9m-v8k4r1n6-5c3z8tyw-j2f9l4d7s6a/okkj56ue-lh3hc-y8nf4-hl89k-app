import { SearchBox } from '@/core/shared'
import { useTeamMutation } from '../../hooks'
import type { TeamModel, TeamSearchMode } from '../../models'
import { useTeamSearchBox } from './useTeamSearchBox'

type TeamSearchBoxProps = {
    type?: TeamSearchMode
    value?: TeamModel[]
    error?: string
    placeholder?: string
    onChange: (teams: TeamModel[]) => void
}

export const TeamSearchBox = ({
    error: validationError,
    onChange,
    placeholder = 'Tìm đội chơi',
    type = 'single',
    value = [],
}: TeamSearchBoxProps) => {
    const {
        data: teams = [],
        isLoading,
        isError,
        error: queryError,
    } = useTeamMutation()

    const {
        hasValue,
        options,
        removeTeam,
        selectedKey,
        selectTeam,
    } = useTeamSearchBox({ data: teams, onChange, type, value })

    return (
        <div className="min-w-0">
            <SearchBox
                key={selectedKey}
                options={options}
                placeholder={hasValue ? '' : placeholder}
                emptyText={isLoading ? 'Đang tải đội chơi...' : isError ? 'Không thể tải danh sách đội chơi' : 'Không tìm thấy đội chơi'}
                clearOnSelect
                inputClassName={hasValue ? 'border-[#eeeeee] bg-[#fcfcfc]' : 'h-10 border-[#eeeeee] bg-[#fcfcfc]'}
                selectedContent={value.map((team) => (
                    <span
                        key={team.id}
                        className="inline-flex h-6 max-w-full items-center gap-1 rounded-full bg-[#f5f5f5] px-2 py-1 text-xs font-medium text-[#525252]"
                    >
                        <span className="max-w-[120px] truncate">{team.name}</span>
                        <button
                            type="button"
                            className="text-[#737373] hover:text-[#de3336]"
                            aria-label={`Xóa ${team.name}`}
                            onClick={(event) => {
                                event.stopPropagation()
                                removeTeam(team)
                            }}
                        >
                            ×
                        </button>
                    </span>
                ))}
                onSelect={selectTeam}
            />
            {validationError ? <span className="mt-1.5 block text-xs text-[#de3336]">{validationError}</span> : null}
            {isError && !validationError ? (
                <span className="mt-1.5 block text-xs text-[#de3336]">
                    {queryError instanceof Error ? queryError.message : 'Không thể tải danh sách đội chơi'}
                </span>
            ) : null}
        </div>
    );
}
