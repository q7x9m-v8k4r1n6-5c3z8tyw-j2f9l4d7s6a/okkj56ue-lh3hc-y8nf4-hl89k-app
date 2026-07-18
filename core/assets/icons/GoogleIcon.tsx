import type { IconProps } from '@/core/shared/types'
import {GoogleIconimg} from '../images'

export const GoogleIcon = ({ className }: IconProps) => (
  <img 
    src={GoogleIconimg} 
    className={className} 
    alt="Google" 
    aria-hidden="true" 
  />
)
