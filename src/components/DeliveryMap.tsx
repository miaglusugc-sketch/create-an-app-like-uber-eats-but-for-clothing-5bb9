import { useEffect, useRef, useState } from 'react'
import { Store as StoreIcon, Home, Bike } from 'lucide-react'

/**
 * A stylized, self-contained delivery map. A courier marker travels along a
 * route from the boutique to the customer's home based on `progress` (0..1).
 * `active` toggles whether the courier is en route (moving) or waiting at the store.
 */
export function DeliveryMap({
  progress,
  moving,
  delivered,
}: {
  progress: number
  moving: boolean
  delivered: boolean
}) {
  const pathRef = useRef<SVGPathElement | null>(null)
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 56, y: 70 })

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    const p = path.getPointAtLength(len * Math.min(1, Math.max(0, progress)))
    setPos({ x: p.x, y: p.y })
  }, [progress])

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#e8ecf1] shadow-soft">
      <svg viewBox="0 0 400 260" className="h-full w-full">
        {/* base */}
        <rect width="400" height="260" fill="#e9edf2" />

        {/* parks / blocks */}
        <g opacity="0.9">
          <rect x="20" y="24" width="90" height="60" rx="8" fill="#d7e6d2" />
          <rect x="250" y="30" width="120" height="70" rx="8" fill="#dbe3ec" />
          <rect x="30" y="150" width="120" height="80" rx="8" fill="#dbe3ec" />
          <rect x="230" y="160" width="140" height="72" rx="8" fill="#d7e6d2" />
          <rect x="170" y="20" width="60" height="55" rx="8" fill="#e2d9ec" />
        </g>

        {/* streets */}
        <g stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.9">
          <line x1="0" y1="120" x2="400" y2="120" />
          <line x1="0" y1="200" x2="400" y2="200" />
          <line x1="130" y1="0" x2="130" y2="260" />
          <line x1="220" y1="0" x2="220" y2="260" />
          <line x1="320" y1="0" x2="320" y2="260" />
        </g>
        <g stroke="#c7d0db" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.7">
          <line x1="0" y1="120" x2="400" y2="120" />
          <line x1="0" y1="200" x2="400" y2="200" />
          <line x1="130" y1="0" x2="130" y2="260" />
          <line x1="220" y1="0" x2="220" y2="260" />
          <line x1="320" y1="0" x2="320" y2="260" />
        </g>

        {/* route (dotted base + progress) */}
        <path
          ref={pathRef}
          d="M56 70 C 120 70, 120 120, 130 120 S 210 120, 220 160 S 300 200, 344 196"
          fill="none"
          stroke="#b9c2cf"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="2 9"
        />
        <RouteProgress progress={progress} />

        {/* store pin */}
        <g transform="translate(56 70)">
          <circle r="15" fill="#0f0d1a" />
          <circle r="15" fill="none" stroke="#fff" strokeWidth="2" />
        </g>

        {/* home pin */}
        <g transform="translate(344 196)">
          <circle r="15" fill="#ff2d55" />
          <circle r="15" fill="none" stroke="#fff" strokeWidth="2" />
        </g>

        {/* courier */}
        <g transform={`translate(${pos.x} ${pos.y})`}>
          {moving && !delivered && (
            <circle r="16" fill="#12c98a" opacity="0.5" className="origin-center animate-pulse-ring" />
          )}
          <circle r="13" fill="#12c98a" stroke="#fff" strokeWidth="2.5" className={moving && !delivered ? 'animate-float' : ''} />
        </g>
      </svg>

      {/* icon overlays (crisp lucide icons on top of the svg pins) */}
      <PinIcon x={56} y={70}>
        <StoreIcon className="h-4 w-4 text-white" />
      </PinIcon>
      <PinIcon x={344} y={196}>
        <Home className="h-4 w-4 text-white" />
      </PinIcon>
      <PinIcon x={pos.x} y={pos.y}>
        <Bike className="h-4 w-4 text-white" />
      </PinIcon>
    </div>
  )
}

function RouteProgress({ progress }: { progress: number }) {
  const ref = useRef<SVGPathElement | null>(null)
  const [len, setLen] = useState(0)
  useEffect(() => {
    if (ref.current) setLen(ref.current.getTotalLength())
  }, [])
  return (
    <path
      ref={ref}
      d="M56 70 C 120 70, 120 120, 130 120 S 210 120, 220 160 S 300 200, 344 196"
      fill="none"
      stroke="#12c98a"
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - Math.min(1, Math.max(0, progress)))}
      style={{ transition: 'stroke-dashoffset 1s linear' }}
    />
  )
}

/** Positions a small icon over the SVG coordinate space (viewBox 400x260). */
function PinIcon({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center"
      style={{ left: `${(x / 400) * 100}%`, top: `${(y / 260) * 100}%` }}
    >
      {children}
    </div>
  )
}
