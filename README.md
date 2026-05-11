# Flagship Store

React + TypeScript + Vite storefront demo (routing under `/flagship-store`, LaunchDarkly-ready).

## Prerequisites

- [Node.js](https://nodejs.org/) **20+** (LTS recommended)
- [npm](https://docs.npmjs.com/cli/) (ships with Node)

## Run locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment (optional)**

   Copy the example env file. LaunchDarkly is optional for local dev; without a client ID the app still runs and uses flag defaults.

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set `VITE_LD_CLIENT_ID` if you want live flags. Get a **Client-side ID** from your LaunchDarkly project (Client-side SDK).

3. **Start the dev server**

   ```bash
   npm run dev
   ```

4. **Open the app**

   Vite prints a local URL (usually `http://localhost:5173`). Because the app uses the path prefix `/flagship-store`, open:

   **`http://localhost:5173/flagship-store/`**

   (Trailing slash is fine; the important part is the `/flagship-store` base path.)

## Common commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright E2E (builds with `build:e2e`, starts preview server; see `playwright.config.ts`) |

## Deploy notes

`vite.config.ts` sets `base: '/flagship-store/'` for GitHub Pages. `npm run deploy` runs `predeploy` (build) then publishes `dist/` via `gh-pages`.
