import type { IconProps } from '@/core/shared/types'
import {LockIconImg} from '../images'

export const LockIcon = ({ className }: IconProps) => (
  <img 
    src={LockIconImg} 
    className={className} 
    alt="Google" 
    aria-hidden="true" 
  />
)
