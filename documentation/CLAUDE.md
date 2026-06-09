# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Symplify is an AI-enhanced healthcare operations platform (EHR/clinic management) built with React 19 + TypeScript. It serves three user roles: **Admin**, **Doctor**, and **Patient**, each with role-specific dashboards, sidebars, and navigation.

**Live deployment:** symplify-v4.netlify.app (also configured for Vercel via vercel.json)

## Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # TypeScript check + Vite production build (tsc -b && vite build)
npm run lint     # ESLint on .ts/.tsx files
npm run preview  # Serve production build locally
```

There are no test commands configured — the project has no test framework set up.

## Architecture

### Stack
- **React 19.2** + **TypeScript 5.9** (strict mode) + **Vite 6.3**
- **Redux Toolkit** for state management (7 slices in `src/core/redux/store.tsx`)
- **React Router 7.9** with BrowserRouter (SPA with catch-all rewrite)
- **UI**: Bootstrap 5.3 + Ant Design 5.29 + React Bootstrap + PrimeReact
- **Charts**: ApexCharts + Chart.js
- **Calendar**: FullCalendar (daygrid, timegrid, list, multimonth views)
- **Maps**: Leaflet + React-Leaflet
- **i18n**: i18next (25 languages)

### Key Directories

- `src/core/` — Shared infrastructure (redux, hooks, common components, styles, data)
- `src/core/redux/` — All Redux slices: theme, ai, role, sidebar, email, notifications, shiftHandoff, drugInteraction
- `src/core/common/` — Reusable layout components (header, 3 sidebars, footer, dataTable, theme-settings)
- `src/core/ai/` — AI feature types, mock API implementations, and type definitions
- `src/core/style/scss/` — SCSS architecture with `_variables.scss` for design tokens, organized into components/pages/plugins/structure/utils
- `src/feature-module/` — All feature pages and route definitions
- `src/feature-module/routes/` — Route configuration (router.tsx, all_routes.tsx with 316 route constants, router.link.tsx with lazy imports)
- `src/feature-module/components/` — Feature pages organized by domain (auth, ai, dashboard, clinic-modules, doctor-modules, patient-modules, etc.)

### Routing & Layouts

Routes are defined in three files under `src/feature-module/routes/`:
1. **all_routes.tsx** — Route path string constants (import `all_routes` object)
2. **router.link.tsx** — Component imports mapped to `publicRoutes[]` and `authRoutes[]` arrays
3. **router.tsx** — Assembles routes; `publicRoutes` use `<Feature />` layout, `authRoutes` use `<AuthFeature />`

The main layout (`src/feature-module/feathure-components/feature.tsx`) selects the sidebar based on the current route path:
- Doctor routes (`/doctor-*`) → `<SidebarTwo />`
- Patient routes (`/patient-*`) → `<Sidebarthree />`
- All other routes → `<Sidebar />` (admin/clinic)

Note the typo in the directory name: `feathure-components` (not "feature").

### Redux Store Shape

```
sidebarSlice   — Mobile sidebar, mini mode, expand state
theme          — 9+ theme settings (dark/light, layout mode, sidebar style, RTL, color scheme)
ai             — Triage, scheduler, alerts, message router async thunks
shiftHandoff   — SBAR-structured shift handoff data
notifications  — System notifications
email          — Email module state
role           — Current user role + transition animation state
```

### Theming

Theme settings are managed via `themeSlice.tsx` and applied as `data-*` attributes on the root element. The theme-settings sidebar (`src/core/common/theme-settings/`) allows runtime switching of layout, color scheme, sidebar style, and RTL direction. Settings persist to localStorage.

### AI Features

Six AI features defined in `src/core/ai/types.ts` with mock API implementations in `mockApi.ts`:
- Smart Triage Priority, Dashboard Personalization, Appointment Scheduler
- Clinical Alert Prediction, Smart Message Router, AI Chatbot

All AI APIs are currently mocked with simulated delays (300-700ms). Feature pages live in `src/feature-module/components/ai/`.

### Environment Config

`src/environment.tsx` exports `base_path` and `img_path` (both default to `/`). Image components use `ImageWithBasePath` from `src/core/imageWithBasePath/`.

## Conventions

- SCSS is organized under `src/core/style/scss/` — component styles go in `/components`, page overrides in `/pages`
- Static data and mock datasets are in `src/core/json/` as TSX files exporting arrays
- TypeScript interfaces live in `src/core/data/interface/`
- The project uses multiple icon libraries (Tabler, Ant Design, Font Awesome, Weather Icons) — check existing usage before adding icons
- Ant Design global style overrides are in `src/index.scss`
