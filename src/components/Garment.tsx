import type { GarmentType } from '../types'

/** Darken a hex color by a 0..1 amount for simple shading. */
function shade(hex: string, amount: number): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff
  r = Math.round(r * (1 - amount))
  g = Math.round(g * (1 - amount))
  b = Math.round(b * (1 - amount))
  return `rgb(${r}, ${g}, ${b})`
}

/** Whether a color is light enough that we should draw dark outlines. */
function isLight(hex: string): boolean {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  return 0.299 * r + 0.587 * g + 0.114 * b > 180
}

export function Garment({
  type,
  color,
  className,
}: {
  type: GarmentType
  color: string
  className?: string
}) {
  const dark = shade(color, 0.16)
  const darker = shade(color, 0.32)
  const stroke = isLight(color) ? 'rgba(15,13,26,0.28)' : 'rgba(255,255,255,0.35)'
  const sw = 1.6

  const common = {
    fill: color,
    stroke,
    strokeWidth: sw,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  }

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={type}>
      {renderGarment(type, { color, dark, darker, common, stroke, sw })}
    </svg>
  )
}

interface Ctx {
  color: string
  dark: string
  darker: string
  common: {
    fill: string
    stroke: string
    strokeWidth: number
    strokeLinejoin: 'round'
    strokeLinecap: 'round'
  }
  stroke: string
  sw: number
}

