import { Table, TableBody, TableCell, TableRow, Skeleton } from '@/core/shared'
import { formatGmt7Time } from '@/core/shared/utils'
import { PluginScreenLayout } from '@/plugin/move2026/shared/ui/PluginScreenLayout' 
import { useSecretMissionListView } from './hooks/useSecretMissionListView'

export const SecretMissionListView = () => {
  const view = useSecretMissionListView()

  return (
    <PluginScreenLayout
      title="Danh sách các nhiệm vụ bí mật"
      onBack={view.handleBack}
      contentClassName="px-3"
    >
      <div className="overflow-hidden rounded-[20px] border border-[#e2e2e2] bg-white shadow-sm">
        <Table>
          <TableBody>
            {view.isLoading ? (
              <>
                <TableRow><TableCell><Skeleton lines={1} className="h-5 w-1/2" /></TableCell></TableRow>
                <TableRow><TableCell><Skeleton lines={1} className="h-5 w-1/3" /></TableCell></TableRow>
                <TableRow><TableCell><Skeleton lines={1} className="h-5 w-2/3" /></TableCell></TableRow>
              </>
            ) : view.isError ? (
              <TableRow>
                <TableCell className="text-center italic text-red-500 py-10">
                  Không thể tải danh sách nhiệm vụ.
                </TableCell>
              </TableRow>
            ) : view.missions?.length === 0 ? (
              <TableRow>
                <TableCell className="text-center italic text-gray-400 py-10">
                  Chưa có nhiệm vụ bí mật nào.
                </TableCell>
              </TableRow>
            ) : (
              view.missions?.map((mission) => (
                <TableRow 
                  key={mission.id} 
                  className="cursor-pointer transition-colors hover:bg-gray-50 active:bg-gray-100"
                  onClick={() => view.handleRowClick(mission.id)}
                >
                  <TableCell className="flex w-full items-center justify-between gap-4 border-b border-[#f5f5f5] px-5 py-6 last:border-none">
                      <div className="flex max-w-[60%] shrink-0 flex-col items-start">
                          <span
                          className={`block max-w-full truncate text-xs font-medium underline underline-offset-4 ${
                              mission.isCompleted ? 'text-[#166534]' : 'text-[#5e5e5e]'
                          }`}
                          title={mission.name}
                          >
                          {mission.name}
                          </span>
                      </div>

                      {mission.lastUpdatedAt ? (
                          <div className="flex max-w-[30%] shrink-0 flex-col items-end text-right">
                          <span className="text-xs leading-snug text-[#8a8a8a]">
                              Cập nhật lần cuối lúc {formatGmt7Time(mission.lastUpdatedAt)}
                          </span>
                          </div>
                      ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PluginScreenLayout>
  )
}