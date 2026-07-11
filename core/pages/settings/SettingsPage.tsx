import { useState } from 'react'
import { MovePanel, MoveSwitch, useToast } from '@/core/shared'
import { getMoveSettings, saveMoveSettings } from '@/core/shared/lib'

export const SettingsPage = () => {
  const { toast } = useToast()
  const [settings, setSettings] = useState(() => getMoveSettings())

  return (
    <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
      <section className="w-full">
        <MovePanel>
          <div className="border-b border-[#f1ebe8] px-5 py-4">
            <p className="text-sm text-[#8b8580]">Chỉnh các thiết lập hiển thị chung cho hệ thống.</p>
          </div>

          <div className="px-5 py-5">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#f0eae7] bg-[#fcfbfa] px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff4db] text-[#c4881b]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M12 2.25a.75.75 0 0 1 .673.418l2.087 4.227 4.666.678a.75.75 0 0 1 .416 1.279l-3.376 3.291.797 4.647a.75.75 0 0 1-1.088.79L12 15.384l-4.173 2.196a.75.75 0 0 1-1.088-.79l.797-4.647L4.16 8.852a.75.75 0 0 1 .416-1.279l4.666-.678 2.087-4.227A.75.75 0 0 1 12 2.25Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#353232]">Leader board</p>
                  <p className="text-xs text-[#8b8580]">
                    {settings.leaderboardVisible
                      ? 'Bảng xếp hạng đang được hiển thị trên giao diện sự kiện'
                      : 'Ẩn bảng xếp hạng trên giao diện sự kiện'}
                  </p>
                </div>
              </div>

              <MoveSwitch
                checked={settings.leaderboardVisible}
                onChange={(checked) => {
                  const nextState = { leaderboardVisible: checked }
                  setSettings(nextState)

                  if (!saveMoveSettings(nextState)) {
                    toast({
                      title: 'Thông báo',
                      description: 'Không thể lưu cấu hình trên trình duyệt hiện tại.',
                    })
                    return
                  }

                  toast({
                    title: 'Thông báo',
                    description: checked ? 'Đã bật bảng xếp hạng.' : 'Đã ẩn bảng xếp hạng.',
                  })
                }}
              />
            </div>
          </div>
        </MovePanel>
      </section>
    </main>
  )
}