function renderGarment(type: GarmentType, c: Ctx) {
  switch (type) {
    case 'tshirt':
      return (
        <>
          <path {...c.common} d="M35 20 L28 26 L20 33 L26 42 L33 38 L33 78 L67 78 L67 38 L74 42 L80 33 L72 26 L65 20 C60 27 40 27 35 20 Z" />
          <path d="M35 20 C40 27 60 27 65 20" fill="none" stroke={c.stroke} strokeWidth={c.sw} />
          <path d="M33 60 L67 60" fill="none" stroke={c.dark} strokeWidth={c.sw} opacity="0.5" />
        </>
      )
    case 'shirt':
      return (
        <>
          <path {...c.common} d="M36 19 L27 25 L19 34 L25 43 L33 39 L33 80 L67 80 L67 39 L75 43 L81 34 L73 25 L64 19 L50 30 Z" />
          <path d="M36 19 L50 30 L64 19" fill="none" stroke={c.stroke} strokeWidth={c.sw} />
          <line x1="50" y1="30" x2="50" y2="80" stroke={c.dark} strokeWidth={c.sw} />
          <circle cx="50" cy="42" r="1.4" fill={c.dark} />
          <circle cx="50" cy="52" r="1.4" fill={c.dark} />
          <circle cx="50" cy="62" r="1.4" fill={c.dark} />
          <circle cx="50" cy="72" r="1.4" fill={c.dark} />
        </>
      )
    case 'hoodie':
      return (
        <>
          <path {...c.common} d="M34 22 L26 27 L17 36 L24 46 L32 41 L32 82 L68 82 L68 41 L76 46 L83 36 L74 27 L66 22 C62 33 38 33 34 22 Z" />
          <path {...c.common} d="M38 20 C40 32 60 32 62 20 C58 24 42 24 38 20 Z" />
          <path d="M46 30 L46 44 M54 30 L54 44" stroke={c.darker} strokeWidth={c.sw} />
          <rect x="40" y="60" width="20" height="14" rx="3" fill="none" stroke={c.dark} strokeWidth={c.sw} opacity="0.6" />
        </>
      )
    case 'sweater':
      return (
        <>
          <path {...c.common} d="M35 21 L26 27 L18 35 L25 45 L33 40 L33 80 L67 80 L67 40 L75 45 L82 35 L74 27 L65 21 C60 28 40 28 35 21 Z" />
          <path d="M35 21 C40 28 60 28 65 21" fill="none" stroke={c.stroke} strokeWidth={c.sw} />
          <path d="M33 74 L67 74 M33 40 L67 40" fill="none" stroke={c.dark} strokeWidth={c.sw} opacity="0.5" />
          <path d="M40 44 L45 50 L40 56 M60 44 L55 50 L60 56 M48 46 L52 52 L48 58" fill="none" stroke={c.dark} strokeWidth="1.2" opacity="0.5" />
        </>
      )
    case 'jacket':
      return (
        <>
          <path {...c.common} d="M34 20 L25 26 L17 35 L24 45 L32 40 L32 82 L68 82 L68 40 L76 45 L83 35 L75 26 L66 20 L50 30 Z" />
          <path {...c.common} d="M34 20 L50 30 L44 40 L38 34 Z" />
          <path {...c.common} d="M66 20 L50 30 L56 40 L62 34 Z" />
          <line x1="50" y1="30" x2="50" y2="82" stroke={c.darker} strokeWidth={c.sw + 0.4} />
          <circle cx="45" cy="52" r="1.6" fill={c.darker} />
          <circle cx="45" cy="64" r="1.6" fill={c.darker} />
        </>
      )
    case 'coat':
      return (
        <>
          <path {...c.common} d="M35 18 L25 24 L18 34 L25 46 L32 41 L32 88 L68 88 L68 41 L75 46 L82 34 L75 24 L65 18 L50 28 Z" />
          <path {...c.common} d="M35 18 L50 28 L45 40 L39 33 Z" />
          <path {...c.common} d="M65 18 L50 28 L55 40 L61 33 Z" />
          <line x1="50" y1="28" x2="50" y2="88" stroke={c.darker} strokeWidth={c.sw + 0.4} />
          <path d="M30 62 L70 62" stroke={c.dark} strokeWidth={c.sw} opacity="0.5" />
          <circle cx="44" cy="50" r="1.5" fill={c.darker} />
          <circle cx="44" cy="70" r="1.5" fill={c.darker} />
        </>
      )
    case 'dress':
      return (
        <>
          <path {...c.common} d="M38 20 L30 25 L24 33 L30 40 L36 36 L34 46 C34 46 24 74 26 84 L74 84 C76 74 66 46 66 46 L64 36 L70 40 L76 33 L70 25 L62 20 C58 26 42 26 38 20 Z" />
          <path d="M38 20 C42 26 58 26 62 20" fill="none" stroke={c.stroke} strokeWidth={c.sw} />
          <path d="M36 46 C46 50 54 50 64 46" fill="none" stroke={c.dark} strokeWidth={c.sw} opacity="0.6" />
          <path d="M40 60 L38 82 M50 58 L50 84 M60 60 L62 82" stroke={c.dark} strokeWidth="1.1" opacity="0.4" />
        </>
      )
    case 'skirt':
      return (
        <>
          <path {...c.common} d="M32 34 L68 34 L70 40 L78 78 L22 78 L30 40 Z" />
          <rect x="32" y="30" width="36" height="7" rx="2" fill={c.darker} />
          <path d="M34 44 L30 76 M42 44 L40 78 M50 44 L50 78 M58 44 L60 78 M66 44 L70 76" stroke={c.dark} strokeWidth="1.1" opacity="0.45" />
        </>
      )
    case 'pants':
      return (
        <>
          <path {...c.common} d="M35 22 L65 22 L64 50 L60 84 L52 84 L50 54 L48 84 L40 84 L36 50 Z" />
          <rect x="34" y="18" width="32" height="7" rx="2" fill={c.darker} />
          <line x1="50" y1="25" x2="50" y2="52" stroke={c.dark} strokeWidth="1.1" opacity="0.5" />
          <path d="M37 40 L63 40" stroke={c.dark} strokeWidth="1.1" opacity="0.3" />
        </>
      )
    case 'shorts':
      return (
        <>
          <path {...c.common} d="M33 26 L67 26 L66 46 L62 64 L52 64 L50 48 L48 64 L38 64 L34 46 Z" />
          <rect x="32" y="22" width="36" height="7" rx="2" fill={c.darker} />
          <line x1="50" y1="29" x2="50" y2="48" stroke={c.dark} strokeWidth="1.1" opacity="0.5" />
        </>
      )
    case 'sneaker':
      return (
        <>
          <path {...c.common} d="M18 58 C18 50 26 44 34 44 C40 44 44 48 50 52 C58 57 68 56 76 60 C82 63 84 66 84 70 L84 74 L18 74 Z" />
          <path d="M18 70 L84 70" stroke={c.darker} strokeWidth="3" />
          <path d="M34 48 L38 56 M42 50 L46 58 M50 53 L54 60" stroke={c.dark} strokeWidth="1.4" opacity="0.7" />
          <path d="M26 52 C30 48 34 47 38 47" fill="none" stroke={c.dark} strokeWidth="1.4" opacity="0.6" />
          <ellipse cx="72" cy="66" rx="8" ry="3" fill={c.color} stroke={c.stroke} strokeWidth="1" />
        </>
      )
    case 'boot':
      return (
        <>
          <path {...c.common} d="M38 22 L58 22 L58 56 C68 58 80 62 80 72 L80 76 L38 76 Z" />
          <path d="M38 68 L80 68" stroke={c.darker} strokeWidth="4" />
          <path d="M40 34 L56 34 M40 42 L56 42" stroke={c.dark} strokeWidth="1.2" opacity="0.5" />
          <circle cx="44" cy="50" r="1.3" fill={c.darker} />
          <circle cx="52" cy="50" r="1.3" fill={c.darker} />
        </>
      )
    case 'heel':
      return (
        <>
          <path {...c.common} d="M20 48 C34 46 52 48 70 54 C78 56 82 58 82 62 L60 64 C52 64 42 62 30 62 L20 62 Z" />
          <path d="M60 63 L64 78 L70 78 L66 62 Z" {...c.common} />
          <path d="M22 52 C34 51 48 52 62 57" fill="none" stroke={c.dark} strokeWidth="1.4" opacity="0.5" />
        </>
      )
    case 'hat':
      return (
        <>
          <path {...c.common} d="M30 54 C30 40 40 30 50 30 C60 30 70 40 70 54 Z" />
          <path {...c.common} d="M20 54 C20 50 34 48 50 48 C66 48 80 50 80 54 C80 58 66 60 50 60 C34 60 20 58 20 54 Z" />
          <path d="M50 32 C58 34 64 42 66 52" fill="none" stroke={c.dark} strokeWidth="1.4" opacity="0.5" />
        </>
      )
    case 'bag':
      return (
        <>
          <path d="M38 34 C38 24 62 24 62 34" fill="none" stroke={c.darker} strokeWidth="3" />
          <path {...c.common} d="M30 36 L70 36 L74 74 L26 74 Z" />
          <rect x="44" y="48" width="12" height="8" rx="2" fill={c.darker} />
          <path d="M30 44 L70 44" stroke={c.dark} strokeWidth="1.2" opacity="0.4" />
        </>
      )
    case 'sunglasses':
      return (
        <>
          <path d="M22 44 L78 44" stroke={c.darker} strokeWidth="3" />
          <rect x="22" y="42" width="24" height="18" rx="8" {...c.common} />
          <rect x="54" y="42" width="24" height="18" rx="8" {...c.common} />
          <path d="M46 48 L54 48" stroke={c.darker} strokeWidth="3" />
        </>
      )
    case 'scarf':
      return (
        <>
          <path {...c.common} d="M34 24 C34 24 46 40 46 54 L40 80 L52 80 L54 54 C54 40 66 24 66 24 C58 30 42 30 34 24 Z" />
          <path d="M40 44 L52 44 M40 58 L52 58 M40 70 L52 70" stroke={c.dark} strokeWidth="1.4" opacity="0.5" />
        </>
      )
    case 'watch':
      return (
        <>
          <path d="M42 24 L58 24 L56 40 L44 40 Z" {...c.common} />
          <path d="M44 60 L56 60 L58 76 L42 76 Z" {...c.common} />
          <circle cx="50" cy="50" r="15" {...c.common} />
          <circle cx="50" cy="50" r="15" fill="none" stroke={c.darker} strokeWidth="2" />
          <path d="M50 50 L50 42 M50 50 L57 53" stroke={c.dark} strokeWidth="1.6" />
        </>
      )
    default:
      return <rect x="30" y="30" width="40" height="40" rx="8" {...c.common} />
  }
}
