import type { IconProps } from '@/core/shared/types'

export const TrashGlyph = ({ className }: IconProps) => {
    const svgClassName = ['h-5 w-5 shrink-0', className].filter(Boolean).join(' ')

    return (
        <svg
            className={svgClassName}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
        </svg>
    )
} 
