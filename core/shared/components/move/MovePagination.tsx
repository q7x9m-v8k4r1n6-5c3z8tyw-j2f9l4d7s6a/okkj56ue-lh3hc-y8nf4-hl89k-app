import { Pagination } from '@/core/shared/components/ui/Pagination'

type MovePaginationProps = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  onChange: (page: number) => void
}

export const MovePagination = ({ onChange, page, totalPages }: MovePaginationProps) => (
  <Pagination page={page} totalPages={totalPages} onChange={onChange} />
)
