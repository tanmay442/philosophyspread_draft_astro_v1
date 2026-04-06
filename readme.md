# PhilosophySpread

An Astro-based site for publishing philosophy essays, daily bits, and logic modules.

## Stack

- Astro
- TypeScript
- Tailwind CSS
- MDX content collections

## Project Structure

- `src/pages/`: Route entries and listing pages
- `src/components/`: UI components and section layouts
- `src/content/`: MDX content (bits, essays, logic modules, pages)
- `src/layouts/`: Base layouts
- `public/`: Static assets

## Requirements

- Node.js 18+
- pnpm 8+

## Setup

1) Install dependencies

```bash
pnpm install
```

Expected output: `node_modules/` created and `pnpm-lock.yaml` respected.

2) Start the dev server

```bash
pnpm dev
```

Expected output: a local URL is printed, usually `http://localhost:4321`.

3) Build for production

```bash
pnpm build
```

Expected output: `dist/` folder with the production build.

4) Preview the production build

```bash
pnpm preview
```

Expected output: a local preview URL is printed.

## Content Editing

- Essays live in `src/content/essays/` (MDX)
- Daily bits live in `src/content/bits/` (MDX)
- Logic modules live in `src/content/logic-modules/` (MDX)

## Scripts

- `pnpm dev`: Run the local dev server
- `pnpm build`: Create a production build
- `pnpm preview`: Preview the production build locally

## Notes

- If you add new MDX files, ensure frontmatter matches the content config in `src/content.config.ts`.