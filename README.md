# Field Notes

A headless CMS blog built with Next.js 16 and Sanity.io. Supports automatic MDX fallback when Sanity is not configured — no CMS required to run locally.

## Tech Stack

- **Next.js 16** — App Router, TypeScript strict mode
- **Tailwind CSS v4** — CSS custom property design tokens
- **Sanity.io** — free tier CMS with automatic MDX fallback
- **Shiki** — server-side syntax highlighting
- **Lora + DM Mono** — editorial type pairing
- **Netlify** — deployed with `@netlify/plugin-nextjs`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs fully without any environment variables using the seed MDX posts in `content/posts/`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values to connect a Sanity project.

```bash
cp .env.example .env.local
```

| Variable                        | Required | Description                                    |
| ------------------------------- | -------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | No       | Sanity project ID — falls back to MDX if unset |
| `NEXT_PUBLIC_SANITY_DATASET`    | No       | Sanity dataset name (default: `production`)    |
| `SANITY_API_TOKEN`              | No       | Read-only Sanity API token                     |
| `NEXT_PUBLIC_SITE_URL`          | No       | Full site URL for OG images and sitemap        |

## Content

Without Sanity, the app reads from `content/posts/` (MDX files with gray-matter frontmatter). Fourteen seed posts are included covering accessibility, performance, CSS, animation, and TypeScript.

With Sanity configured, content is fetched from the CMS and the local MDX files are ignored.

## Sanity Studio

The Studio lives in `sanity/field-notes-blog/`. To run it locally (connects to the same dataset as production):

```bash
cd sanity/field-notes-blog
npm run dev
```

Open [http://localhost:3333](http://localhost:3333). Any posts published here appear on the site after the next Netlify deploy (or immediately if ISR has warmed the route).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
