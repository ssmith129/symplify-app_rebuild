# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.
Human-facing setup/feature docs live in `README.md`; this file captures the
structure, workflows, and conventions an assistant needs to make correct changes.

## What this is

**Symplify Health** — an AI-enhanced hospital/clinic management dashboard. A
single-page React 19 + TypeScript + Vite front end with a multi-role admin
surface (patient, doctor, super-admin, clinic, HRM, finance) and an embedded
clinical AI layer (triage, predictive alerts, assistant, shift handoff/SBAR,
drug-interaction, voice documentation, AI notifications/email/chat).

The AI layer runs against a **bundled mock engine** (`src/core/ai/mockApi.ts`)
behind a pluggable `AIService` interface (`src/core/ai/AIService.ts`). There is
no live inference — swap the mock for a real backend without touching component
code.

## Commands

```bash
npm install        # install deps (also run this if the build fails on a rollup native-module error)
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build  — MUST stay green after every change
npm run lint       # ESLint (flat config, eslint.config.js)
npm run lint:css   # Stylelint over src/**/*.scss (token/hardcoded-color enforcement)
npm run preview    # preview the production build
```

There is **no test runner** configured. "Verification" means: `npm run build`
passes, and lint reports no *new* problems. TypeScript is `strict: true`, so
type errors fail the build. `noUnusedLocals`/`noUnusedParameters` are **off**.

## Architecture

Entry: `src/main.tsx` → Redux `<Provider>` → `<BrowserRouter>` → `ThemeRouteHandler` + `ALLRoutes`.

```
src/
  main.tsx              App bootstrap (providers, global CSS/JS imports)
  environment.tsx       base_path / img_path constants
  index.scss            Global style entry (imports style/scss/main.scss)
  core/
    ai/                 AIService interface, mockApi, domain types (types.ts, emailTypes.ts, notificationTypes.ts)
    redux/              Redux Toolkit store + slices (see State below)
    common/             Shared UI: header, sidebar(s), theme settings, common-select, themeColor.ts
    imageWithBasePath/  <ImageWithBasePath> wrapper — the standard <img> for the app
    api/ data/ hooks/ json/   Static data, helpers, hooks
  feature-module/
    routes/             all_routes.tsx (route name registry), router.link.tsx (route→component table), router.tsx (Routes tree)
    feathure-components/  Layout wrappers: feature.tsx (authed app shell), authFeature.tsx (auth pages).  NOTE the misspelling "feathure" — it is load-bearing; do not "fix" it.
    ai/                 AI feature components (widgets, badges, calendars) + subfolders: assistant, shift-handoff, drug-interaction, voice-documentation
    components/         auth/ (login/register/etc.) and pages/ (the full admin screen catalog)
  style/scss/           Design system (see Styling below)
```

### Routing
- Routes are **data-driven**, not hand-written per screen. To add a page:
  1. Add a stable name to `src/feature-module/routes/all_routes.tsx`.
  2. Register `{ path, element }` in `src/feature-module/routes/router.link.tsx`
     under `publicRoutes` (authed app, wrapped by `Feature`) or `authRoutes`
     (auth pages, wrapped by `AuthFeature`).
  3. `router.tsx` maps both arrays automatically — no edit needed there.
- `router.link.tsx` is large (~259 routes); follow the existing import + array-entry pattern.

### State (Redux Toolkit — `src/core/redux/store.tsx`)
Slices keyed as: `sidebarSlice`, `theme`, `ai`, `shiftHandoff`, `notifications`,
`email`, `role`. Use the exported `RootState` / `AppDispatch` types for typed
`useSelector`/`useDispatch`. (`drugInteractionSlice` and `voiceDocSlice` exist in
the folder but are not currently registered in the store — verify before relying
on them.)

## Styling & design tokens (IMPORTANT)

Single source of truth: **`src/style/scss/_variables.scss`** — CSS custom
properties under `:root`, with dark mode (`:root[data-bs-theme=dark]`) and many
`[data-sidebar=…]`/`[data-topbar=…]` theme variants overriding the same names.

**Rules for any `.tsx` or `.scss` change:**
- **Never hardcode** hex, `rgba()`, or raw color. Use `var(--token)`. Reuse
  existing tokens — do not invent values.
