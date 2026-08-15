const padDateTimePart = (value: number) => value.toString().padStart(2, '0')
const GMT7_OFFSET_MILLISECONDS = 7 * 60 * 60 * 1000
const timezonePattern = /(?:Z|[+-]\d{2}:\d{2})$/i

type DateTimeParts = {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  second: string
}

const formatDateTimeParts = (parts: DateTimeParts) => (
  `${Number(parts.day)}/${Number(parts.month)}/${parts.year} ${parts.hour}:${parts.minute}:${parts.second}`
)

const getGmt7PartsFromDate = (date: Date) => {
  const gmt7Date = new Date(date.getTime() + GMT7_OFFSET_MILLISECONDS)

  return {
    year: gmt7Date.getUTCFullYear().toString(),
    month: padDateTimePart(gmt7Date.getUTCMonth() + 1),
    day: padDateTimePart(gmt7Date.getUTCDate()),
    hour: padDateTimePart(gmt7Date.getUTCHours()),
    minute: padDateTimePart(gmt7Date.getUTCMinutes()),
    second: padDateTimePart(gmt7Date.getUTCSeconds()),
  }
}

const getDateTimeParts = (value: string) => {
  const rawParts = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/,
  )
  if (rawParts) {
    return {
      year: rawParts[1],
      month: rawParts[2],
      day: rawParts[3],
      hour: rawParts[4] ?? '00',
      minute: rawParts[5] ?? '00',
      second: rawParts[6] ?? '00',
    }
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return getGmt7PartsFromDate(date)
}

/** Formats a backend local date-time, or a timezone-aware instant, for display. */
export const formatDateTime = (value: string) => {
  if (timezonePattern.test(value)) return formatGmt7DateTime(value)

  const parts = getDateTimeParts(value)
  if (!parts) return value

  return formatDateTimeParts(parts)
}

/** Converts an instant to GMT+7 and formats it for display. */
export const formatGmt7DateTime = (value: string) => {
  const isLocalDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/
    .test(value)
  const normalizedValue = !timezonePattern.test(value) && isLocalDateTime
    ? `${value}Z`
    : value
  const date = new Date(normalizedValue)
  if (Number.isNaN(date.getTime())) return value

  return formatDateTimeParts(getGmt7PartsFromDate(date))
}

/** Converts a date-time value to the GMT+7 format expected by the backend. */
export const toGmt7ApiDateTime = (value: string | Date) => {
  if (value instanceof Date) {
    return toGmt7ApiDateTimeFromParts(getGmt7PartsFromDate(value))
  }

  const parts = getDateTimeParts(value)
  if (parts && !timezonePattern.test(value)) {
    return toGmt7ApiDateTimeFromParts(parts)
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return toGmt7ApiDateTimeFromParts(getGmt7PartsFromDate(date))
}
/** Converts an instant to GMT+7 and formats it as HH:mm for display. */
export const formatGmt7Time = (value: string) => {
  const isLocalDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(value)
  const normalizedValue = !timezonePattern.test(value) && isLocalDateTime
    ? `${value}Z`
    : value
  const date = new Date(normalizedValue)
  if (Number.isNaN(date.getTime())) return value

  const parts = getGmt7PartsFromDate(date)
  
  return `${parts.hour}:${parts.minute}`
}

/** Returns the current instant in the backend GMT+7 date-time format. */
export const getCurrentGmt7DateTime = () => toGmt7ApiDateTime(new Date())

const toGmt7ApiDateTimeFromParts = (parts: DateTimeParts) => (
  `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`
)
