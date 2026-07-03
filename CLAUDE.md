# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Signal Engine is a GTM intelligence tool: given a target company + a product description, it detects buying signals (news, funding, hiring, competitor activity), finds a decision-maker contact, generates AI outreach copy, pushes the contact to HubSpot, notifies Slack, and stores the run in MongoDB. It's a two-workspace app: an Express/MongoDB backend and a Create-React-App frontend, deployed separately (backend on Render, frontend on Vercel).

## Commands

There is no root build — `frontend/` and `backend/` are independent npm workspaces with their own `node_modules`. The root `package.json` only holds a few shared frontend-adjacent deps (framer-motion, mathjs, recharts) and has no scripts.

Backend (`cd backend`):
- `npm start` — run the server (`node server.js`)
- `npm run dev` — run with `node --watch` for auto-restart
- No test suite is configured (`npm test` is a stub that exits 1)

Frontend (`cd frontend`):
- `npm start` — CRA dev server
- `npm run build` — production build
- `npm test` — CRA/Jest test runner (interactive watch mode)

## Architecture

### Backend pipeline (`backend/routes/pipeline.js`)

Everything funnels through one endpoint: `POST /api/run-pipeline`. It runs as a linear pipeline with parallelized signal-gathering:

1. **Fetch signals in parallel** — `newsService`, `fundingService`, `scrapingService` (LinkedIn jobs + G2 competitor mentions, scraped via `r.jina.ai` reader proxy) all query independently and get concatenated into one `allSignals` array. If none of them return anything, the route 404s.
2. **Find contact** — `hunterService.findContact(companyDomain)` via Hunter.io; falls back to a synthesized generic contact (`contact@<domain>`) if Hunter finds nothing.
3. **Generate outreach** — `groqService.generateOutreach()` is called once per signal for the top 3 signals (`Promise.all`), each producing `{ email: { subject, body }, linkedin, whyItMatters }`.
4. **Push to HubSpot** — only the *first* top signal + its outreach gets pushed as a HubSpot contact (`hubspotService`).
5. **Notify Slack** — same single top signal is sent to Slack via `slackService` (incoming webhook).
6. **Persist** — the full run (all signals, contact, all outreach variants, HubSpot result) is saved as one `Run` document in MongoDB and returned to the frontend as one JSON payload.

`GET /api/runs` returns the last 50 runs for history.

Each `backend/services/*.js` file wraps exactly one third-party API and is a self-contained `axios` caller with its own try/catch (errors are swallowed and logged, not thrown, except in `groqService`/`hunterService` where a null/fallback is returned to the pipeline). There's no shared HTTP client, retry logic, or rate limiting — if you add a new signal source, follow this same one-file-per-integration pattern and wire it into the `Promise.all` in `pipeline.js`.

`groqService.js` calls Groq's OpenAI-compatible chat completions endpoint directly via `axios` (model `llama-3.3-70b-versatile`), not the `@anthropic-ai/sdk` package listed in `backend/package.json` — that dependency is currently unused.

Mongoose models (`backend/models/`) are intentionally loose — `Run.signals`/`contact`/`outreach` are typed as generic `Array`/`Object`, not sub-schemas, so shape changes to signal/outreach objects don't require a migration. `Signal.js` exists as a schema but isn't currently used by the pipeline route (signals are embedded directly in `Run`, not saved standalone).

Env vars are loaded via `dotenv` from `backend/.env`: `PORT`, `MONGO_URI` (note: **not** `MONGODB_URI` as the README states), `NEWS_API_KEY`, `HUNTER_API_KEY`, `GROQ_API_KEY`, `HUBSPOT_API_KEY`, `SLACK_WEBHOOK_URL`.

### Frontend (`frontend/src`)

CRA app with `react-router-dom`, four routes in `App.js`: `/` (Landing), `/setup` (collect company/domain/product inputs), `/loading`, `/dashboard` (results). `frontend/src/services/api.js` is the only place that talks to the backend — `runPipeline()` POSTs to `${REACT_APP_API_URL}/run-pipeline`, defaulting to the deployed Render backend if `REACT_APP_API_URL` isn't set locally.

Component structure under `src/components/`:
- `dashboard/` — result-rendering widgets (SignalList, SignalTimeline, ContactCard, OutreachPanel, StatsCards) consumed by `pages/Dashboard.jsx`
- `sections/`, `hero/`, `cards/`, `navigation/`, `logo/`, `background/`, `animations/` — landing-page presentation, built with `framer-motion`/`gsap`/`three`/`postprocessing` for animated visuals
- `reactbits/` — third-party-style UI primitives (PillNav, SpotlightCard, PixelBlast, GradualBlur, Stepper, SplitText, BorderGlow) vendored directly into the repo rather than imported from a package

Styling is a mix of CSS Modules (`*.module.css`) and plain per-component CSS files — no single convention, follow whatever the file you're editing already uses.
