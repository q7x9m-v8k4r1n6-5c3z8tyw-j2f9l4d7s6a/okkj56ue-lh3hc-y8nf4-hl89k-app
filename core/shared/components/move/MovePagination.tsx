import { ArrowLeftIcon, ArrowRightIcon } from '@/core/assets'
import { Button } from '@/core/shared/components/ui/Button'

type MovePaginationProps = {
  page: number
  totalItems: number
  totalPages: number
  pageSize: number
  onChange: (page: number) => void
}

type PageItem = number | 'ellipsis'

const buildPaginationItems = (page: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (page <= 4) {
    return [1, 2, 3, 'ellipsis', totalPages - 2, totalPages - 1, totalPages]
  }

  if (page >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages]
}

export const MovePagination = ({ onChange, page, pageSize, totalItems, totalPages }: MovePaginationProps) => {
  const safeTotalPages = Math.max(totalPages, 1)
  const safePage = Math.min(Math.max(page, 1), safeTotalPages)
  const startDisplay = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1
  const endDisplay = totalItems === 0 ? 0 : Math.min(totalItems, safePage * pageSize)

  return (
    <div className="flex flex-col gap-3 border-t border-[#f1ebe8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-[#a19a95]">Hiển thị {startDisplay}-{endDisplay} / {totalItems}</p>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <Button
          variant="secondary"
          size="sm"
          disabled={safePage === 1}
          leadingIcon={<ArrowLeftIcon className="h-3 w-3" />}
          onClick={() => onChange(safePage - 1)}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2 text-xs font-medium text-[#8d8782]">
          {buildPaginationItems(safePage, safeTotalPages).map((item, index) => item === 'ellipsis' ? (
            <span className="px-1 text-[#b3aca8]" key={`ellipsis-${index}`}>...</span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === safePage ? 'page' : undefined}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-[0.72rem] font-medium transition-colors ${item === safePage ? 'bg-[#fee2e2] text-[#dc2626]' : 'text-[#8d8782] hover:bg-[#f7f3f1] hover:text-[#4a4542]'}`}
              onClick={() => onChange(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          disabled={safePage === safeTotalPages}
          trailingIcon={<ArrowRightIcon className="h-3 w-3" />}
          onClick={() => onChange(safePage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
