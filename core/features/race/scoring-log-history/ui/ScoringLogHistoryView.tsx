import { HistoryIcon } from '@/core/assets'
import { Button, Skeleton, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/core/shared'
import { ScoringReasonFilter } from './components/ScoringReasonFilter'
import { useScoringLogHistory } from './hooks/useScoringLogHistory'

const scoreToneClassName = {
  negative: '!text-[#de3336]',
  neutral: '!text-[#525252]',
  positive: '!text-[#008f61]',
} as const

const tableRadiusClassName = 'rounded-[14px]'

const scoringLogHistoryColumnWidth = {
  reason: '48%',
  score: '13.7%',
  team: '26.1%',
  time: '12.2%',
} as const

const cellBorderClassName = 'border-r border-[#eeeeee]'
const headerTextClassName = `h-[49px] bg-[#fafafa] px-6 !text-sm font-medium leading-[49px] text-[#323232] ${cellBorderClassName}`
const filterHeaderCellClassName = `relative z-30 bg-[#fafafa] p-0 ${cellBorderClassName}`
const bodyCellClassName = 'h-[49px] border-r border-[#eeeeee] px-6 align-middle text-sm'

export const ScoringLogHistoryView = () => {
  const history = useScoringLogHistory()

  return (
    <section className="flex min-h-full flex-col bg-white" aria-labelledby="scoring-log-history-title">
      <div className="w-full">
        <div className="flex h-[34px] items-center justify-between">
          <div className="flex items-center gap-3">
            <HistoryIcon className="size-5 text-[#323232]" />
            <h2 id="scoring-log-history-title" className="text-xl font-semibold leading-none text-[#323232]">
              Lịch sử hoạt động
            </h2>
          </div>
          <button
            type="button"
            className="box-border flex shrink-0 items-center justify-center border border-[#e2e2e2] bg-white p-0 text-sm font-normal leading-none text-[#333333] transition hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#de3336]/10"
            style={{ borderRadius: 8.5, height: 34, width: 168 }}
            onClick={history.resetFilters}
          >
            Đặt lại
          </button>
        </div>

        <div className={`relative z-0 mt-4 border border-[#eeeeee] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${tableRadiusClassName}`}>
          <Table
            className="table-fixed"
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
            wrapperClassName={`overflow-visible ${tableRadiusClassName}`}
          >
            <colgroup>
              <col style={{ width: scoringLogHistoryColumnWidth.score }} />
              <col style={{ width: scoringLogHistoryColumnWidth.team }} />
              <col style={{ width: scoringLogHistoryColumnWidth.reason }} />
              <col style={{ width: scoringLogHistoryColumnWidth.time }} />
            </colgroup>

            <TableHead className="bg-transparent">
              <TableRow className="relative z-20 border-b border-[#eeeeee]">
                <TableHeaderCell className={`${filterHeaderCellClassName} rounded-tl-[14px] [&_button]:rounded-tl-[14px]`}>
                  <ScoringReasonFilter
                    label="Điểm"
                    options={history.scoreOptions}
                    value={history.score}
                    onChange={history.setScore}
                  />
                </TableHeaderCell>
                <TableHeaderCell className={filterHeaderCellClassName}>
                  <ScoringReasonFilter
                    label="Đội"
                    options={history.teamOptions}
                    value={history.team}
                    onChange={history.setTeam}
                  />
                </TableHeaderCell>
                <TableHeaderCell className={filterHeaderCellClassName}>
                  <ScoringReasonFilter
                    label="Lý do"
                    options={history.reasonOptions}
                    value={history.reason}
                    menuWidthClassName="w-[420px]"
                    onChange={history.setReason}
                  />
                </TableHeaderCell>
                <TableHeaderCell
                  className={`${headerTextClassName} rounded-tr-[14px] border-r-0 text-center`}
                  style={{ width: scoringLogHistoryColumnWidth.time }}
                >
                  Thời gian
                </TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {history.isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="rounded-b-[14px] text-center">
                    <Skeleton lines={5} className="py-4" />
                  </TableCell>
                </TableRow>
              ) : null}

              {history.isError ? (
                <TableRow>
                  <TableCell colSpan={4} className="rounded-b-[14px] text-center">
                    <p className="text-sm text-[#de3336]">Không thể tải lịch sử hoạt động.</p>
                    <Button className="mt-3" size="sm" variant="secondary" onClick={() => void history.retry()}>
                      Thử lại
                    </Button>
                  </TableCell>
                </TableRow>
              ) : null}

              {!history.isLoading && !history.isError && history.visibleItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="rounded-b-[14px] text-center italic text-[#9a9a9a]">
                    Chưa có hoạt động nào.
                  </TableCell>
                </TableRow>
              ) : null}

              {!history.isLoading && !history.isError ? history.visibleItems.map((item, index) => {
                const isLastRow = index === history.visibleItems.length - 1

                return (
                  <TableRow key={item.id} className="border-[#eeeeee]">
                    <TableCell className={`${bodyCellClassName} ${isLastRow ? 'rounded-bl-[14px]' : ''} font-semibold ${scoreToneClassName[item.scoreTone]}`}>
                      {item.score}
                    </TableCell>
                    <TableCell className={`${bodyCellClassName} font-medium text-[#404040]`}>{item.teamName}</TableCell>
                    <TableCell className={`${bodyCellClassName} text-[#525252]`}>{item.reason}</TableCell>
                    <TableCell className={`${bodyCellClassName} ${isLastRow ? 'rounded-br-[14px]' : ''} border-r-0 text-center text-[#525252]`}>{item.time}</TableCell>
                  </TableRow>
                )
              }) : null}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