- Clinical severity → the canonical `--clinical-*` set:
  `--clinical-critical` / `-bg` / `-border` (red), `--clinical-urgent` (orange),
  `--clinical-caution` (amber), `--clinical-stable` (green), `--clinical-info`
  (blue). Do not reintroduce a parallel Material palette (`#F44336`, `#FF9800`,
  `#FFC107`, `#4CAF50`, …).
- Brand primary → `var(--primary)`.
- Elevation → the 3-tier `--shadow-subtle` / `--shadow-medium` / `--shadow-elevated`.
- Spacing → the 4px-grid `--space-*` tokens.
- For a **translucent tint of a token**, use
  `color-mix(in srgb, var(--token) N%, transparent)` — you cannot append an
  alpha hex suffix to a `var()` (e.g. `` `${color}20` `` breaks once `color` is a var).
- **Charts are the exception:** ApexCharts/Chart.js render to canvas/SVG and
  cannot consume `var()`. Resolve the token at runtime with
  `getThemeColor('--primary', '#fallback')` from `src/core/common/themeColor.ts`.

Enforcement (added to catch regressions):
- `npm run lint:css` — stylelint `declaration-strict-value` flags raw colors/shadows.
- `npm run lint` — ESLint `no-restricted-syntax` warns on hex in inline JSX `style`.
- Both currently report a **pre-existing backlog** (~358 SCSS, ~51 inline); treat
  it as remediation debt. Do not mass-auto-fix. Your job is to not *add* to it.

SCSS layout under `src/style/scss/`: `_variables.scss`, `main.scss` (entry),
`components/` (incl. `components/ai/`), `pages/`, `plugins/`, `structure/`, `utils/`.

### Accessibility
- `<ImageWithBasePath>` (`src/core/imageWithBasePath/index.tsx`) requires `alt`
  (enforced via the TS interface). Meaningful image → descriptive `alt`;
  decorative → `alt=""`. Do not make it optional again.
- `prefers-reduced-motion` blocks in the AI SCSS use `!important` intentionally —
  keep them.

### `!important` discipline
There are ~519 `!important` declarations, mostly load-bearing (Bootstrap utility
overrides, plugin overrides, reduced-motion a11y). Do **not** mass-strip. Remove
one only when you can prove the rule still wins on specificity/source-order and
no competing Bootstrap `!important` utility applies — and verify visually in
light + dark.

## Conventions

- Icons: Tabler (`ti ti-*`) and Feather webfonts; Bootstrap 5 utility classes
  everywhere. Buttons come from `_buttons.scss` / react-bootstrap — there is no
  bespoke `Button` component (a stray root-level one was removed).
- UI libs in use: `react-bootstrap`, `antd`, `primereact`, `react-select`,
  ApexCharts/Chart.js, FullCalendar, Leaflet. Match whatever a neighboring file uses.
- Match the surrounding file's style (naming, comment density, import ordering).
- Scope changes narrowly: these are largely styling/props/config edits — do not
  alter data flow, API calls, or routing unless that is the task.

## Repo gotchas

- **`node_modules` is committed** (tracked, ~68k files). Use targeted `git add`
  of the specific files you changed — never `git add -A` / `git add .`, or you'll
  stage massive dependency churn. `package.json` + `package-lock.json` are the
  source of truth for deps.
- The `feathure-components/` directory name is misspelled but referenced as-is.
- `src/feature-module/feature-module.zip` and stray `… 2`-suffixed files are
  cruft; ignore them.
- If `npm run build` fails with a rollup `MODULE_NOT_FOUND` on `native.js`, run
  `npm install` to repair the platform binary.

## Git & PR workflow

- Develop on the assigned feature branch; do not push to `main`.
- One focused commit per logical task; conventional-commit style is used here
  (`fix(ds):`, `refactor(ds):`, `fix(a11y):`, `chore(ds):`).
- Push with `git push -u origin <branch>`; open a **draft PR** if none exists.
- CI = three deploy previews (Vercel + two Netlify). There are no test/lint
  gates in CI, so `npm run build` locally is your real safety check before pushing.
