import type { IconProps } from './icon.type'
import {UserIconImg} from '../images'

export const UserIcon = ({ className }: IconProps) => (
  <img 
    src={UserIconImg} 
    className={className} 
    alt="Google" 
    aria-hidden="true" 
  />
)
