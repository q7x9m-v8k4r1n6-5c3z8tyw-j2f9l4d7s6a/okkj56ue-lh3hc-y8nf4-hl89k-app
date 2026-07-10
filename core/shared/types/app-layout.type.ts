import type { ComponentType } from 'react'

export type IconProps = {
  className?: string
}

export type NavigationItem = {
  label: string
  title: string
  to: string
  icon: ComponentType<IconProps>
  iconClassName: string
  hidden?: boolean
}
