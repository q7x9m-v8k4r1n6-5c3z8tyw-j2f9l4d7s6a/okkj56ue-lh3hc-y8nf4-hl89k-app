export const detailRaceTabs = [
  { value: 'basic', label: 'Thông tin cơ bản' },
  { value: 'live', label: 'Trực tiếp trận đấu' },
  { value: 'cards', label: 'Quản lý thẻ' },
  { value: 'secret', label: 'Quản lý nhiệm vụ bí mật' },
  { value: 'history', label: 'Lịch sử hoạt động' },
  { value: 'message', label: 'Gửi tin nhắn' },
] as const

export type DetailRaceTab = (typeof detailRaceTabs)[number]['value']

/** Checks values received from the generic Tabs component. */
export const isDetailRaceTab = (value: string): value is DetailRaceTab =>
  detailRaceTabs.some((tab) => tab.value === value)
