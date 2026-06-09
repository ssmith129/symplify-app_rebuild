<p align="center">
  <img src="logo.svg" alt="Symplify logo" width="200"/>
</p>

<h1 align="center">Symplify — AI-Enhanced Healthcare Operations Platform</h1>

<p align="center">
  <strong>Role-based EHR / clinic-management front end with AI decision-support widgets, built on React 19 + TypeScript + Vite.</strong>
</p>

<p align="center">
  <a href="https://github.com/ssmith129/Symplify-1.7.4/actions/workflows/static.yml"><img src="https://github.com/ssmith129/Symplify-1.7.4/actions/workflows/static.yml/badge.svg" alt="Deploy to GitHub Pages"/></a>
  <img src="https://img.shields.io/badge/react-19.2-61dafb.svg?logo=react" alt="React 19.2"/>
  <img src="https://img.shields.io/badge/typescript-5.9-3178c6.svg?logo=typescript" alt="TypeScript 5.9"/>
  <img src="https://img.shields.io/badge/vite-6.3-646cff.svg?logo=vite" alt="Vite 6.3"/>
</p>

> [!NOTE]
> Symplify is a **front-end-only** application. All clinical and AI logic is currently served by **mock implementations** in `src/core/ai/mockApi.ts` with simulated latency — there is no backend, database, or live AI service in this repository.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Usage](#usage)
- [AI Features](#ai-features)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [AI Service Reference](#ai-service-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

**Symplify** is the front end for an AI-enhanced healthcare operations platform (EHR / clinic management). It ships role-specific experiences for three user types — **Admin**, **Doctor**, and **Patient** — each with its own dashboard, sidebar, and navigation tree.

The application is a single-page React app. Clinical AI capabilities (triage scoring, drug-interaction checks, shift handoff, smart routing, etc.) are surfaced as widgets and pages throughout the standard workflows, and are backed by typed mock services so the UI can be developed and demonstrated without a live backend.

**Key characteristics**

- Three role-based layouts selected automatically by route prefix (`/doctor-*`, `/patient-*`, everything else).
- 270+ named routes across clinical, HRM, finance, administration, communication, content, settings, and AI modules.
- Redux Toolkit state with dedicated slices for AI features and theming.
- Runtime-configurable theming (dark/light, layout mode, sidebar style, RTL, color scheme) persisted to `localStorage`.
- Multi-language UI scaffolding via i18next with browser language detection.

---

## Tech Stack

| Layer | Technology | Version (from `package.json`) |
|-------|-----------|-------------------------------|
| UI framework | React + React DOM | 19.2 |
| Language | TypeScript | ~5.9.3 (strict) |
| Build tool | Vite + `@vitejs/plugin-react` | 6.3 |
| State management | Redux Toolkit + React Redux | 2.11 / 9.2 |
| Routing | React Router (`react-router`, `react-router-dom`) | 7.9 |
| UI kits | Ant Design, Bootstrap, React-Bootstrap, PrimeReact | 5.29 / 5.3 / 2.10 / 10.9 |
| Charts | ApexCharts (`react-apexcharts`), Chart.js (`react-chartjs-2`) | 4.7 / 5.3 |
| Calendar | FullCalendar (`@fullcalendar/react`) | 6.1 |
| Maps | Leaflet + React-Leaflet | 1.9 / 5.0 |
| Drag & drop | `@hello-pangea/dnd`, `dragula` | 18.0 / 3.7 |
| i18n | i18next + `react-i18next` + browser language detector | 25.6 / 15.7 |
| Styling | SCSS (`sass`, dart-sass) + Bootstrap | 1.94 |
| Icons | Tabler Icons, Font Awesome, Weather Icons, React Feather | — |
| Linting | ESLint 9 + `typescript-eslint` | 9.39 / 8.48 |

See [`package.json`](package.json) for the complete dependency list.

---

## Prerequisites

- **Node.js** — Vite 6 requires Node `18.x` or newer (Node 18 / 20 / 22 LTS recommended). <!-- [VERIFY] the repo pins no engine version (no `engines` field, no `.nvmrc`). -->
- **npm** — bundled with Node (a `package-lock.json` is committed, so npm is the canonical package manager).
- **Git** — to clone the repository.

No accounts, API keys, or external services are required to run the app, because all AI/data calls are mocked.

---

## Installation

```bash
# Clone the repository
git clone https://github.com/ssmith129/Symplify-1.7.4.git
cd Symplify-1.7.4

# Install dependencies
npm install

# Start the Vite dev server (HMR enabled)
npm run dev
```

By default Vite serves the app at `http://localhost:5173`.

---

## Scripts

All scripts are defined in [`package.json`](package.json):

| Command | What it does |
|---------|--------------|
| `npm run dev` | Starts the Vite dev server with hot module replacement. |
| `npm run build` | Type-checks the project (`tsc -b`) and produces an optimized production build in `dist/`. |
| `npm run lint` | Runs ESLint across the project (`eslint .`). |
| `npm run preview` | Serves the contents of `dist/` locally to preview the production build. |

> There is no `test` script — see [Testing](#testing).

---

## Configuration

The project currently ships **no runtime environment configuration**:

- The committed `.env` file is **empty**, and there is no `.env.example`.
- There are **no `import.meta.env.*` references** anywhere in `src/`, so Vite env variables are not consumed by the app.
- The only configuration module is [`src/environment.tsx`](src/environment.tsx), which hard-codes two path values:

| Export | Value | Description |
|--------|-------|-------------|
| `base_path` | `'/'` | App base path, passed to `<BrowserRouter basename>` in `src/main.tsx`. |
| `img_path` | `'/'` | Image base path used by the `ImageWithBasePath` helper (`src/core/imageWithBasePath/`). |

Theme/layout preferences (dark mode, sidebar style, RTL, color scheme) are configured at runtime through the theme-settings panel and persisted to `localStorage` — not through env vars.

> [!WARNING]
> If you wire Symplify to a real backend, add the corresponding `VITE_*` variables to `.env` and read them via `import.meta.env`. No such variables exist today; do not assume any are required.

---

## Usage

### Run locally

```bash
npm run dev          # http://localhost:5173
```

### Produce a production build

```bash
npm run build        # type-check + bundle into dist/
npm run preview      # serve dist/ locally to verify
```

### Role-based layouts

The active sidebar/layout is chosen by route prefix in [`src/feature-module/feathure-components/feature.tsx`](src/feature-module/feathure-components/feature.tsx) (note the intentional `feathure-components` directory spelling):

| Route prefix | Layout / sidebar | Audience |
|--------------|------------------|----------|
| `/doctor-*` | `SidebarTwo` | Doctor |
| `/patient-*` | `Sidebarthree` | Patient |
| everything else | `Sidebar` | Admin / clinic |

Route path constants live in [`src/feature-module/routes/all_routes.tsx`](src/feature-module/routes/all_routes.tsx); the two dedicated AI feature pages are:

- `/ai/shift-handoff` — SBAR shift-handoff workspace
- `/ai/drug-interaction` — drug-interaction checker

---

## AI Features

AI capabilities are implemented as React components under [`src/feature-module/ai/`](src/feature-module/ai) (top-level widgets) plus the subfolders `assistant/`, `shift-handoff/`, `drug-interaction/`, and `voice-documentation/`. Each talks to the mock service layer in [`src/core/ai/mockApi.ts`](src/core/ai/mockApi.ts), typed by [`src/core/ai/types.ts`](src/core/ai/types.ts).

| Area | Component(s) | What it surfaces |
|------|--------------|------------------|
| Triage priority | `TriagePriorityBadge` | An acuity/priority badge derived from symptoms, vitals, and wait time. |
| Dashboard personalization | `AIDashboardWidgets` | Role/time-aware dashboard widget arrangement. |
| Appointment scheduling | `SmartScheduler`, `IntelligentCalendar` | Ranked slot suggestions and a calendar view with per-day insights. |
| Clinical alerts | `ClinicalAlertWidget` | Predictive clinical alerts with severity and contributing factors (polled via a mock socket). |
| Message routing | `SmartMessageRouter`, `MessageUrgencyIndicator` | Urgency/category detection and recipient suggestions for messages. |
| AI assistant | `assistant/` (popup chatbot) | Conversational assistant bridging the other AI features with role-aware quick actions. |
| Shift handoff | `shift-handoff/` | SBAR-structured handoff generation and timeline (page: `/ai/shift-handoff`). |
| Voice documentation | `voice-documentation/` | Voice-to-text clinical notes with medical-term highlighting. |
| Drug interactions | `drug-interaction/` | Severity-graded medication interaction checks (page: `/ai/drug-interaction`). |
| AI notifications | `NotificationDropdownAI`, `NotificationPageAI` | Urgency-grouped, AI-prioritized notifications. |
| Email priority | `EmailPriorityBadge`, `EmailSidebarAI`, `EmailInboxAI` | Priority/category detection inside the email module. |
| Chat inbox widget | `ChatInboxWidget` | Dashboard-level recent-message summary with urgency cues. |

> The specific scoring thresholds, confidence percentages, and clinical heuristics are defined inside the mock service and are illustrative, not clinically validated.

---

## Project Structure

```text
Symplify-1.7.4/
├── .github/workflows/static.yml   # GitHub Pages deploy workflow
├── public/                        # Static assets served as-is
├── src/
│   ├── core/                      # Shared infrastructure
│   │   ├── ai/                    # AI types + mock service layer
│   │   │   ├── types.ts           # Interfaces for all AI features
│   │   │   ├── mockApi.ts         # Simulated AI backend (300–700ms delays)
│   │   │   ├── emailTypes.ts
│   │   │   ├── notificationTypes.ts
│   │   │   └── index.ts
│   │   ├── api/                   # API client scaffolding
│   │   ├── common/                # Header, 3 sidebars, footer, dataTable, theme-settings
│   │   ├── data/                  # Static data + TS interfaces
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── imageWithBasePath/     # Base-path-aware <img> helper
│   │   ├── json/                  # Mock datasets (TSX exporting arrays)
│   │   └── redux/                 # Store + slices
│   ├── feature-module/
│   │   ├── ai/                    # AI widgets + assistant/shift-handoff/drug-interaction/voice-documentation
│   │   ├── components/
│   │   │   ├── auth/              # Login, register, reset, lock screen, etc.
│   │   │   └── pages/             # Page modules (see below)
│   │   ├── feathure-components/   # feature.tsx (layout selector) + authFeature.tsx  [sic]
│   │   └── routes/                # all_routes.tsx, router.link.tsx, router.tsx
│   ├── style/                     # SCSS architecture + compiled css/fonts/icons
│   ├── environment.tsx            # base_path / img_path
│   └── main.tsx                   # App entry (Provider + BrowserRouter)
├── documentation/                 # Design audits, AI guides, implementation notes
├── dist/                          # Production build output
├── index.html                     # Vite HTML entry
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── vercel.json                    # SPA rewrite rules
└── package.json
```

`src/feature-module/components/pages/` is organized into domain module groups:
`administration-modules`, `ai-modules`, `application-modules`, `clinic-modules`, `content-modules`, `dashboard`, `doctor-modules`, `finance-accounts-module`, `hrm-modules`, `patient-modules`, `settings-modules`, `support-modules`, and `ui-modules`.

---

## State Management

The Redux store is configured in [`src/core/redux/store.tsx`](src/core/redux/store.tsx). Seven reducers are registered:

| Store key | Slice file | Responsibility |
|-----------|-----------|----------------|
| `sidebarSlice` | `sidebarSlice.tsx` | Mobile sidebar, mini mode, expand state. |
| `theme` | `themeSlice.tsx` | Theme/layout settings (dark/light, RTL, color scheme, sidebar style). |
| `ai` | `aiSlice.ts` | Triage, scheduler, clinical alerts, message-router state + async thunks. |
| `shiftHandoff` | `shiftHandoffSlice.ts` | SBAR shift-handoff data. |
| `notifications` | `notificationSlice.ts` | Notification state. |
| `email` | `emailSlice.ts` | Email module state. |
| `role` | `roleSlice.ts` | Current user role + transition animation state. |

> The repository also contains `drugInteractionSlice.ts` and `voiceDocSlice.ts`, which are **not** registered in the store as of this version.

---

## AI Service Reference

All AI calls go through the mock layer in [`src/core/ai/mockApi.ts`](src/core/ai/mockApi.ts), typed by [`src/core/ai/types.ts`](src/core/ai/types.ts). These are async functions returning simulated responses (≈300–700 ms latency), designed so the request/response contracts can later be implemented by real HTTP endpoints.

Representative service functions (verify exact signatures against `src/core/ai/`):

```typescript
// Triage
assessTriagePriority(request): Promise<TriageAssessmentResponse>

// Scheduling
getSmartSlotSuggestions(request): Promise<SchedulerResponse>

// Clinical alerts
getClinicalAlerts(): Promise<PredictiveAlert[]>

// Messaging
analyzeMessage(content: string): Promise<MessageAnalysis>

// Drug interactions
checkDrugInteraction(input: string): Promise<DrugInteractionResult>
```

To move to production, replace the mock function bodies with real network calls while keeping the TypeScript interfaces in `types.ts` as the contract. <!-- [VERIFY] exact exported function names/signatures — confirm in src/core/ai/mockApi.ts before publishing. -->

---

## Testing

**No test framework is configured.** `package.json` defines only `dev`, `build`, `lint`, and `preview` — there is no `test` script and no test runner (Jest, Vitest, Playwright, etc.) in the dependencies.

The closest things to automated verification today are:

```bash
npm run lint     # ESLint
npm run build    # tsc -b type-check + production build
```

Adding a runner such as **Vitest** + **React Testing Library** would be a reasonable first step toward unit coverage.

---

## Deployment

The app builds to static files in `dist/`, so it can be hosted on any static/SPA host. Two deployment configurations are present in the repo:

**1. GitHub Pages (CI)** — [`.github/workflows/static.yml`](.github/workflows/static.yml) deploys to GitHub Pages on push to `main` (and via manual dispatch).

> [!IMPORTANT]
> The workflow uploads the repository contents directly (`path: '.'`) and does **not** run `npm run build` before deploying. To publish the compiled app rather than source, add build steps and point the upload `path` at `dist/`.

**2. Vercel / generic SPA** — [`vercel.json`](vercel.json) provides the SPA fallback so client-side routes resolve to `index.html`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Manual build for any static host:

```bash
npm run build      # outputs to dist/
# deploy the dist/ folder; ensure SPA fallback routing to index.html
```

> A live preview at `symplify-v4.netlify.app` is referenced in the project docs, but no Netlify config (`netlify.toml`) is committed to this repository. <!-- [VERIFY] live URL availability and Netlify ownership. -->

---

## Contributing

No `CONTRIBUTING.md` is present in the repository. Suggested baseline workflow:

1. Branch from `main` (`feature/...` or `fix/...`).
2. Keep new code in **TypeScript**; use functional components with hooks.
3. Place AI components under `src/feature-module/ai/` and AI types/mocks under `src/core/ai/`.
4. Before opening a PR, ensure both pass:

   ```bash
   npm run lint
   npm run build
   ```

5. Include screenshots for any UI changes.

---

## License

**No `LICENSE` file is present in this repository**, so the licensing terms are not defined here. <!-- [VERIFY] -->

The HTML entry (`index.html`) attributes authorship to **Dreams Technologies**, which suggests Symplify may be derived from a commercial admin template subject to that vendor's license. Confirm the applicable terms with the template vendor / repository owner before redistributing or using in production.

---

## Acknowledgments

- **Author (per `index.html` meta):** Dreams Technologies.
- **Repository:** [github.com/ssmith129/Symplify-1.7.4](https://github.com/ssmith129/Symplify-1.7.4)
- Built with React, TypeScript, Vite, Redux Toolkit, Ant Design, and Bootstrap.

<!-- Version note: the directory name implies "1.7.4", but package.json declares name "template" and version "0.0.0". The 1.7.4 designation is unverified from package metadata. [VERIFY] -->
