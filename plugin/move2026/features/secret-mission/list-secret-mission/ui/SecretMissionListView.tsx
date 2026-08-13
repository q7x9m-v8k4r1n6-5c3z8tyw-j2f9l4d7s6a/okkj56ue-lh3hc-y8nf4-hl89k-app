import { useNavigate, useParams } from 'react-router-dom'
import { Table, TableBody, TableCell, TableRow, Skeleton } from '@/core/shared'
import { formatGmt7Time } from '@/core/shared/utils'
import { ReturnHeader } from '../../../../shared/ui/ReturnHeader'
import { useSecretMissionOverviewQuery } from '../model/server/useSecretMissionOverviewQuery'

export const SecretMissionListView = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const navigate = useNavigate()
  
  const query = useSecretMissionOverviewQuery(raceId)
  
  const handleBack = () => {
    navigate(`/team/races/${raceId}?tab=more`)
  }

  const handleRowClick = (missionId: string) => {
    navigate(`/team/races/${raceId}/secret-missions/${missionId}`)
  }

  return (
    <div className="flex h-full flex-col">
      <ReturnHeader title="Danh sách các nhiệm vụ bí mật" onBack={handleBack} />

      <main className="flex-1 px-3">
        <div className="overflow-hidden rounded-[20px] border border-[#e2e2e2] bg-white shadow-sm">
          <Table>
            <TableBody>
              {query.isLoading ? (
                <>
                  <TableRow><TableCell><Skeleton lines={1} className="h-5 w-1/2" /></TableCell></TableRow>
                  <TableRow><TableCell><Skeleton lines={1} className="h-5 w-1/3" /></TableCell></TableRow>
                  <TableRow><TableCell><Skeleton lines={1} className="h-5 w-2/3" /></TableCell></TableRow>
                </>
              ) : query.isError ? (
                <TableRow>
                  <TableCell className="text-center italic text-red-500 py-10">
                    Không thể tải danh sách nhiệm vụ.
                  </TableCell>
                </TableRow>
              ) : query.data?.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center italic text-gray-400 py-10">
                    Chưa có nhiệm vụ bí mật nào.
                  </TableCell>
                </TableRow>
              ) : (
                query.data?.map((mission) => (
                  <TableRow 
                    key={mission.id} 
                    className="cursor-pointer transition-colors hover:bg-gray-50 active:bg-gray-100"
                    onClick={() => handleRowClick(mission.id)}
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
      </main>
    </div>
  )
}