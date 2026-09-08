import { IconStar } from './icons';

export function Stars({ value, className = '' }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <IconStar className="h-3.5 w-3.5 text-amber-500" />
      <span className="font-semibold text-ink">{value.toFixed(1)}</span>
    </span>
  );
}

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-pop">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 4 5 6l2 3 1-1v11h8V8l1 1 2-3-3-2-2 1a2.5 2.5 0 0 1-4 0Z" />
        </svg>
      </span>
      <span className="text-xl font-extrabold tracking-tight text-ink">
        Thread<span className="text-brand-500">ly</span>
      </span>
    </span>
  );
}
