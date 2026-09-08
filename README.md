# Threadly — clothing delivered in minutes

An "Uber Eats, but for clothing" experience: browse your city's local boutiques,
add pieces to your bag, check out, and watch your courier bring your order to your
door on a live map.

Built with **Vite + React + TypeScript + Tailwind CSS**. All product visuals are
generated as self-contained SVG illustrations, so the app renders with zero
external asset requests.

## Features

- **Discover** — animated hero, category rail, trending pieces, and boutiques near you
- **Boutique pages** — per-shop hero, in-store category filters, product grid
- **Product quick-view** — colour & size selection, quantity, add to bag
- **Search & browse** — full-text search across boutiques, categories, colours & tags, with sorting
- **Bag** — slide-out cart with quantity controls, free-delivery progress, and live totals
- **Checkout** — delivery details, timing, payment method, and courier tip
- **Live order tracking** — animated courier moving along a map route with a status timeline and ETA
- **Favourites** — save pieces you love (persisted locally)
- Cart, favourites, and address persist via `localStorage`

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run build:preview` | Build a single self-contained `index.html` (`dist-preview/`) |
| `npm run preview` | Preview the production build |

> This is a front-end demo — no real payments are processed and no real orders are placed.
