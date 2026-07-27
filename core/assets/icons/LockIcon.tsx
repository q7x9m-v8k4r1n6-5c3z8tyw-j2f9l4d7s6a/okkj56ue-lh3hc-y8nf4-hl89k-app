import type { IconProps } from './icon.type'
import {LockIconImg} from '../images'

export const LockIcon = ({ className }: IconProps) => (
  <img 
    src={LockIconImg} 
    className={className} 
    alt="Google" 
    aria-hidden="true" 
  />
)
