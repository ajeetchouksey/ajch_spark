# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is **Spark** (`package.json` name: `ajch_spark`) — a Vite + React + TypeScript + Tailwind site teaching AI literacy to kids aged 8–16, deployed at `spark.aaryaai.dev`. It is the repositioned successor to `ajch_platform`'s former "Discovery"/"Horizons" feature.

It is one of several independent sibling repos under the **Aarya — My AI Learning Hub** family (`ajch_platform` is the main app; **Compass**, `compass.aaryaai.dev`, is the sibling site for the non-technical/professional-adult audience that Spark cross-links to but does not host). Spark is a fully separate repo, build pipeline, and Cloudflare Pages deployment — it shares only visual design primitives with `ajch_platform`, not code.

## Commands

```bash
npm install
npm run dev       # Vite dev server, http://localhost:5173
npm run build     # tsc -b && vite build (type-check then build — both must pass)
npm run lint      # eslint .
npm run preview   # preview the production build locally
```

There is no test suite in this repo (no Vitest/Playwright/Jest configured) — do not assume one exists. Validate changes via `npm run build` (catches TS errors) and `npm run lint`.

Deployment is automatic: pushes to `main` trigger `.github/workflows/deploy-cloudflare-pages.yml`, which runs `npm run build` and `wrangler pages deploy dist --project-name=ajch-spark`. There's no separate staging step — merging to `main` ships to production.

## Architecture

**Routing** (`src/app/router.tsx`, mounted in `src/App.tsx` inside `BrowserRouter` → `Layout` → `Suspense`): every route component is `lazy()`-loaded. Two content sections use a hub + dynamic-slug pair: `/discover` + `/discover/:slug`, `/stay-safe` + `/stay-safe/:slug`; Build uses `/build` + `/build/:tier`. `public/_redirects` rewrites everything to `/index.html` (SPA shell) for Cloudflare Pages.

**Content-as-data pattern** — this is the core architectural idiom, repeated across all three content sections (Discover, Stay Safe, Build):
1. A `src/content/{section}/index.ts` module is the **single source of truth** for that section's topic/tier metadata (slug, icon, title, summary, accent color). It's imported by the hub page, the dynamic detail-page route, *and* `Layout.tsx`'s breadcrumb label lookup — so a topic only needs to be defined once.
2. The actual lesson prose lives in sibling `.md` files in the same directory (e.g. `src/content/discover/what-is-ai.md`), imported with Vite's `?raw` suffix directly into the page component (see `src/features/discover/pages/DiscoverLesson.tsx`) and looked up by slug in a `Record<string, string>`.
3. Rendering goes through the shared `src/components/LessonPage.tsx` template — icon, title, optional badge, optional hero image (imported from `src/assets/`, never a `public/` string path), then the markdown body via `react-markdown` + `remark-gfm`, ending in a `GoldenRuleRibbon`.

When adding a new lesson/topic: add the metadata entry to the section's `index.ts`, add the `.md` file, then wire the `?raw` import + slug entry in the corresponding feature page (`DiscoverLesson.tsx`, `StaySafeTopic.tsx`, or `BuildTier.tsx`). Don't invent new routes/components for a content addition — that's out of scope for content-only changes (see the `spark-content-writer` agent's stated boundaries below).

**Design system**: `src/components/ui/*` is a small typed primitive library (`Avatar`, `Badge`, `Breadcrumb`, `Button`, `GlassCard`, `PulsingDot`, `SectionHeader`, `StatGrid`, `Timeline`, `VersionTag`) copied — not linked or shared via package — from `ajch_platform` at a pinned snapshot commit. See `docs/design-sync.md` for the full provenance, what was intentionally dropped, and the re-sync process (manual, quarterly, same reviewer owns both repos — there is no automation). Rules from that doc:
- Colors/typography now come from the `@aaryaai/brand` package (a GitHub dependency: `@aaryaai/brand": "github:ajeetchouksey/ajch_brand#main"`) — don't hand-edit base color hex values in this repo.
- Spark layers its own kids-specific accent pair on top: `--aarya-accent` (amber) / `--aarya-accent-2` (emerald), overridden in `src/index.css`'s `:root`. Change the accent pair there; raise base-palette issues in `@aaryaai/brand` instead.
- The `src/components/ui/` primitives themselves are still a manual copy, not shared — don't try to import them from `ajch_platform`.

**Path alias**: `@/*` → `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`) — use it instead of relative `../../` imports, matching existing code.

**Three audience tiers** run through Build (and are the general age-segmentation concept for the whole site): Sparks (8–10), Flames (11–13), Blaze (14–16), defined in `src/content/build/index.ts` (`BUILD_TIERS`). Discover and Stay Safe content is currently written at a single "Flames-ish general kid" level with no per-tier split yet.

## Content standard (from `.claude/agents/spark-content-writer.md`)

Any lesson content in `src/content/{discover,stay-safe,build}/*.md` must follow this non-negotiable standard — the repo currently has no separate safety-review or publish gate, so these checks are the only gate:

- **Chunk size**: max 2–3 sentences per paragraph; longer runs must become a list, callout, or split paragraphs.
- **Voice**: talk *to* the reader ("you"), warm and a little cheeky, never dry/textbook. 1–2 light, current, safe slang expressions per page max, only where natural.
- **Visual rhythm**: never let more than ~4 sentences pass without a heading, list, or callout. At least one callout box per page beyond the closing "Quick check."
- **Interactivity**: prefer prompts that ask the reader to predict/imagine/try/compare over prompts asking them to recall a fact.
- **Content policy**: age-appropriate always; must reinforce the Golden Rule ("AI is a helper, not the boss. You are the thinker — always check, always question.") and never contradict the 5 Golden Safety Rules live on `/stay-safe`; no fabricated facts/stats; no naming specific commercial AI products as "the best" — reference tool *categories* instead (e.g. "an AI chat tool a grown-up has approved").
- **Format**: H1-less markdown body (the page component supplies the title), `##` section headers, `>` blockquote for the closing reflection prompt, bold for key terms.
- Content agents own `src/content/{discover,stay-safe,build}/*.md` only — not `.tsx`, routing, or the section `index.ts` metadata files (except a title/summary tweak strictly required to match a rewrite).

## Current status (from README)

Phase 2: homepage and `/discover`, `/play`, `/stay-safe` (all 5 Golden Safety Rules), `/grown-ups` are real; `/build` is a stub. `/legal/privacy` is live; the Impressum is blocked on unresolved contact/data-controller details. Not yet built: interactive games/tools, full per-tier curriculum content, badges/gamification, illustrated mascot.
