import type { GarmentType } from '../data/types';

function clamp(v: number) {
  return Math.max(0, Math.min(255, v));
}

/** Lighten (amt > 0) or darken (amt < 0) a hex colour. */
export function shade(hex: string, amt: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const nr = clamp(Math.round((t - r) * p + r));
  const ng = clamp(Math.round((t - g) * p + g));
  const nb = clamp(Math.round((t - b) * p + b));
  return `#${[nr, ng, nb].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function isLight(hex: string): boolean {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 170;
}

interface Props {
  garment: GarmentType;
  color: string;
  className?: string;
}

/**
 * Renders a stylised, fully self-contained SVG illustration of a garment in a
 * given colour — no external image requests, always renders.
 */
export default function GarmentArt({ garment, color, className }: Props) {
  const dark = shade(color, -0.22);
  const darker = shade(color, -0.4);
  const light = shade(color, 0.18);
  const stroke = isLight(color) ? shade(color, -0.45) : shade(color, -0.55);
  const sw = 2.4;

  const common = {
    stroke,
    strokeWidth: sw,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  };

  const shapes: Record<GarmentType, JSX.Element> = {
    tshirt: (
      <g {...common}>
        <path
          fill={color}
          d="M70 46 55 40 30 58l10 24 16-8v76c0 4 3 7 7 7h74c4 0 7-3 7-7V74l16 8 10-24-25-18-15 6c-4 10-14 16-25 16s-21-6-25-16Z"
        />
        <path fill={dark} d="M70 46c4 10 14 16 25 16s21-6 25-16l-8-3c-3 7-9 11-17 11s-14-4-17-11Z" />
        <path fill="none" stroke={stroke} strokeWidth="1.6" d="M56 92v50" opacity="0.5" />
      </g>
    ),
    shirt: (
      <g {...common}>
        <path
          fill={color}
          d="M74 44 55 38 30 56l10 24 15-7v74c0 4 3 7 7 7h71c4 0 7-3 7-7V73l15 7 10-24-25-18-19-6-11 12-11-12Z"
        />
        <path fill={light} d="M95 44 84 56v92h11V44Z" opacity="0.6" />
        <path fill={dark} d="M95 44 84 56l11 8 11-8-11-12Z" />
        <g fill={darker}>
          <circle cx="95" cy="78" r="2.2" />
          <circle cx="95" cy="98" r="2.2" />
          <circle cx="95" cy="118" r="2.2" />
          <circle cx="95" cy="138" r="2.2" />
        </g>
      </g>
    ),
    hoodie: (
      <g {...common}>
        <path
          fill={color}
          d="M72 48 52 42 26 60l11 26 16-8v72c0 4 3 7 7 7h78c4 0 7-3 7-7V78l16 8 11-26-26-18-20-6c-2 12-13 20-27 20s-25-8-27-20Z"
        />
        <path fill={dark} d="M72 48c2 12 13 20 27 20s25-8 27-20l-9-3c-3 10-10 15-18 15s-15-5-18-15Z" />
        <path fill="none" stroke={stroke} strokeWidth={sw} d="M88 60c4 8 18 8 22 0" />
        <path fill={darker} d="M84 96h8v40h-8zM106 96h8v40h-8z" opacity="0.35" />
        <rect x="70" y="120" width="58" height="20" rx="6" fill={dark} opacity="0.5" />
      </g>
    ),
    sweater: (
      <g {...common}>
        <path
          fill={color}
          d="M72 48 54 42 28 60l11 24 16-8v72c0 4 3 7 7 7h74c4 0 7-3 7-7V76l16 8 11-24-26-18-18-6c-4 8-13 12-24 12s-20-4-24-12Z"
        />
        <path fill="none" stroke={stroke} strokeWidth={sw} d="M74 52c4 8 14 11 24 11s20-3 24-11" />
        <g stroke={dark} strokeWidth="1.6" opacity="0.5" fill="none">
          <path d="M62 96l12 12-12 12M132 96l-12 12 12 12M88 100l10 10 10-10M88 124l10 10 10-10" />
        </g>
      </g>
    ),
    jacket: (
      <g {...common}>
        <path
          fill={color}
          d="M74 46 54 40 28 58l11 25 16-8v73c0 4 3 7 7 7h72c4 0 7-3 7-7V75l16 8 11-25-26-18-20-6-13 14-13-14Z"
        />
        <path fill={dark} d="M95 46 82 60l13 100V46ZM95 46l13 14-13 100V46Z" opacity="0.25" />
        <path fill={light} d="M74 46 60 60l22 100V56Z" opacity="0.5" />
        <path fill={darker} d="M92 60h6v96h-6Z" opacity="0.5" />
        <g fill={darker}>
          <circle cx="106" cy="84" r="2.4" />
          <circle cx="106" cy="106" r="2.4" />
          <circle cx="106" cy="128" r="2.4" />
        </g>
      </g>
    ),
    coat: (
      <g {...common}>
        <path
          fill={color}
          d="M76 44 52 38 30 56l11 22 13-6v106c0 4 3 7 7 7h72c4 0 7-3 7-7V72l13 6 11-22-22-18-24-6-13 16-13-16Z"
        />
        <path fill={light} d="M76 44 62 60l18 125V54Z" opacity="0.5" />
        <path fill={dark} d="M114 44 100 60l-6 125V54Z" opacity="0.3" />
        <path fill={darker} d="M92 62h6v118h-6Z" opacity="0.45" />
        <path fill={dark} d="M64 150h20v10H64zM110 150h20v10h-20z" opacity="0.4" />
        <g fill={darker}>
          <circle cx="106" cy="86" r="2.4" />
          <circle cx="106" cy="112" r="2.4" />
          <circle cx="106" cy="138" r="2.4" />
        </g>
      </g>
    ),
    dress: (
      <g {...common}>
        <path
          fill={color}
          d="M78 46c0 8 7 14 17 14s17-6 17-14l14 8c-4 10-8 18-8 30l14 78c1 6-3 10-9 10H66c-6 0-10-4-9-10l14-78c0-12-4-20-8-30Z"
        />
        <path fill={light} d="M95 60v122h-8L74 96c0-12-2-20-4-28Z" opacity="0.4" />
        <path fill={dark} d="M95 60v122h8l13-86c0-12 2-20 4-28Z" opacity="0.25" />
        <path fill="none" stroke={stroke} strokeWidth={sw} d="M78 46c0 8 7 14 17 14s17-6 17-14" />
        <path fill={dark} d="M74 108h42l2 12H72Z" opacity="0.35" />
      </g>
    ),
    skirt: (
      <g {...common}>
        <path fill={color} d="M62 70h66l16 96c1 6-3 10-9 10H55c-6 0-10-4-9-10Z" />
        <path fill={dark} d="M62 70h66v10H62z" />
        <g stroke={dark} strokeWidth="1.6" opacity="0.45" fill="none">
          <path d="M78 82 70 176M95 82v94M112 82l8 94" />
        </g>
      </g>
    ),
    pants: (
      <g {...common}>
        <path
          fill={color}
          d="M66 48h58v14l6 116c0 4-3 6-7 6h-14c-4 0-7-2-7-6l-7-84-7 84c0 4-3 6-7 6H67c-4 0-7-2-7-6l6-116Z"
        />
        <path fill={dark} d="M66 48h58v10H66z" />
        <path fill={darker} d="M94 58h4v100h-4Z" opacity="0.4" />
      </g>
    ),
    shorts: (
      <g {...common}>
        <path
          fill={color}
          d="M64 54h62v10l8 60c1 4-2 7-6 7h-16c-4 0-7-3-7-6l-8-38-8 38c0 3-3 6-7 6H66c-4 0-7-3-6-7l8-60Z"
        />
        <path fill={dark} d="M64 54h62v9H64z" />
        <path fill={darker} d="M93 63h6v56h-6Z" opacity="0.4" />
      </g>
    ),
    sneaker: (
      <g {...common}>
        <path
          fill={color}
          d="M32 96c14-6 22-16 30-24 6-6 12-6 16 2l6 14c14 6 40 10 58 16 8 3 12 8 12 16v6H36c-6 0-10-4-10-10 0-8 2-14 6-20Z"
        />
        <path fill={light} d="M62 74c6-6 12-6 16 2l6 14-24 2Z" opacity="0.5" />
        <path fill={dark} d="M26 118h128v8c0 4-3 7-7 7H33c-4 0-7-3-7-7Z" />
        <path fill={darker} d="M26 128h128v6H26Z" />
        <g stroke={light} strokeWidth="3" opacity="0.7">
          <path d="M96 96l14 18M108 92l14 20M120 90l14 22" />
        </g>
      </g>
    ),
    boot: (
      <g {...common}>
        <path
          fill={color}
          d="M74 40c-4 0-8 3-8 8l-2 62c0 6-4 10-4 18v6h72v-6c0-8-6-12-14-16l-24-12-2-52c0-4-3-8-8-8Z"
        />
        <path fill={dark} d="M60 122h72v8c0 4-3 6-7 6H67c-4 0-7-2-7-6Z" />
        <path fill={darker} d="M60 130h72v6H60Z" />
        <path fill={light} d="M66 48c0-4 3-7 7-7l1 60-8 2Z" opacity="0.5" />
        <path fill="none" stroke={dark} strokeWidth="1.6" d="M74 60h18M74 78h20M74 96h22" opacity="0.5" />
      </g>
    ),
    hat: (
      <g {...common}>
        <path fill={color} d="M60 110c0-30 14-52 35-52s35 22 35 52Z" />
        <path fill={dark} d="M44 110c0-6 4-10 12-12 12-3 26-4 39-4s27 1 39 4c8 2 12 6 12 12 0 6-6 10-14 10H58c-8 0-14-4-14-10Z" />
        <path fill={darker} d="M44 112h102v4c0 5-6 8-14 8H58c-8 0-14-3-14-8Z" opacity="0.6" />
        <path fill={light} d="M74 68c6-6 13-10 21-10v52H70Z" opacity="0.3" />
      </g>
    ),
    bag: (
      <g {...common}>
        <path fill="none" stroke={stroke} strokeWidth={sw} d="M70 74c0-16 10-28 25-28s25 12 25 28" />
        <path fill={color} d="M54 74h82l8 82c1 6-3 10-9 10H55c-6 0-10-4-9-10Z" />
        <path fill={light} d="M54 74h20l-6 92h-13c-6 0-10-4-9-10Z" opacity="0.4" />
        <path fill={dark} d="M54 74h82l1 12H53Z" opacity="0.5" />
        <rect x="84" y="104" width="22" height="10" rx="5" fill={darker} opacity="0.6" />
      </g>
    ),
    sunglasses: (
      <g {...common}>
        <path fill="none" stroke={stroke} strokeWidth="3" d="M40 74h20M140 74h20M88 80h24" />
        <rect x="52" y="72" width="42" height="34" rx="16" fill={color} />
        <rect x="106" y="72" width="42" height="34" rx="16" fill={color} />
        <rect x="58" y="78" width="30" height="20" rx="10" fill={light} opacity="0.5" />
        <rect x="112" y="78" width="30" height="20" rx="10" fill={light} opacity="0.5" />
      </g>
    ),
    scarf: (
      <g {...common}>
        <path fill={color} d="M66 46c8 8 20 8 28 0 8 8 20 8 28 0l6 10c-8 8-20 8-28 0-8 8-20 8-28 0Z" />
        <path fill={color} d="M78 58c6 0 10 4 10 10l4 108c0 5-4 8-8 8h-12c-4 0-8-3-8-8l4-108c0-6 4-10 10-10Z" />
        <g fill={dark} opacity="0.5">
          <rect x="66" y="150" width="24" height="8" />
          <rect x="66" y="164" width="24" height="8" />
        </g>
        <path fill="none" stroke={dark} strokeWidth="1.4" opacity="0.4" d="M78 70v90" />
      </g>
    ),
  };

  return (
    <svg
      viewBox="0 0 190 210"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {shapes[garment]}
    </svg>
  );
}
