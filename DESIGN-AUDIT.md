# Design Critique: Symplify v1.7.4

**Audit scope:** Full audit — color, typography, spacing, components, layout, and accessibility across Admin, Doctor, and Patient roles.
**Stage:** Final polish (pre-launch).
**Date:** March 29, 2026

---

## Overall Impression

Symplify has a solid design system foundation with well-defined tokens (4px spacing grid, 7-step type scale, clinical color semantics, 3-tier elevation) and strong accessibility scaffolding (1,100+ ARIA attributes, proper live regions for clinical alerts). The biggest opportunity is **consistency enforcement** — the system is well-architected but underutilized, with ~60 hardcoded hex values, 3 competing page header patterns, and divergent component styling across the three role views.

---

## Usability

| Finding | Severity | Recommendation |
|---------|----------|----------------|
| Three different page header implementations (PageHeader component, custom `<h6>`, `<h3 className="page-title">`) create inconsistent wayfinding across modules | 🔴 Critical | Standardize on `PageHeader` component everywhere. Deprecate inline heading patterns. |
| Patient sidebar reuses `.doctor-sidebar` CSS class — role identity is muddled | 🔴 Critical | Create `.patient-sidebar` class. Rename components to `SidebarAdmin`, `SidebarDoctor`, `SidebarPatient`. |
| 441 form inputs use placeholder text, but only 119 labels have `htmlFor` — many inputs may lack programmatic labels | 🔴 Critical | Audit every `<input>` for a paired `<label htmlFor>`. Placeholder is not a substitute for a label. |
| Modal close buttons use 3 different class combos (`btn-close custom-btn-close`, `btn-close btn-close-modal custom-btn-close`, `btn-close` alone) | 🟡 Moderate | Pick one pattern and propagate it via a shared `ModalShell` wrapper. |
| Table filter UIs differ by role — clinic uses form-based checkboxes, doctor uses dropdowns, patient uses simplified dropdowns | 🟡 Moderate | Align filter patterns. A single `TableFilters` component with configurable filter types would unify behavior. |
| Footer component exists but is not integrated into the main layout shell | 🟢 Minor | Either integrate it into `feature.tsx` or remove the dead component. |

---

## Visual Hierarchy

**What draws the eye first:** The sidebar and its role-specific branding. This is correct — role identity should be the strongest anchor in a multi-role healthcare app.

**Reading flow:** Dashboard pages follow a strong top-to-bottom card grid. Admin and Doctor dashboards use a 3-column `col-lg-4` layout, but Patient uses a 4-column `col-xl-3` layout at a different breakpoint — this creates an inconsistent density shift when switching roles.

**Emphasis issues:**

The AI feature pages (`smart-insights`, `drug-interaction`) use `<h3 className="page-title">` while clinic/doctor/patient modules use the `PageHeader` component. This creates two visually distinct "this is the page title" patterns, breaking the hierarchy contract.

Section headers within dashboards also diverge: Doctor dashboard uses a `SectionHeader` component with icons, while Patient dashboard uses raw `<h5 className="fw-bold mb-0">`. Same content type, different markup, different visual weight.

---

## Consistency

### Color & Theming

| Element | Issue | Recommendation |
|---------|-------|----------------|
| 60+ hardcoded hex values across 10+ SCSS files | Colors bypass the token system entirely | Replace all hardcoded hex with `var(--token)` references. Priority files: `index.scss`, `_chat.scss`, `_background.scss` |
| Doctor sidebar uses `#1E3A5F` with `!important` — not in the variable system | One-off override creates maintenance debt | Add `--doctor-sidebar-bg: #1E3A5F` to `_variables.scss` |
| Chat AI components introduce 9 new untokenized colors (`#F9FAFB`, `#E5E7EB`, `#D1D5DB`, etc.) | New feature drifted from the system | Create `--chat-*` semantic tokens mapped to existing grays |
| 28 gradient colors in `_background.scss` are all raw hex | Sidebar/topbar theme gradients can't be managed centrally | Define gradient tokens or a `$gradients` map |
| 18 `--pr-*` CSS variables referenced in `index.scss` but never defined | These resolve to nothing — styles silently break | Define them in `_variables.scss` or map to Bootstrap equivalents |
| Plugin SCSS files (`_select2.scss`, `_calendar.scss`, `_c3.scss`) use raw `#fff` and `#00D3C7` | Third-party overrides bypass the system | Replace with `var(--white)`, `var(--secondary)` |

