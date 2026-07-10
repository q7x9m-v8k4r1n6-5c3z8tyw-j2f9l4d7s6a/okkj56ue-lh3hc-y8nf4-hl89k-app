import type { HTMLAttributes, PropsWithChildren, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'

export const Table = ({ children, className = '', ...props }: PropsWithChildren<TableHTMLAttributes<HTMLTableElement>>) => (
  <div className="w-full overflow-x-auto">
    <table className={`w-full border-collapse text-left ${className}`} {...props}>{children}</table>
  </div>
)

export const TableHead = ({ children, className = '', ...props }: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) => (
  <thead className={`bg-[#fafafa] ${className}`} {...props}>{children}</thead>
)

export const TableBody = ({ children, className = '', ...props }: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) => (
  <tbody className={className} {...props}>{children}</tbody>
)

export const TableRow = ({ children, className = '', ...props }: PropsWithChildren<HTMLAttributes<HTMLTableRowElement>>) => (
  <tr className={`border-b border-white ${className}`} {...props}>{children}</tr>
)

export const TableHeaderCell = ({ children, className = '', ...props }: PropsWithChildren<ThHTMLAttributes<HTMLTableCellElement>>) => (
  <th className={`h-11 px-6 py-3 text-xs font-medium leading-[18px] text-[#525252] ${className}`} {...props}>{children}</th>
)

export const TableCell = ({ children, className = '', ...props }: PropsWithChildren<TdHTMLAttributes<HTMLTableCellElement>>) => (
  <td className={`h-[72px] px-6 py-4 text-sm leading-5 text-[#525252] ${className}`} {...props}>{children}</td>
)

export const TableCard = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => (
  <section className={`overflow-hidden rounded-xl border border-[#eeeeee] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] ${className}`}>
    {children}
  </section>
)
