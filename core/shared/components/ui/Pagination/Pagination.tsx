import { ArrowLeftIcon, ArrowRightIcon } from '@/core/assets'
import { Button } from '@/core/shared/components/ui/Button'

export type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
  siblingCount?: number
}

type PageItem = number | 'ellipsis'

const getPageItems = (page: number, totalPages: number, siblingCount: number): PageItem[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const items = new Set([1, totalPages])
  for (let value = page - siblingCount; value <= page + siblingCount; value += 1) {
    if (value > 1 && value < totalPages) items.add(value)
  }

  const sorted = [...items].sort((a, b) => a - b)
  const result: PageItem[] = []
  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) result.push('ellipsis')
    result.push(value)
  })
  return result
}

export const Pagination = ({ onChange, page, siblingCount = 1, totalPages }: PaginationProps) => {
  const items = getPageItems(page, totalPages, siblingCount)

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 px-6 py-3" aria-label="Phân trang">
      <Button variant="secondary" disabled={page <= 1} leadingIcon={<ArrowLeftIcon className="size-5" />} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <div className="flex items-center gap-0.5">
        {items.map((item, index) => item === 'ellipsis' ? (
          <span className="grid size-10 place-items-center text-sm text-[#737373]" key={`ellipsis-${index}`}>...</span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? 'page' : undefined}
            className={`size-10 rounded-lg text-sm font-medium transition-colors ${item === page ? 'bg-[#fce0e0] text-[#de3336]' : 'text-[#737373] hover:bg-[#fafafa]'}`}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <Button variant="secondary" disabled={page >= totalPages} trailingIcon={<ArrowRightIcon className="size-5" />} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </nav>
  )
}
