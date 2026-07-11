export const MoveSwitch = ({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    className={`relative inline-flex h-8 w-14 items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${checked ? 'border-[#ef4444] bg-[#ef4444]' : 'border-[#dfd7d2] bg-[#f4f1ef]'}`}
    onClick={() => onChange(!checked)}
  >
    <span
      className={`absolute left-1 h-6 w-6 rounded-full bg-white shadow-[0_3px_8px_rgba(15,23,42,0.18)] transition-transform ${checked ? 'translate-x-6' : ''}`}
    />
  </button>
)
