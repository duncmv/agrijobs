# Web

Next.js 13+ App Router scaffold with Tailwind CSS, TypeScript, and a base layout.

## What’s included

- Next.js App Router (TypeScript)
- Tailwind CSS with a brand color palette and light/dark theme via CSS variables
- Pre-configured PostCSS and Autoprefixer
- UI dependencies: Framer Motion, Heroicons, classnames
- Global fonts via `next/font` (Inter, Poppins, Lato)
- Responsive Navbar and Footer with a theme toggle
- ESLint + Prettier + Husky + lint-staged
- Smoke test page at `/smoke`

## Development

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Lint: `npm run lint`
- Type check: `npm run type-check`
- Build: `npm run build`
- Start production server: `npm run start`

## Notes

- The theme toggle stores the setting in `localStorage` and respects system preference on first load.
- Tailwind color palette is available under the `brand` namespace.
