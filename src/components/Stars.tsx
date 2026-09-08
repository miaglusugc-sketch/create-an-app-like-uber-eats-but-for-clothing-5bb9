import { Star } from 'lucide-react'

export function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`${rating} out of 5`}>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="font-semibold text-ink-900">{rating.toFixed(1)}</span>
    </span>
  )
}
