import type { IconProps } from '@/core/shared/types'
import {UserIconImg} from '../images'

export const UserIcon = ({ className }: IconProps) => (
  <img 
    src={UserIconImg} 
    className={className} 
    alt="Google" 
    aria-hidden="true" 
  />
)
