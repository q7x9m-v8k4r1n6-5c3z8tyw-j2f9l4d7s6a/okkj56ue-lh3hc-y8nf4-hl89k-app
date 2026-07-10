import type { PropsWithChildren } from 'react'

export const MainContainer = ({ children }: PropsWithChildren) => {
  return <main className="min-h-[calc(100svh-61px)] bg-white">{children}</main>
}