### Typography

| Element | Issue | Recommendation |
|---------|-------|----------------|
| 40+ hardcoded `font-size` values in px across component SCSS | Bypasses the 7-step type scale | Replace with `var(--text-xs)` through `var(--text-2xl)`. Exception: `16px` on mobile inputs (iOS zoom prevention) is intentional. |
| Chat component uses `10px`, `11px`, `12px` font sizes | Doesn't map to the defined scale | Map to `--text-xs` (11px) and `--text-sm` (12px) |
| `_reboot.scss` defines heading sizes in px without rem fallback | Accessibility concern — user font-size preferences ignored | Switch to rem-based heading sizes already defined in the token system |

### Component Patterns

| Element | Issue | Recommendation |
|---------|-------|----------------|
| Buttons: 3 different "light" variants (`btn-light`, `btn-white`, `btn-outline-white`) used for the same visual intent | Developers pick whichever feels right | Define one canonical "light/neutral" button. Document when to use each variant. |
| Button sizing: `btn-sm`, `btn-md`, `btn-lg`, `btn-xs` used inconsistently — Doctor module prefers `btn-md`, Patient prefers `btn-sm` | No sizing convention per context | Establish sizing rules: `btn-sm` for inline/table actions, `btn-md` for page-level actions, `btn-lg` for primary CTAs. |
| Inline styles on buttons (`style={{ maxWidth: '280px' }}`, `style={{ fontSize: 12 }}`) | Breaks the CSS-first approach | Move to utility classes or SCSS |
| Card padding: mix of `p-0`, `p-2`, `p-3`, `pb-0`, `py-3`, `px-0 mx-3` across 631 card-body instances | No standard card density | Define 2-3 card density variants (compact, default, spacious) using the spacing tokens |
| Card headers: `border-bottom px-0 mx-3` pattern (40 occurrences) fights against default padding | Negative margin hack suggests the base card padding is wrong | Rethink card structure — if headers need different padding than bodies, make that explicit in the component |
| Form labels: `form-label mb-1 text-dark fs-14 fw-medium` (225 instances) vs `form-label mb-0` (120 instances) | Two label styles with no clear rule | Create a `FormField` wrapper that standardizes label + input + error markup |

### Layout & Structure

| Element | Issue | Recommendation |
|---------|-------|----------------|
| Directory typo: `feathure-components` | Propagates through all imports | Rename to `feature-components` with a find-and-replace across the codebase |
| Sidebar naming: `Sidebar`, `SidebarTwo`, `Sidebarthree` | No consistent naming convention; `Sidebarthree` mixes casing | Rename to `SidebarAdmin`, `SidebarDoctor`, `SidebarPatient` |
| Grid breakpoints differ: Admin/Doctor use `col-lg-4`, Patient uses `col-xl-3` | Layouts break at different viewport widths | Align on a single breakpoint strategy for dashboard card grids |
| Admin sidebar has a logo + dropdown; Doctor sidebar has an empty `<div>`; Patient sidebar has a logo but no dropdown | Structural inconsistency in the navigation anchor | All three sidebars should have the same logo/identity pattern |
| `CarouselRow` className is sometimes empty (Patient dashboard) vs `"mb-4 g-3 g-lg-4"` (Admin/Doctor) | Spacing varies by role for no apparent reason | Pass consistent spacing classes to all `CarouselRow` instances |

### Spacing

| Element | Issue | Recommendation |
|---------|-------|----------------|
| Hardcoded sidebar background color (`rgba(29, 62, 94, 1)`) in inline style (sidebar.tsx line 195) | Inline style can't be themed | Move to CSS variable `var(--sidebar-accent)` |
| 7 sidebar themes + 7 topbar themes define gradients with 30+ hardcoded colors in `_theme.scss` | Theme expansion requires editing raw CSS | Create a structured `$theme-variants` map |
| Border radius: only 2 tokens (`--radius-card: 8px`, `--radius-modal: 12px`) + legacy `$border-radius: 0.3rem` | Buttons use hardcoded `5px`; no consistent scale | Add `--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 12px`, `--radius-xl: 16px` |

---

## Accessibility

**Color contrast:**

The primary (`#2E37A4`) and semantic colors pass WCAG AA on white. However, the clinical info color (`#2563EB`) has only a 3.2:1 ratio against white — this **fails WCAG AA** for normal text. Gray-100 (`#CED1D7`) and Gray-200 (`#B6BBC4`) are marginal at 4.8:1 and 4.2:1 respectively.

