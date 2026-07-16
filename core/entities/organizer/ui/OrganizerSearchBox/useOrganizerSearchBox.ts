import { useMemo } from 'react'
import type { SearchOption } from '@/core/shared'
import type { OrganizerModel, OrganizerSearchMode } from '../../models'

type UseOrganizerSearchBoxParams = {
    data: any 
    type: OrganizerSearchMode
    value: OrganizerModel[]
    onChange: (organizers: OrganizerModel[]) => void
}

export const useOrganizerSearchBox = ({ data, onChange, type, value }: UseOrganizerSearchBoxParams) => {
    const selectedIds = useMemo(() => new Set(value.map((organizer) => organizer.id)), [value])
    
    const safeItems = useMemo<OrganizerModel[]>(() => {
        const rawList = data?.data ?? data?.items ?? data;
        return Array.isArray(rawList) ? rawList : [];
    }, [data])

    const options = useMemo<SearchOption[]>(
        () => safeItems
            .filter((organizer: OrganizerModel) => !selectedIds.has(organizer.id))
            .map((organizer: OrganizerModel) => ({ id: organizer.id, label: organizer.displayName ?? organizer.email })),
        [safeItems, selectedIds],
    )

    const selectedKey = useMemo(
        () => value.map((organizer) => organizer.id).join('|'),
        [value],
    )

    const removeOrganizer = (organizer: OrganizerModel) => {
        onChange(value.filter((item) => item.id !== organizer.id))
    }

    const selectOrganizer = (option: SearchOption) => {
        const organizer = safeItems.find((item: OrganizerModel) => item.id === option.id)
        if (!organizer) return
        onChange(type === 'single' ? [organizer] : [...value, organizer])
    }

    return {
        hasValue: value.length > 0,
        options,
        removeOrganizer, 
        selectedKey,     
        selectOrganizer,
    }
}