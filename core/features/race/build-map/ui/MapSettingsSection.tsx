import { useState } from 'react'
import { Switch, useToast } from '@/core/shared'
import { useUpdateRaceMapSettingsMutation } from '../model/server/useUpdateRaceMapSettingsMutation'

export interface MapSettingsValues {
  isShowHiddenBooths?: boolean
  isHideBoothDescription?: boolean
  isDisabledBoothStatus?: boolean
  modifiedAt?: string
}

export interface MapSettingsSectionProps {
  raceId?: string
  isFrozen?: boolean
  settings?: MapSettingsValues
  onToggleHiddenBooths?: (checked: boolean) => void
  onToggleDescription?: (checked: boolean) => void
  onToggleDisabledStatus?: (checked: boolean) => void
}

/**
 * Admin Map Settings Section component implemented according to Figma node 1254:1268.
 * Provides 3 configuration toggles for station visibility, challenge descriptions, and status display.
 * Automatically saves updates via PATCH /Race/{raceId} with toast feedback and respects isFrozen mode.
 */
export const MapSettingsSection = ({
  raceId,
  isFrozen = false,
  settings,
  onToggleHiddenBooths,
  onToggleDescription,
  onToggleDisabledStatus,
}: MapSettingsSectionProps) => {
  const { toast } = useToast()
  const updateMutation = useUpdateRaceMapSettingsMutation(raceId)

  const [localSettings, setLocalSettings] = useState<MapSettingsValues>(() => ({
    isShowHiddenBooths: Boolean(settings?.isShowHiddenBooths),
    isHideBoothDescription: Boolean(settings?.isHideBoothDescription),
    isDisabledBoothStatus: Boolean(settings?.isDisabledBoothStatus),
    modifiedAt: settings?.modifiedAt,
  }))

  const [prevPropSettings, setPrevPropSettings] = useState(settings)
  if (settings !== prevPropSettings) {
    setPrevPropSettings(settings)
    setLocalSettings({
      isShowHiddenBooths: Boolean(settings?.isShowHiddenBooths),
      isHideBoothDescription: Boolean(settings?.isHideBoothDescription),
      isDisabledBoothStatus: Boolean(settings?.isDisabledBoothStatus),
      modifiedAt: settings?.modifiedAt,
    })
  }

  const isSwitchDisabled = isFrozen || updateMutation.isPending

  const handleToggleSetting = (
    key: 'isShowHiddenBooths' | 'isHideBoothDescription' | 'isDisabledBoothStatus',
    nextValue: boolean,
    customHandler?: (checked: boolean) => void,
  ) => {
    if (isFrozen || updateMutation.isPending) return

    if (customHandler) {
      customHandler(nextValue)
      return
    }

    if (!raceId || !raceId.trim()) {
      toast({
        title: 'Thiếu thông tin trận đấu',
        description: 'Không tìm thấy mã trận đấu để lưu cài đặt.',
        variant: 'danger',
      })
      return
    }

    const prevValue = Boolean(localSettings[key])
    setLocalSettings((prev) => ({ ...prev, [key]: nextValue }))

    updateMutation.mutate(
      {
        expectedModifiedAt: localSettings.modifiedAt || new Date().toISOString(),
        raceSettings: {
          [key]: nextValue,
        },
      },
      {
        onSuccess: (updatedRace) => {
          setLocalSettings((prev) => ({
            ...prev,
            modifiedAt: updatedRace.modifiedAt,
          }))
          toast({
            title: 'Thành công',
            description: 'Cập nhật cài đặt bản đồ thành công.',
            variant: 'success',
          })
        },
        onError: (error) => {
          setLocalSettings((prev) => ({ ...prev, [key]: prevValue }))
          toast({
            title: 'Cập nhật thất bại',
            description:
              error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật cài đặt bản đồ.',
            variant: 'danger',
          })
        },
      },
    )
  }

  return (
    <section
      aria-label="Cài đặt bản đồ"
      className="mt-4 rounded-xl border border-[#e5e5e5] bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold uppercase text-black">CÀI ĐẶT BẢN ĐỒ</h3>
        {isFrozen && (
          <span className="text-xs font-medium text-[#737373] bg-[#f5f5f5] px-2.5 py-1 rounded-md">
            Chỉ đọc (Trận đấu đã khóa)
          </span>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-[#e5e5e5] shadow-xs">
        {/* Table Header */}
        <div className="grid grid-cols-[1.2fr_2fr_80px] bg-[#fafafa] px-6 py-3 text-xs font-medium text-[#525252]">
          <span>Nội dung</span>
          <span>Chi tiết</span>
          <span />
        </div>

        {/* Row 1: Hiện vị trí trạm ẩn trên bản đồ */}
        <div className="grid min-h-[72px] grid-cols-[1.2fr_2fr_80px] items-center border-t border-[#f5f5f5] px-6 text-sm text-[#525252]">
          <span className="font-medium text-[#111111]">Hiện vị trí trạm ẩn trên bản đồ</span>
          <span className="leading-relaxed">
            Khi bật, các trạm được đánh dấu là &apos;trạm ẩn&apos; sẽ được hiển thị trên bản đồ của đội chơi.
          </span>
          <div className="flex justify-end">
            <Switch
              checked={Boolean(localSettings.isShowHiddenBooths)}
              disabled={isSwitchDisabled}
              onChange={(checked) =>
                handleToggleSetting('isShowHiddenBooths', checked, onToggleHiddenBooths)
              }
            />
          </div>
        </div>

        {/* Row 2: Ẩn mô tả trạm */}
        <div className="grid min-h-[72px] grid-cols-[1.2fr_2fr_80px] items-center border-t border-[#f5f5f5] px-6 text-sm text-[#525252]">
          <span className="font-medium text-[#111111]">Ẩn mô tả trạm</span>
          <span className="leading-relaxed">
            Khi bật, nội dung mô tả chi tiết của trạm sẽ bị ẩn trên bản đồ của đội chơi.
          </span>
          <div className="flex justify-end">
            <Switch
              checked={Boolean(localSettings.isHideBoothDescription)}
              disabled={isSwitchDisabled}
              onChange={(checked) =>
                handleToggleSetting('isHideBoothDescription', checked, onToggleDescription)
              }
            />
          </div>
        </div>

        {/* Row 3: Tắt hiển thị trạng thái trạm (Toàn bộ màu đỏ) */}
        <div className="grid min-h-[72px] grid-cols-[1.2fr_2fr_80px] items-center border-t border-[#f5f5f5] px-6 text-sm text-[#525252]">
          <span className="font-medium text-[#111111]">Tắt hiển thị trạng thái trạm (Toàn bộ màu đỏ)</span>
          <span className="leading-relaxed">
            Khi bật, bản đồ của đội chơi sẽ không hiển thị trạng thái trống/bận.
          </span>
          <div className="flex justify-end">
            <Switch
              checked={Boolean(localSettings.isDisabledBoothStatus)}
              disabled={isSwitchDisabled}
              onChange={(checked) =>
                handleToggleSetting('isDisabledBoothStatus', checked, onToggleDisabledStatus)
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}
