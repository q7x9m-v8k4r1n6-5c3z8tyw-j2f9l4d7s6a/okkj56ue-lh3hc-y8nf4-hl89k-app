export type SwitchProps = { checked: boolean; disabled?: boolean; onChange: (checked: boolean) => void }

export const Switch = ({ checked, disabled, onChange }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    className={`relative inline-flex h-8 w-14 items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${checked ? 'border-[#de3336] bg-[#de3336]' : 'border-[#d4d4d4] bg-[#f5f5f5]'}`}
    onClick={() => onChange(!checked)}
  >
    <span className={`absolute left-1 size-6 rounded-full bg-white shadow-[0_3px_8px_rgba(15,23,42,0.18)] transition-transform ${checked ? 'translate-x-6' : ''}`} />
  </button>
)
