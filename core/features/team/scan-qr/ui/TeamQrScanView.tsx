export const TeamQrScanView = () => (
  <section className="flex min-h-[calc(100svh-128px)] flex-col items-center px-5 pt-16">
    <h1 className="text-[22px] leading-7 text-[#111]">Quét mã QR</h1>

    <div className="relative mt-12 size-[250px]">
      <div className="absolute inset-0 border border-[#5d0004]" />
      <div className="absolute inset-[36px] border border-[#d5d5d5]" />
      <span className="absolute -left-1 -top-1 h-10 w-10 border-l-4 border-t-4 border-[#5d0004]" />
      <span className="absolute -right-1 -top-1 h-10 w-10 border-r-4 border-t-4 border-[#5d0004]" />
      <span className="absolute -bottom-1 -left-1 h-10 w-10 border-b-4 border-l-4 border-[#5d0004]" />
      <span className="absolute -bottom-1 -right-1 h-10 w-10 border-b-4 border-r-4 border-[#5d0004]" />
    </div>
  </section>
)
