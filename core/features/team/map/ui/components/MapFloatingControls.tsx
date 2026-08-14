import { useControls } from 'react-zoom-pan-pinch'

export const MapFloatingControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls()

  return (
    <div className="absolute right-4 bottom-5 z-10 flex flex-col gap-2">
      <button
        onClick={() => resetTransform()}
        className="flex size-11 items-center justify-center rounded-full bg-black/40 text-white shadow-md backdrop-blur-md transition-colors hover:bg-black/60"
        aria-label="Reset Zoom"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
          <circle cx="12" cy="12" r="7" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      </button>
      <button
        onClick={() => zoomIn()}
        className="flex size-11 items-center justify-center rounded-full bg-black/40 text-white shadow-md backdrop-blur-md transition-colors hover:bg-black/60"
        aria-label="Zoom In"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>
      <button
        onClick={() => zoomOut()}
        className="flex size-11 items-center justify-center rounded-full bg-black/40 text-white shadow-md backdrop-blur-md transition-colors hover:bg-black/60"
        aria-label="Zoom Out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
          <path d="M5 12h14" />
        </svg>
      </button>
    </div>
  )
}
