import type { IconProps } from './icon.type'
import {GoogleIconimg} from '../images'

export const GoogleIcon = ({ className }: IconProps) => (
  <img 
    src={GoogleIconimg} 
    className={className} 
    alt="Google" 
    aria-hidden="true" 
  />
)
