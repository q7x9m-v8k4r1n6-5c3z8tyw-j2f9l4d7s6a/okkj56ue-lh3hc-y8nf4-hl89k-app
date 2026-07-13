export const toText = (value: unknown) => typeof value === 'string' ? value : ''
export const toNumber = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string') {
        const parsed = Number(value)
        if (Number.isFinite(parsed)) return parsed
    }
    return 0
}

export const toIsoString = (value: string) => {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date.toISOString()
}

export const formatDateTime = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date)
}