**Touch targets:**

Well-implemented. CSS variables (`--touch-target-desktop: 32px`, `--touch-target-mobile: 44px`) are actively used across 27 component instances with responsive media queries. This is above average for a web app.

**Focus management:**

13 SCSS files suppress `outline: none` or `outline: 0` — including form controls, accordions, and the login page — without providing replacement `:focus-visible` styles. This makes keyboard navigation invisible.

**Semantic HTML:**

Only 41 landmark elements (`<main>`, `<section>`, `<nav>`) across the entire app vs. 1,955 heading tags. The layout is almost entirely `<div>`-driven. Screen reader users lose all structural navigation beyond headings.

**Form accessibility:**

441 inputs have `placeholder` attributes, but only 119 `<label>` elements have `htmlFor`. Many form fields likely rely on placeholder as the only label — which disappears on focus and fails WCAG 1.3.1.

25 elements use `role="button"` on non-button elements (divs/spans). These require keyboard event handlers (`Enter` and `Space`) to be accessible.

**What's done well:**

The ARIA coverage is strong — 1,109 attributes across 148 files. Clinical alert widgets properly use `role="alert"` with `aria-live="assertive"`, which is exactly right for healthcare. Visually-hidden text exists for screen readers in 16 files, including HIPAA badges and alert counts.

---

## What Works Well

The **design token architecture** is genuinely well-thought-out. The 4px spacing grid with component-specific aliases (`--space-card-inset`, `--space-table-cell`), responsive overrides at three breakpoints, and the clinical color system with bg/border variants show real design systems thinking. The 3-tier elevation system (subtle/medium/elevated) with dark mode adjustments is clean.

The **accessibility foundation** is stronger than most apps at this stage. Live regions for clinical alerts, proper touch targets with responsive scaling, and consistent ARIA attribute usage across interactive widgets give you a real head start.

The **Redux-driven theming** (9+ settings for layout, color scheme, sidebar style, RTL) with localStorage persistence is a solid architectural choice for a multi-tenant healthcare product.

---

## Priority Recommendations

**1. Fix the 18 undefined `--pr-*` CSS variables.** These are silently breaking styles in `index.scss` right now. Either define them or replace references with the correct token names. This is a bug, not a polish item.

**2. Enforce the token system.** The 60+ hardcoded hex values and 40+ hardcoded font sizes undermine the entire design system. A single pass through `index.scss`, `_chat.scss`, `_background.scss`, and the plugin overrides would eliminate the majority. Consider adding a stylelint rule to flag raw hex/px values going forward.

**3. Standardize the three competing page header patterns** on the `PageHeader` component. This is the single highest-impact consistency fix across the app — it affects every page a user visits.

**4. Add `:focus-visible` replacement styles** for the 13 files that suppress outlines. For a healthcare app, keyboard accessibility isn't optional — clinicians often use keyboard-heavy workflows.

**5. Audit form labels.** With 441 placeholder-dependent inputs, a systematic pass to add proper `<label htmlFor>` associations is critical for both accessibility compliance and usability (especially for users with motor impairments using voice input).

**6. Align dashboard grid breakpoints and card spacing** across the three roles. Admin/Doctor using `col-lg-4` while Patient uses `col-xl-3` creates an unnecessary inconsistency that's easy to fix.

**7. Rename `feathure-components` and standardize sidebar naming.** This is cosmetic but signals code quality — and the sidebar class reuse (`.doctor-sidebar` on the patient view) is a real bug.

---

## Design System Maturity Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| Color system | 7/10 | Strong token architecture with clinical semantics; undermined by hardcoded overrides |
| Spacing | 9/10 | Excellent 4px grid with responsive scales and component aliases |
| Typography | 8/10 | Clear 7-step scale with responsive headings; needs enforcement in components |
| Elevation | 8/10 | Clean 3-tier system with dark mode support |
| Component consistency | 5/10 | Multiple competing patterns for buttons, cards, headers, modals |
| Accessibility | 7/10 | Strong ARIA foundation; gaps in focus styles, form labels, and semantic HTML |
| Layout consistency | 6/10 | Good grid system, inconsistent application across roles |
| Token enforcement | 4/10 | Well-defined tokens that aren't consistently used |
| **Overall** | **6.75/10** | **Solid architecture that needs a consistency pass before launch** |
