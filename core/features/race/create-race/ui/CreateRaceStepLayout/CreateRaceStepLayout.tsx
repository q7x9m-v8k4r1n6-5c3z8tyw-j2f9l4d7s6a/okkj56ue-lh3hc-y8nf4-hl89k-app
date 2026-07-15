import type { PropsWithChildren, ReactNode } from 'react'

export const CreateRaceStepLayout = ({ step, title, action, children }: PropsWithChildren<{ step: number; title: string; action?: ReactNode }>) => (
  <div className="flex min-h-0 flex-1 flex-col">
    <div className="mb-[30px] flex flex-col items-end gap-4">
      <p className="text-sm text-[#83898c]"><span className="font-medium text-[#de3336]">Step {step}</span>{step < 5 ? ' of 5' : ''}</p>
      <div className="h-3 w-full overflow-hidden rounded-full bg-[#e2e6f9]"><div className="h-full rounded-full bg-[#e93437] transition-[width]" style={{ width: `${step * 20}%` }} /></div>
    </div>
    <div className="mb-[34px] flex min-h-12 items-center justify-between gap-6">
      <h2 className="text-2xl font-bold text-black"><span className="text-[#de3336]">({step}) </span>{title}</h2>
      {action}
    </div>
    {children}
  </div>
)