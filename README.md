# Threadly — fashion, delivered 🧵

An "Uber Eats, but for clothing" experience. Browse local boutiques, add garments
to your bag, check out, and watch your order get delivered in real time.

Built with **Vite + React + TypeScript + Tailwind CSS**. Fully client-side — cart,
orders and delivery tracking are persisted in `localStorage`, so no backend is
required. All product imagery is rendered as inline SVG (zero external requests).

## Features

- 🏬 **Boutique discovery** — browse curated stores with ratings, ETAs, delivery
  fees, promos and price levels. Filter by category and sort by rating, speed or
  delivery cost.
- 🔎 **Search** across boutiques, brands and individual pieces.
- 👕 **Product pages & quick-add modal** — pick color, size and quantity.
- 🛍️ **Smart cart drawer** — one boutique per order, free-delivery progress bar,
  minimum-order gating, quantity controls.
- 💳 **Checkout** — editable delivery address, standard/express speed, payment
  method, courier tip, and a live order summary.
- 🛵 **Live order tracking** — animated courier moving along a route on a stylized
  map, a status timeline, and a counting-down ETA.
- 🧾 **Order history** — revisit past orders and track them again.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check + production build
```

## Standalone preview

```bash
npm run build:preview   # emits a single self-contained dist-preview/index.html
```

This produces one HTML file with all JS/CSS inlined that renders the whole app
standalone.

> This is a demo experience — no real orders are placed and no payment is taken.
