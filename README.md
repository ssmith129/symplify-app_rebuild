# Symplify Health — Live Preview

AI-enhanced hospital and clinic management dashboard built with React 19, TypeScript, and Vite — a multi-role admin platform (patient, doctor, super-admin, clinic, HRM, finance) with an embedded clinical AI layer.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [AI Module](#ai-module)
- [Routing](#routing)
- [Styling & Theming](#styling--theming)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

Symplify Health is a single-page application front end for healthcare administration. It ships a large catalog of screens — dashboards, patient/doctor management, appointments, HRM, finance, content, support, settings, and a UI component reference — wired through a centralized route registry. On top of the conventional admin surface, it layers an AI feature set: smart triage scoring, clinical alert prediction, an assistant popup, shift handoff (SBAR), drug-interaction checking, voice documentation, and AI-augmented notifications/email/chat.

The AI layer currently runs against a bundled mock engine (`src/core/ai/mockApi.ts`) behind a pluggable `AIService` interface, so the mock can be swapped for a real backend without touching component code. There is no live clinical inference in this repository. [VERIFY: whether any production AI backend is intended to replace the mock]

Key capabilities:

- Multi-role dashboards (patient, doctor, super-admin) and an extensive clinic/HRM/finance admin surface
- Embedded AI components for triage, alerts, scheduling, handoff, and documentation
- Internationalization via i18next, RTL/dark/multiple layout modes
- Charting (ApexCharts, Chart.js), calendar (FullCalendar), maps (Leaflet), and a broad form/input toolkit

## Tech Stack

- **Language:** TypeScript ~5.9
- **Framework:** React 19, React DOM 19
- **Build tool:** Vite 6
- **State:** Redux Toolkit + React-Redux
- **Routing:** React Router 7 (`react-router` / `react-router-dom`)
- **UI libraries:** Ant Design 5, React-Bootstrap 2 + Bootstrap 5, PrimeReact 10
- **Styling:** SCSS (Dart Sass) with CSS custom-property design tokens
- **Charts:** ApexCharts (`react-apexcharts`), Chart.js (`react-chartjs-2`)
- **Calendar / scheduling:** FullCalendar
- **Maps:** Leaflet / React-Leaflet
- **i18n:** i18next, react-i18next, browser language detector, HTTP backend
- **Drag & drop:** `@hello-pangea/dnd`, Dragula
- **Linting:** ESLint 9 (flat config) + typescript-eslint

See [`package.json`](./package.json) for the complete dependency list.

## Prerequisites

- **Node.js** — a version compatible with Vite 6 (Node 18+; Node 20 LTS recommended). [VERIFY: no `engines` field is declared in `package.json`, so this is inferred from Vite 6's requirements]
- **npm** — bundled with Node. A `package-lock.json` is committed, so npm is the assumed package manager. [ASSUMED: npm over yarn/pnpm based on the committed lockfile]

## Installation

```bash
# Clone
git clone https://github.com/ssmith129/Symplify-1.7.4.git
cd Symplify-1.7.4

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Vite prints a local URL (default `http://localhost:5173`) once the dev server is ready.

## Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `vite` | Start the Vite dev server with HMR. |
| `build` | `tsc -b && vite build` | Type-check all project references, then produce a production build in `dist/`. |
| `lint` | `eslint .` | Lint the entire project with the flat ESLint config. |
| `preview` | `vite preview` | Serve the built `dist/` output locally for preview. |

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Configuration

A root `.env` file exists but is **empty** (0 bytes), and `src/environment.tsx` exports a base path used by the router. No environment variables are read by the application at present.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| — | — | — | No environment variables are currently consumed by the app. [VERIFY: confirm no Vite `import.meta.env.*` reads exist before relying on this] |

The router base path is set in `src/environment.tsx` and passed to `<BrowserRouter basename={base_path}>` in `src/main.tsx`. Adjust it there if deploying under a sub-path.

## Project Structure

```
.
├── index.html                  # Vite HTML entry; mounts #root
├── vite.config.ts              # Vite config (React plugin)
├── tsconfig*.json              # Project-reference TS config (app + node)
├── eslint.config.js            # Flat ESLint config
├── vercel.json                 # SPA rewrite (all routes -> index.html)
├── public/                     # Static assets served as-is
├── dist/                       # Production build output
├── documentation/              # Design audits, case-study specs, critiques, guides
└── src/
    ├── main.tsx                # App bootstrap: Redux Provider + Router
    ├── environment.tsx         # base_path for the router
    ├── index.scss              # Global style entry
    ├── core/
    │   ├── ai/                 # AI service boundary, mock engine, types
    │   ├── api/                # API layer
    │   ├── common/             # Shared components/utilities (incl. theme handler)
    │   ├── data/ · json/       # Static/mock data
    │   ├── hooks/              # Custom hooks
    │   ├── redux/              # Store and slices
    │   └── imageWithBasePath/  # Base-path-aware image helper
    ├── feature-module/
    │   ├── ai/                 # AI feature components (assistant, drug-interaction,
    │   │                       #   shift-handoff, voice-documentation, + widgets)
    │   ├── components/         # auth/ and pages/ screen components
    │   ├── feathure-components/ # Feature screens [VERIFY: directory name is misspelled in-repo]
    │   └── routes/             # all_routes.tsx, router.tsx, router.link.tsx
    └── style/
        ├── css/ · fonts/ · icon/
        └── scss/               # Design tokens + component/page/plugin styles
```

> Note: `src/feature-module/feature-module.zip` (~1.2 MB) is committed alongside the source tree. [VERIFY: whether this archive is intentional or build debris]

## AI Module

The AI layer is split between a core service boundary and feature components.

- **`src/core/ai/AIService.ts`** — defines the `AIService` interface (`sendMessage`, `getQuickActions`, `executeAction`) and a default `mockAIService` backed by the bundled mock engine. Inject a custom implementation via the `aiService` prop on `<AIAssistantPopup>` / `<AIAssistantWidget>` to replace the mock.
- **`src/core/ai/mockApi.ts`** — the mock inference engine (triage assessment, personalized layout, slot suggestions, clinical alerts, message analysis, alert WebSocket).
- **`src/core/ai/types.ts`** — shared AI types (triage priority, vitals, acuity scores, dashboard personalization, scheduling).
- **`src/feature-module/ai/index.ts`** — barrel exports for the AI feature components, grouped by feature: triage badge, dashboard widgets, smart scheduler, clinical alerts, message router, intelligent calendar, assistant popup/widget, shift handoff (SBAR), voice documentation, drug-interaction checker, AI notifications, email priority/categorization, message-urgency analyzer, and chat inbox widget.

```ts
import { mockAIService } from "./core/ai";
import { AIAssistantPopup } from "./feature-module/ai";

// Default (mock) wiring
<AIAssistantPopup aiService={mockAIService} userRole="nurse" />
```

## Routing

All paths are declared as a flat object in `src/feature-module/routes/all_routes.tsx` and rendered by `src/feature-module/routes/router.tsx`. Route groups include Auth, Dashboards (patient/doctor/super-admin), Patient, Doctor, Application (chat/calendar/email/calls/kanban/etc.), AI Features (`/ai/*`), Layouts, Clinic, HRM, Finance, Administration, Content, Support, Pages, Settings, and a UI component reference (`/ui-*`).

## Styling & Theming

Styling is SCSS-based with a CSS custom-property token system defined in `src/style/scss/_variables.scss`:

- **Color tokens:** brand (`--primary: #2E37A4`, `--secondary: #00D3C7`), semantic (success/info/danger/warning), a 100–900 gray ramp, and per-color transparent + hover variants.
- **Clinical tokens:** healthcare-specific severity tokens — `--clinical-critical`, `--clinical-urgent`, `--clinical-caution`, `--clinical-stable`, `--clinical-info`, each with matching `-bg` and `-border` values.
- **Spacing:** 4px-grid scale (`--space-1` … `--space-16`).
- **Typography:** `--text-xs` … `--text-2xl`; base size `0.875rem`.
- **Radius / elevation:** `--radius-sm/md/lg/xl` and a three-tier shadow system (`--shadow-subtle/medium/elevated`).
- **Responsive tokens:** page/card spacing, touch targets (32px desktop / 44px mobile), and chart heights adjust at mobile, iPad Pro 11" portrait/landscape, and tablet breakpoints.
- **Themes/layouts:** dark mode via `:root[data-bs-theme=dark]`; multiple layout modes (default, mini, hover, hidden, full-width, dark, RTL) are switchable via routes and a theme route handler.

## Deployment

A `vercel.json` is present and configures SPA rewrites (`/(.*) -> /index.html`), indicating Vercel as a deploy target. Build with `npm run build` and serve the `dist/` directory.

```bash
npm run build   # outputs to dist/
```

[VERIFY: no CI workflow contents were inspected; a `.github/` directory exists but its workflows were not confirmed]

## Testing

No test runner, test scripts, or test files were found in the repository. There is currently no automated test setup. [GAP: testing]

## Contributing

No `CONTRIBUTING.md` is present. For local development, run `npm run lint` before committing; `npm run build` must pass type-checking (`tsc -b`) to succeed. [ASSUMED: standard lint-then-build flow, inferred from available scripts]

## License

No `LICENSE` file is present in the repository, so usage terms are unspecified. [DATA NEEDED: license]

---

## Assumptions & Gaps

- **[VERIFY] Node version** — no `engines` field; Node 18+/20 LTS inferred from Vite 6.
- **[ASSUMED] Package manager** — npm, based on the committed `package-lock.json`.
- **[VERIFY] Environment variables** — `.env` is empty; confirm no `import.meta.env.*` reads before treating config as empty.
- **[VERIFY] AI backend** — AI features run on a bundled mock; whether a production backend is planned is unconfirmed.
- **[VERIFY] `feature-module.zip`** — a committed archive of unclear purpose.
- **[VERIFY] `feathure-components`** — directory name appears misspelled in-repo; documented as-is to keep paths runnable.
- **[VERIFY] CI** — `.github/` exists; workflow contents not inspected.
- **[GAP] Testing** — no test setup found; section included as absent-with-reason.
- **[DATA NEEDED] License** — no `LICENSE` file; terms unspecified.
- **Omitted sections:** Badges (no build/version/coverage/license service configured), API/Reference (no public API surface exposed), Acknowledgments/Contact (nothing verifiable). The `index.html` author meta is "Dreams Technologies" but this is not asserted as a contact. [VERIFY]
