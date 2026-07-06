import type { PropsWithChildren } from 'react'

export const AppLayout = ({ children }: PropsWithChildren) => {
  return <div className="min-h-svh bg-white text-slate-950">{children}</div>
}
