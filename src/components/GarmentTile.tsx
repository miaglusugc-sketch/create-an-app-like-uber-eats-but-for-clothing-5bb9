import { Garment } from './Garment'
import type { GarmentType } from '../types'

/**
 * A decorative tile that displays a garment illustration on a soft
 * studio backdrop. Used across store & product cards.
 */
export function GarmentTile({
  garment,
  color,
  className = '',
  padded = true,
}: {
  garment: GarmentType
  color: string
  className?: string
  padded?: boolean
}) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-ink-50 to-ink-100 ${className}`}>
      {/* soft studio blobs */}
      <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/60 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 rounded-full bg-brand-100/50 blur-2xl" />
      <div className="pointer-events-none absolute inset-x-6 bottom-3 h-3 rounded-[100%] bg-ink-900/10 blur-md" />
      <Garment
        type={garment}
        color={color}
        className={`relative h-full w-full drop-shadow-sm ${padded ? 'p-4' : ''}`}
      />
    </div>
  )
}
