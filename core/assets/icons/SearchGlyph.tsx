import type { IconProps } from "@/core/shared"

export const SearchGlyph = ({ className }: IconProps) => {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </svg>
    )
}