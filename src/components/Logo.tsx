export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-2xl bg-brand-500 shadow-glow">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
          {/* needle & thread mark */}
          <path
            d="M5 19c4-1 6-3 8-6s3-6 6-8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="19" cy="5" r="1.6" fill="currentColor" />
          <path
            d="M6 18c-1.5.6-2.4 1.7-2.6 3 1.3-.2 2.4-1.1 3-2.6"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="text-xl font-extrabold tracking-tight text-ink-950">
        Thread<span className="text-brand-500">ly</span>
      </span>
    </span>
  )
}
