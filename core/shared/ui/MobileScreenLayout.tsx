import type { PropsWithChildren, ReactNode } from 'react'
import { ReturnHeader } from './ReturnHeader'

export type MobileScreenLayoutProps = PropsWithChildren<{
  title: string
  onBack: () => void
  footer?: ReactNode
  isOverlayFooter?: boolean
  contentClassName?: string
}>

export const MobileScreenLayout = ({
  title,
  onBack,
  footer,
  isOverlayFooter = false,
  contentClassName = 'px-5',
  children,
}: MobileScreenLayoutProps) => {
  return (
    <div className="absolute inset-0 z-10 h-full w-full overflow-hidden bg-white">
      
      <header className="absolute top-0 left-0 right-0 z-20 bg-white shadow-[0_5px_5px_0px_rgba(255,255,255,0.95)]">
        <ReturnHeader title={title} onBack={onBack} />
      </header>

      <main className={`h-full w-full overflow-y-auto pt-14 pb-28 ${contentClassName}`}>
        {children}
      </main>

      {footer ? (
        isOverlayFooter ? (
          <footer className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-between bg-transparent px-4 pointer-events-none [&>*]:pointer-events-auto">
            {footer}
          </footer>
        ) : (
          <footer className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-7 pointer-events-none [&>*]:pointer-events-auto">
            {footer}
          </footer>
        )
      ) : null}
    </div>
  )
}