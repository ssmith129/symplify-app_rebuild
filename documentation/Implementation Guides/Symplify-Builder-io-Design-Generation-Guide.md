# Builder.io Design Generation Guide — Symplify Healthcare Platform

---

## Assumptions

| Assumption Area | Value |
|---|---|
| **Builder.io plan tier** | Growth plan (access to custom components, design tokens, content models, A/B testing, scheduling) |
| **Component architecture** | Symbols for repeating UI patterns (cards, badges, headers, nav items); Custom Components for complex interactive elements (clinical dashboards, drug interaction checker, shift handoff, AI assistant) registered from existing React+TypeScript codebase |
| **Design token system** | CSS custom properties (`--token-name`) managed through Builder.io's Design Tokens panel, mapped to Symplify's existing `_variables.scss` taxonomy with 90+ tokens across color, spacing, shadow, and typography tiers |
| **Responsive breakpoints** | Large desktop: ≥1400px · Desktop: ≥992px · Tablet: ≥768px · Mobile: <768px — aligning with Symplify's `$breakpoints` map (xs:0, sm:576px, md:768px, lg:992px, xl:1200px, xxl:1400px). Mobile-first cascade for all new directives |
| **Accessibility standard** | WCAG 2.1 AA as baseline; AAA for clinical-facing touch targets per audit Section 4.2 (44px minimum) due to gloved-hand usage context |
| **Target frameworks** | React 18+ with TypeScript (primary), using Redux Toolkit for state management, with SSR/SSG compatibility. Dual UI framework (Bootstrap 5 + Ant Design) currently in place — migration path toward unified system is in scope |
| **Font stack** | `Inter` as primary (`--font-family-base`), `JetBrains Mono` for monospace clinical data (`--font-family-mono`) |
| **Base font size** | `0.875rem` (14px) per `$font-size-base` |
| **Color palette primary** | `--primary: #2E37A4`, `--secondary: #00D3C7` |
| **Spacing grid** | 4px base grid (`--space-1: 4px` through `--space-16: 64px`) |

---

## How to Use This Guide

Feed individual category sections or specific directives into Builder.io's design generator as prompt context. Each directive is self-contained — you can generate a single component fix or batch an entire category. Use priority tags to sequence your implementation sprints: P0 first, then P1, then P2.

**Sprint mapping (from audit Section 11.4):**
- **Sprint 1 (P0):** Critical safety — touch targets, severity color unification → addresses 8 Critical + 4 High issues
- **Sprint 2–3 (P1):** Token migration — replace hardcoded colors in AI SCSS, fix dark mode → addresses 10 High + 6 Medium issues
- **Sprint 4–5 (P1):** Component library — shared ClinicalBadge, StandardButton, FormInput → addresses 12 Medium + 4 Low issues
- **Sprint 6 (P2):** Icon consolidation — remove unused icon fonts, standardize on Tabler → addresses 5 Medium + 2 Low issues
- **Sprint 7–8 (P2):** Framework resolution — migrate Ant Design to Symplify-styled wrappers → long-term architecture

---

## Visual Design & Polish

### Drug Interaction Color Token Migration — P0
- **Audit ref:** Section 2.1.1 — Hardcoded Color Values (Critical), rows 1–4
- **Issue:** `_drug-interaction.scss` uses Bootstrap 5 default colors (`#0d6efd`, `#28a745`, `#dc3545`, `#ffc107`) that conflict with Symplify brand palette and break dark mode.
- **Builder.io Action:** In the Design Tokens panel, define alias tokens: `--color-interaction-safe` → `var(--clinical-stable)` (#16A34A), `--color-interaction-warning` → `var(--clinical-caution)` (#CA8A04), `--color-interaction-danger` → `var(--clinical-critical)` (#DC2626), `--color-interaction-info` → `var(--clinical-info)` (#2563EB). Register the `DrugInteractionChecker` as a Custom Component with all color props bound to these Design Tokens instead of hardcoded hex. Add dark mode variants using the existing `:root[data-bs-theme=dark]` clinical token overrides.
- **Expected Result:** Drug interaction severity colors match clinical tokens across light/dark mode. Zero hardcoded hex values remain in the component. Visual parity with core platform severity indicators.

### Voice Documentation Color Token Migration — P0
- **Audit ref:** Section 2.1.1 — Hardcoded Color Values (Critical), row 5
- **Issue:** `_voice-documentation.scss` uses hardcoded `#dc3545` and `#6f42c1` instead of platform tokens, breaking dark mode.
- **Builder.io Action:** Register `VoiceRecorder`, `TranscriptionEditor`, `NoteFormatter`, and `MedicalTermsHighlighter` as Custom Components. Bind the recording indicator red to Design Token `--color-danger` (value: `var(--danger)` = #EF1E1E) and the symptom highlight purple to `--color-purple` (value: `var(--purple)` = #800080). Replace all background colors (`#d4edda`, `#f8d7da`, `#fff3cd`) with their Design Token equivalents (`--success-transparent`, `--danger-transparent`, `--warning-transparent`).
- **Expected Result:** Voice documentation components render correctly in both light and dark mode using Symplify's token system. No hardcoded color values remain.

### Shift Handoff Color Token Migration — P1
- **Audit ref:** Section 2.1.1 — Hardcoded Color Values, row 6; Section 9 — Dark Mode Gaps, row 3
- **Issue:** `_shift-handoff.scss` uses `#0d6efd`, `#667eea`, `#764ba2` and generic CSS variable fallbacks (`--primary-color`, `--card-bg`, `--text-primary`) that don't map to Symplify's token system.
- **Builder.io Action:** Create a `ShiftHandoff` Custom Component with all color references bound to Symplify Design Tokens: replace `--primary-color` → `--primary` (#2E37A4), `--card-bg` → `--white`, `--bg-light` → `--light` (#F5F6F8), `--text-primary` → `--heading-color` (#0A1B39), `--text-muted` → `--body-color`. Replace the AI summary gradient (`linear-gradient(135deg, #667eea, #764ba2)`) with `linear-gradient(135deg, var(--primary), var(--indigo))`. Add dark mode variants through existing `:root[data-bs-theme=dark]` token overrides.
- **Expected Result:** Shift handoff component inherits Symplify dark mode automatically. No standalone fallback CSS variables or hardcoded hex values remain.

### AI Assistant Bootstrap Variable Migration — P1
- **Audit ref:** Section 9 — Dark Mode Support Gaps, row 4
- **Issue:** AI assistant chat uses `var(--bs-body-bg)`, `var(--bs-body-color)`, `var(--bs-border-color)` — Bootstrap-namespaced variables that may diverge from Symplify's custom token definitions.
- **Builder.io Action:** Register the `AIAssistantPopup` as a Custom Component. In its style bindings, replace all `--bs-*` references with Symplify equivalents: `--bs-body-bg` → `--white`, `--bs-body-color` → `--body-color`, `--bs-border-color` → `--border-color`, `--bs-primary` → `--primary`, `--bs-light` → `--light`, `--bs-secondary-color` → `--gray-400`. Bind through Design Tokens panel.
- **Expected Result:** AI assistant popup renders consistently with the rest of the platform in both light and dark themes using a single token namespace.

### Email Priority Badge Token Migration — P1
- **Audit ref:** Section 2.1.1 — row 8; Section 5.4 — Badge Fragmentation, row 3
- **Issue:** `EmailPriorityBadge.tsx` uses inline styles with hardcoded Tailwind palette colors (`#DC2626`, `#F97316`, `#EAB308`, `#22C55E`) instead of Design Tokens.
- **Builder.io Action:** Refactor `EmailPriorityBadge` into a Builder.io Symbol with a `severity` prop (values: `critical`, `high`, `medium`, `low`). Bind background to Design Token `--clinical-{severity}-bg` and text color to `--clinical-{severity}`. Remove all inline `style={{ backgroundColor, color }}` attributes. Define responsive style: minimum width 60px, padding `4px 8px`, font-size bound to `--text-xs` (11px).
- **Expected Result:** Email priority badges use identical clinical severity colors as all other status indicators across the platform. Dark mode functions correctly via inherited token overrides.

### Triage Priority Badge Token Migration — P1
- **Audit ref:** Section 2.1.1 — row 9; Section 5.4 — Badge Fragmentation, row 2
- **Issue:** `TriagePriorityBadge.tsx` uses inline styles with Material Design colors (`#F44336`, `#FF9800`, `#4CAF50`, `#2196F3`) and Bootstrap `bg-*` utility classes, creating a third color system.
- **Builder.io Action:** Refactor `TriagePriorityBadge` into a Builder.io Symbol sharing the same `ClinicalSeverityBadge` Symbol as EmailPriorityBadge, with an additional `priority` prop (1–5). Map priority 1 → `--clinical-critical`, priority 2 → `--clinical-urgent`, priority 3 → `--clinical-caution`, priority 4 → `--clinical-stable`, priority 5 → `--clinical-info`. All colors via Design Tokens, zero inline styles.
- **Expected Result:** A clinician viewing "Critical" on any badge type — triage, email, drug interaction, or alert — sees the same `--clinical-critical` red (#DC2626 light / #EF4444 dark).

### Unified Semantic Color Hierarchy — P1
- **Audit ref:** Section 2.1.2 — Duplicate Semantic Color Systems; Section 11.1 — Unified Color Palette
- **Issue:** Three separate semantic color systems coexist: platform tokens (`--success` = #27AE60), clinical tokens (`--clinical-stable` = #16A34A), and Bootstrap defaults (#28a745). Same semantic meaning renders as three different colors.
- **Builder.io Action:** In the Design Tokens panel, establish a four-tier token hierarchy: **Primitive** (`--color-green-600: #16A34A`), **Semantic** (`--color-success: var(--color-green-600)`), **Clinical** (`--clinical-stable: var(--color-success)`), **Component** (`--badge-success-bg: var(--clinical-stable-bg)`). Remap `--success`, `--danger`, `--warning`, `--info` to reference primitives matching the clinical token values. Add a `[data-bs-theme=dark]` variant set for all primitives.
- **Expected Result:** A single source of truth for each semantic color. Changing `--color-green-600` cascades through all tiers. The three-system conflict is eliminated.

### Clinical Alert Widget Dark Mode Fix — P1
- **Audit ref:** Section 9 — Dark Mode Support Gaps, row 7
- **Issue:** `.alert-item` in the clinical alert widget uses hardcoded `background-color: #fff` that renders as a bright white patch in dark mode.
- **Builder.io Action:** Update the `ClinicalAlertWidget` Custom Component to bind `.alert-item` background to Design Token `--white` (which resolves to `#03041a` in dark mode per the existing `:root[data-bs-theme=dark]` override). Bind border-color to `--border-color`.
- **Expected Result:** Clinical alert items inherit dark mode backgrounds automatically with no visible light-mode artifacts.

### Interaction Alert Dark Mode Fix — P0
- **Audit ref:** Section 9 — Dark Mode Support Gaps, rows 1 and 5
- **Issue:** Drug interaction alert backgrounds (`#d4edda`, `#fff3cd`, `#f8d7da`) are hardcoded light-only colors that render as bright patches in dark mode — a critical visibility issue for clinical staff working night shifts.
- **Builder.io Action:** Replace all severity-specific background colors in the `InteractionAlert` Custom Component with Design Token bindings: `.severity-minor` bg → `--clinical-stable-bg`, `.severity-moderate` bg → `--clinical-caution-bg`, `.severity-major` bg → `--clinical-critical-bg`, `.severity-contraindicated` bg → `--clinical-critical-bg` with `--clinical-critical-border` border. These tokens already have dark mode variants defined in `_variables.scss`.
- **Expected Result:** Interaction alerts render with appropriate dark-mode severity backgrounds. Color contrast meets 4.5:1 minimum for text against both light and dark backgrounds.

### Card Border-Radius Unification — P1
- **Audit ref:** Section 5.2 — Card Component Inconsistencies, row 1
- **Issue:** Core card components use `border-radius: 5px` while AI feature cards use 8px–16px, creating inconsistent corner treatments across the platform.
- **Builder.io Action:** Define Design Token `--radius-card: 8px`. Update the `DashboardCard` Symbol and all card-based Symbols to bind `border-radius` to this token. For AI feature Custom Components (`ShiftHandoffWidget`, `DrugInteractionChecker`, `AIAssistantPopup`), override any component-level radius to bind to `--radius-card`. Remove all hardcoded `border-radius` values from child Box blocks.
- **Expected Result:** All card components render with uniform 8px border radius. Changing `--radius-card` in the Design Tokens panel cascades globally.

### Card Padding & Shadow Standardization — P1
- **Audit ref:** Section 5.2 — Card Component Inconsistencies, rows 2–4
- **Issue:** Card body padding varies between 20px (core), 24px (drug-interaction), and 12–16px (mobile). Card shadow and header background differ between core (border-only, transparent header) and AI features (box-shadow, gradient header).
- **Builder.io Action:** Define Design Tokens: `--space-card-inset: 20px`, `--space-card-inset-mobile: 12px`, `--shadow-card: var(--shadow-subtle)`. Update all card Symbols to bind padding to `--space-card-inset` with Responsive Styles override at mobile breakpoint (<768px) to `--space-card-inset-mobile`. Bind box-shadow to `--shadow-card`. Set card-header background to `transparent` via token. Apply same bindings to AI feature Custom Components.
- **Expected Result:** Uniform 20px card padding on desktop/tablet, 12px on mobile. Consistent subtle shadow and transparent headers across all modules.

### Modal Border-Radius Fix — P1
- **Audit ref:** Section 5.1 — Modal Border-Radius Conflict
- **Issue:** `.modal-content` declares `border-radius` twice (10px then `$border-radius` ≈ 4.8px) — the second wins, creating ~5px desktop / 12px mobile modal corners.
- **Builder.io Action:** Define Design Token `--radius-modal: 12px`. Create a `StandardModal` Symbol wrapping all modal content with border-radius bound to `--radius-modal`. Remove all hardcoded border-radius declarations. No Responsive Styles override needed — 12px applies at all breakpoints.
- **Expected Result:** All modals render with consistent 12px border radius across all viewports. Single token controls the value globally.

---

## Responsive Behavior

### Table Action Item Touch Target Fix — P0
- **Audit ref:** Section 4.2 — Touch Target Compliance, row 1
- **Issue:** `.action-item > a` renders at 22×22px on desktop, 32×32px on mobile — fails WCAG 2.5.5 (44px) on all viewports. Critical for clinical staff using gloved touch input at bedside.
- **Builder.io Action:** Update the `DataTableActionButton` Symbol: set base dimensions to `width: 32px; height: 32px` with Responsive Styles override at tablet (≥768px) and mobile (<768px) breakpoints to `width: 44px; height: 44px; min-width: 44px; min-height: 44px`. Bind dimensions to Design Tokens `--touch-target-desktop: 32px` and `--touch-target-mobile: 44px`. Ensure `display: flex; align-items: center; justify-content: center` on the Box block.
- **Expected Result:** Table action buttons meet 32px minimum on desktop and 44px on tablet/mobile. Gloved-hand clinical workflows no longer have undersized tap targets.

### Extra-Small Button Touch Target Fix — P0
- **Audit ref:** Section 4.2 — Touch Target Compliance, row 3
- **Issue:** `.btn-icon.btn-xs` renders at 20×20px with no mobile override — fails WCAG on all viewports.
- **Builder.io Action:** Update the `IconButton` Symbol's `xs` variant: set base size to `min-width: 32px; min-height: 32px`. Add Responsive Styles at mobile (<768px): `min-width: 44px; min-height: 44px`. If the 32px minimum is too large for the intended context, consider replacing `.btn-xs` with a `compact` variant at 28px with 44px mobile override, and flag for design review.
- **Expected Result:** No interactive element renders below 32px on any viewport. Mobile touch targets meet 44px minimum.

### Icon Button Global Size Override Fix — P0
- **Audit ref:** Section 4.1 — Button Sizing Conflicts, rows 1–2
- **Issue:** `_ai-pages.scss` redefines `.btn-icon` to 30×30px globally, overriding the 32×32px definition in `_buttons.scss` and dropping below WCAG minimum.
- **Builder.io Action:** Remove the `.btn-icon` override from the AI pages stylesheet. Create a single `IconButton` Symbol with base dimensions bound to Design Token `--size-btn-icon: 32px`. Register `sm` (calc(0.6rem + 1.5em + 2px)), and `lg` (calc(1.3rem + 1.5em + 2px)) variants as Symbol prop options. Apply Responsive Styles at mobile (<768px): `min-width: 44px; min-height: 44px`.
- **Expected Result:** All icon buttons render at 32px minimum. No stylesheet can accidentally reduce size below the token value. Mobile always gets 44px.

### Header Link Touch Target — P1
- **Audit ref:** Section 4.2 — Touch Target Compliance, row 4
- **Issue:** `.header-link` renders at 32×32px on all viewports with no mobile size increase — fails AAA on touch devices.
- **Builder.io Action:** Update the `HeaderActionLink` Symbol with Responsive Styles: desktop (≥992px) `width: 32px; height: 32px`; tablet and mobile (<992px) `width: 44px; height: 44px`. Bind to Design Tokens `--touch-target-desktop` and `--touch-target-mobile`.
- **Expected Result:** Header action links meet 44px minimum on tablet and mobile viewports.

### Form Checkbox Touch Target — P1
- **Audit ref:** Section 4.2 — Touch Target Compliance, row 5
- **Issue:** Mobile form checkboxes render at 20×20px — fails AAA touch target requirement.
- **Builder.io Action:** In the `FormCheckbox` Symbol, add Responsive Styles at mobile (<768px): `width: 24px; height: 24px` for the input element, with a surrounding Box providing a 44×44px clickable area via padding. Bind to Design Token `--size-checkbox-mobile: 24px`.
- **Expected Result:** Checkbox visual renders at 24px on mobile with a 44px effective touch area. Meets AAA requirements.

### Breakpoint Strategy Alignment — P1
- **Audit ref:** Section 7.2 — Responsive Breakpoint Strategy Conflict
- **Issue:** AI feature stylesheets use raw `@media` queries with hardcoded breakpoints (480px, 768px, 1024px, 1440px) that don't align with the platform's defined breakpoint map (576px, 768px, 992px, 1200px, 1400px).
- **Builder.io Action:** Configure Builder.io's Responsive Styles breakpoints to match Symplify's `$breakpoints` map: Large desktop ≥1400px, Desktop ≥1200px, Laptop ≥992px, Tablet ≥768px, Mobile ≥576px, Small mobile <576px. All Custom Components (ShiftHandoff, AIAssistant, DrugInteraction) must use Builder.io's built-in Responsive Styles at these breakpoints rather than hardcoded `@media` in their stylesheets. Add a 374px breakpoint as "Extra small mobile" for the shift-handoff widget's existing small-device styles.
- **Expected Result:** A single, unified set of breakpoints governs all responsive behavior across core platform and AI features.

---

## Typography & Hierarchy

### Typography Scale Standardization — P1
- **Audit ref:** Section 3.1 — Font Size Fragmentation; Section 11.2 — Typography Scale
- **Issue:** At least 12 different ad-hoc font sizes exist across the codebase (10px–22px) using inconsistent units (px vs rem) and `!important` overrides. The `_ai-pages.scss` utility classes (`fs-11` through `fs-22`) use px with `!important`, competing with rem-based component styles.
- **Builder.io Action:** In the Design Tokens panel, define a typography scale: `--text-xs: 0.6875rem` (11px), `--text-sm: 0.75rem` (12px), `--text-base: 0.875rem` (14px), `--text-md: 1rem` (16px), `--text-lg: 1.125rem` (18px), `--text-xl: 1.25rem` (20px), `--text-2xl: 1.5rem` (24px). All Text blocks in Builder.io should bind `font-size` to one of these tokens. Remove `!important` from AI page utility classes by eliminating them entirely — use Design Token bindings instead.
- **Expected Result:** Every text element across the platform uses one of 7 defined token sizes. No hardcoded px font sizes remain outside of the token definitions.

### Button Font Size Dual Declaration Fix — P1
- **Audit ref:** Section 3.1 — Font Size Fragmentation, rows 2–3
- **Issue:** `.btn` base uses `0.75rem` (12px); `.btn-sm` declares font-size twice in the same rule block (`0.75rem` then `13px`) — the second wins, creating a 13px button that matches neither the base nor any scale step.
- **Builder.io Action:** Update the `StandardButton` Symbol font-size bindings: base `.btn` → Design Token `--text-sm` (0.75rem / 12px), `.btn-sm` → `--text-sm` (single declaration, remove duplicate), `.btn-lg` → `--text-base` (0.875rem / 14px). Remove all duplicate font-size declarations. Apply responsive override at mobile (<768px): `--text-base` (0.8125rem / 13px) for base buttons.
- **Expected Result:** Button font sizes follow the typography scale with no duplicate declarations. All values are rem-based.

### AI Component Font Size Migration — P1
- **Audit ref:** Section 3.1 — Font Size Fragmentation, row 7
- **Issue:** AI component SCSS files use px-based font sizes (10px–18px) throughout, bypassing the rem-based type system and preventing user font-size scaling.
- **Builder.io Action:** In all AI feature Custom Components (`AIAssistantPopup`, `ShiftHandoffSummary`, `DrugInteractionChecker`, `VoiceRecorder`), replace every px-based font-size with a Design Token binding: 10px → `--text-xs`, 11px → `--text-xs`, 12px → `--text-sm`, 13px → `--text-sm`, 14px → `--text-base`, 16px → `--text-md`, 18px → `--text-lg`. For the 10px values used in timestamps and fine print, use `--text-xs` (11px) — the 1px increase improves readability without layout impact.
- **Expected Result:** All AI components scale with browser/OS font-size preferences. Supports WCAG 1.4.4 (resize text up to 200%).

### Page Header Weight Inconsistency — P1
- **Audit ref:** Section 3.2 — Font Weight Inconsistencies; Section 5.3 — Navigation & Back-Link Patterns
- **Issue:** `PageHeader` component uses `h4.fw-bold` (700) while detail pages use `h6.fw-semibold` (600) or `h6.fw-bold` (700) inconsistently for the same back-navigation pattern.
- **Builder.io Action:** Create a `PageHeader` Symbol with two defined variants via props: `variant="page"` (h4, font-weight bound to `--font-weight-bold` = 700, with Breadcrumb child Symbol) and `variant="back"` (h6, font-weight bound to `--font-weight-semibold` = 600, with back-arrow icon and parent page link). All pages must use one of these two variants. Doctor Details and Create Patient pages should both use `variant="back"`.
- **Expected Result:** Consistent heading hierarchy: page-level headers always `h4 bold`, back-navigation always `h6 semibold`. Zero ad-hoc heading patterns remain.

### Form Control Font Size Consistency — P2
- **Audit ref:** Section 3.1 — Font Size Fragmentation, rows 4–6
- **Issue:** `.form-select` uses hardcoded `14px` instead of rem. `.card-title` uses `16px` while `.header-title` uses `1rem` (identical values, different units).
- **Builder.io Action:** In the `FormSelect` Symbol and `FormInput` Symbol, bind font-size to Design Token `--text-base` (0.875rem). In the `CardHeader` Symbol, bind both `.card-title` and `.header-title` font-size to `--text-md` (1rem). All values use rem units exclusively.
- **Expected Result:** Consistent unit system across all form and card typography. Changing `--text-base` cascades to all form elements.

---

## Component Consistency

### Unified Clinical Severity Badge — P0
- **Audit ref:** Section 5.4 — Badge & Status Indicator Fragmentation (all 5 rows)
- **Issue:** Five different badge/status systems render "Critical" as five different shades of red. A clinician's mental model of severity-by-color is broken across modules, impacting patient safety.
- **Builder.io Action:** Create a single `ClinicalSeverityBadge` Symbol with props: `severity` (enum: `critical`, `urgent/high`, `caution/moderate/medium`, `stable/low`, `info`), `size` (enum: `sm`, `md`, `lg`), `showLabel` (boolean), `showIcon` (boolean). Bind all colors to clinical Design Tokens: text → `--clinical-{severity}`, background → `--clinical-{severity}-bg`, border → `--clinical-{severity}-border`. Define icon bindings per severity: critical → `ti-alert-triangle`, urgent → `ti-alert-circle`, caution → `ti-clock`, stable → `ti-check`, info → `ti-info-circle`. Replace `TriagePriorityBadge`, `EmailPriorityBadge`, `SeverityBadge`, `.cc-severity-badge`, and `badge-soft-*` usage across all pages with this single Symbol.
- **Expected Result:** "Critical" renders as `--clinical-critical` (#DC2626 light / #EF4444 dark) everywhere — triage, email, drug interaction, alerts, and AI assistant. One Symbol, one color, one mental model.

### Standard Button Symbol — P0
- **Audit ref:** Section 4.1 — Button Sizing Conflicts; Section 11.3 — Component Standardization, row 1
- **Issue:** Three competing button size definitions across `_buttons.scss`, `_ai-pages.scss`, and mobile overrides create unpredictable sizing.
- **Builder.io Action:** Create a `StandardButton` Symbol with props: `variant` (primary, secondary, outline, soft, white, ghost), `size` (sm, md, lg), `iconOnly` (boolean). Bind spacing to Design Tokens: sm → `padding: 6px 10px`, md → `padding: 8px 16px`, lg → `padding: 10px 20px`. Bind `min-height` to `--touch-target-desktop: 32px`. Add Responsive Styles at mobile (<768px): `min-height: var(--touch-target-mobile)` (44px). Bind font-size per size to typography tokens. Remove `.btn-xs` variant entirely (below minimum touch target).
- **Expected Result:** A single button Symbol governs all sizing. No competing stylesheets. All interactive buttons meet touch target requirements.

### Standard Modal Symbol — P1
- **Audit ref:** Section 5.1 — Modal Border-Radius Conflict; Section 8 — Framework Conflict, row 5
- **Issue:** Dual border-radius declaration (10px vs ~5px vs 12px mobile) and competing Bootstrap `.modal` vs Ant Design `Modal` patterns.
- **Builder.io Action:** Create a `StandardModal` Symbol wrapping all modal UI. Define props: `size` (sm, md, lg, fullWidth), `showCloseButton` (boolean). Bind border-radius to `--radius-modal: 12px`. Bind header padding to `16px 20px`, body to `20px`, footer to `16px 20px` — all via Design Tokens. Add Responsive Styles at mobile (<768px): `margin: 8px`, `max-width: calc(100vw - 16px)`, `border-radius: 12px`, sticky header/footer. All Ant Design `Modal` usage in AI features should be replaced with this Symbol.
- **Expected Result:** Consistent modal appearance across all pages and frameworks. One border-radius, one padding system, one responsive behavior.

### Standard Form Input Symbol — P1
- **Audit ref:** Section 8 — Framework Conflict, rows 1–2; Section 11.3 — Component Standardization, row 5
- **Issue:** Bootstrap `.form-select` and `.form-control` styles compete with Ant Design `<Select>` and `<DatePicker>` components, creating visual inconsistency on the Appointments page.
- **Builder.io Action:** Create a `FormInput` Symbol with props: `type` (text, email, password, select, date, time, phone), `size` (sm, md, lg), `required` (boolean), `error` (string). For `select` and `date` types, register wrapper Custom Components that apply Symplify styling over Ant Design components. Bind padding to `--space-2` (8px) vertical / `--space-3` (12px) horizontal. Bind font-size to `--text-base`. Add Responsive Styles at mobile (<768px): `min-height: 48px; font-size: 16px` (prevents iOS zoom). Bind border to `1px solid var(--border-color)`, focus state to `border-color: var(--primary)`.
- **Expected Result:** All form inputs — whether Bootstrap-native or Ant Design-wrapped — render identically. Mobile inputs are 48px minimum height with 16px font.

### Back-Navigation Pattern Standardization — P1
- **Audit ref:** Section 5.3 — Navigation & Back-Link Patterns
- **Issue:** Doctor Details uses `h6.fw-semibold.fs-14` while Create Patient uses `h6.fw-bold` — directly comparable workflows with different heading treatments.
- **Builder.io Action:** All detail/create pages (Doctor Details, Create Patient, Edit Patient, Edit Doctor, Patient Details, Appointment Details, Prescription Details) must use the `PageHeader` Symbol with `variant="back"` prop. The Symbol renders: `h6` tag, font-weight bound to `--font-weight-semibold` (600), font-size bound to `--text-base` (14px), Tabler icon `ti-chevron-left` with `me-1` spacing, parent page name as text link. Remove all page-specific back-link markup.
- **Expected Result:** Every detail/create page has identical back-navigation: h6, semibold, 14px, chevron icon. Consistent landmark structure for screen readers.

---

## Layout & Spacing

### Spacing Token Adoption — P1
- **Audit ref:** Section 7.1 — Spacing Token Adoption
- **Issue:** The 4px-grid spacing tokens (`--space-1` through `--space-16`) exist in `_variables.scss` but are used by only one component. All other spacing is hardcoded.
- **Builder.io Action:** Define the full spacing scale in Builder.io's Design Tokens panel: `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 20px`, `--space-6: 24px`, `--space-8: 32px`, `--space-10: 40px`, `--space-12: 48px`, `--space-16: 64px`. All Box and Section blocks must bind padding and margin to these tokens. Component-specific aliases: `--space-card-inset: var(--space-5)` (20px), `--space-card-inset-mobile: var(--space-3)` (12px), `--space-card-header: var(--space-4) var(--space-5)`, `--space-modal-body: var(--space-5)`, `--space-table-cell: var(--space-3) var(--space-4)`.
- **Expected Result:** ≥95% of spacing values reference Design Tokens. Responsive spacing adjustments via breakpoint token overrides rather than component-level `@media` rules.

### Card Body Responsive Spacing — P1
- **Audit ref:** Section 7.1 — Spacing Token Adoption, rows 1–2
- **Issue:** Card body padding is hardcoded at 20px desktop / 16px tablet / 12px mobile in `_card.scss`, ignoring the `--spacing-card` responsive token.
- **Builder.io Action:** Update the `DashboardCard` Symbol's body Box block: bind padding to `--space-card-inset`. Add Responsive Styles: tablet (≥768px, <992px) → `--space-card-inset-tablet: var(--space-4)` (16px), mobile (<768px) → `--space-card-inset-mobile: var(--space-3)` (12px). Similarly bind card-header padding to `--space-card-header`.
- **Expected Result:** Card spacing adjusts responsively via token overrides, not hardcoded values in component styles.

### AI Chat Component Spacing — P1
- **Audit ref:** Section 7.1 — Spacing Token Adoption, row 5
- **Issue:** AI assistant chat uses hardcoded 10px–14px pixel spacing throughout, disconnected from the spacing system.
- **Builder.io Action:** In the `AIAssistantPopup` Custom Component, replace all padding/margin values with Design Token references: popup body padding → `--space-3` (12px), message bubble padding → `--space-3 --space-4` (12px 16px), footer padding → `--space-3` (12px), gap between messages → `--space-3` (12px), quick actions padding → `--space-2 --space-3` (8px 12px).
- **Expected Result:** AI chat spacing aligns with the 4px grid. Changing the spacing scale propagates to chat components.

---

## Interaction States

### Button Disabled State Consistency — P1
- **Audit ref:** Section 4.1 — Button Sizing Conflicts (implicit in button system audit)
- **Issue:** Disabled buttons reset to `background-color: $white; border-color: $border-color; color: $gray-900` regardless of variant, stripping all color context and making it impossible to distinguish which variant is disabled.
- **Builder.io Action:** Update the `StandardButton` Symbol to define disabled states per variant: primary disabled → `background: var(--primary-transparent); color: var(--primary); opacity: 0.5; cursor: not-allowed`, secondary disabled → `background: var(--secondary-transparent); color: var(--secondary); opacity: 0.5`. Add `aria-disabled="true"` attribute binding when disabled prop is true. Maintain variant color hint at reduced opacity.
- **Expected Result:** Disabled buttons retain variant color identity at 50% opacity, providing visual context about which action is unavailable. Meets WCAG disabled state patterns.

### Button Animation Hover State — P2
- **Audit ref:** Section 4.1 — Button Sizing Conflicts (button animation system)
- **Issue:** `.btn-animation` hover states use `!important` overrides and `rgba()` with CSS custom properties (which may not interpolate correctly). Only 7 of 13 theme colors have animation variants defined.
- **Builder.io Action:** In the `StandardButton` Symbol, define hover/focus/active CSS pseudo-class overrides via Builder.io's style panel for each variant: hover → `background: var(--{variant}-transparent); color: var(--{variant}); border-color: var(--{variant})`. Remove `!important` declarations. Extend to all 13 theme colors. Add `transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease`.
- **Expected Result:** Smooth, consistent hover transitions on all button variants without `!important` overrides.

---

## Accessibility

### Semantic Heading Hierarchy — P0
- **Audit ref:** Section 5.3 — Navigation & Back-Link Patterns
- **Issue:** Pages mix `h4` and `h6` tags for the same structural role (page title vs. back-nav), potentially creating heading level skip violations (h4 → h6 skips h5) that confuse screen reader navigation.
- **Builder.io Action:** Enforce heading hierarchy in all Builder.io Sections: `h1` reserved for site name (in header, visually hidden if needed), `h2` for page title (in `PageHeader` Symbol), `h3` for section headers (in `SectionHeader` Symbol), `h4`+ for subsection content. The `PageHeader` Symbol's Text block must use `h2` semantic tag with visual styling matching the current `h4.fw-bold` appearance (font-size bound to `--text-xl` = 20px, weight `--font-weight-bold`). The back-nav variant uses a `nav` landmark with `aria-label="Back navigation"` instead of a heading tag.
- **Expected Result:** Zero heading level skips on any page. Screen readers encounter a logical h1 → h2 → h3 hierarchy. Back-navigation is a proper `nav` landmark.

### ARIA Labels for Clinical Badges — P0
- **Audit ref:** Section 5.4 — Badge & Status Indicator Fragmentation (implicit accessibility gap)
- **Issue:** Clinical severity badges convey critical patient safety information via color alone, violating WCAG 1.4.1 (Use of Color).
- **Builder.io Action:** In the `ClinicalSeverityBadge` Symbol, add `role="status"` and `aria-label="Severity: {severity level}"` attribute bindings. Ensure text label is always visible (not hidden by `showLabel: false` without an accessible alternative). Add visible icon per severity level as a secondary non-color indicator. Add pattern/border-style differentiation: critical → solid left border, urgent → dashed, caution → dotted.
- **Expected Result:** Severity is communicated through color, icon, text label, and border style. Meets WCAG 1.4.1 and 1.4.11. Screen readers announce severity level.

### Focus Indicators on Interactive Elements — P1
- **Audit ref:** Section 4.2 — Touch Target Compliance (implicit: all interactive elements need focus styles)
- **Issue:** Focus styles are not consistently defined across the platform — form controls suppress box-shadow on focus (`box-shadow: none`), and AI components don't define `:focus-visible` states.
- **Builder.io Action:** Define a global focus indicator Design Token: `--focus-ring: 2px solid var(--primary); outline-offset: 2px`. Apply via CSS pseudo-class override in all interactive Symbols (`StandardButton`, `FormInput`, `DataTableActionButton`, `IconButton`): `:focus-visible { outline: var(--focus-ring) }`. Remove all `box-shadow: none` on `:focus` — replace with the outline pattern. AI Custom Components must include `:focus-visible` styles in their registered CSS.
- **Expected Result:** Visible, consistent focus indicator on all interactive elements. Keyboard navigation is visually trackable across the entire platform.

---

## Performance

### Icon Font Consolidation — P2
- **Audit ref:** Section 6.1 — Multiple Icon Libraries
- **Issue:** Seven icon font families loaded (Tabler, Feather, Font Awesome, Material Icons, Iconsax, Line Awesome, Bootstrap Icons) totaling ~300–500KB of unnecessary font data. Tabler Icons is the dominant library.
- **Builder.io Action:** Audit all pages and Custom Components to identify icon usage per library. For each non-Tabler icon, find the Tabler equivalent and replace. Remove font imports for Feather, Font Awesome, Material Icons, Iconsax, Line Awesome, and Bootstrap Icons from the Builder.io project's global styles and any Custom Component registrations. Retain only the Tabler Icons CDN import. Use Builder.io's Performance Insights to measure font payload reduction.
- **Expected Result:** Single icon library (Tabler Icons). Font payload reduced by ~300–400KB. No visual regressions (all icons have Tabler equivalents).

### Ant Design Component Wrapping — P2
- **Audit ref:** Section 8 — Framework Conflict: Bootstrap 5 vs. Ant Design
- **Issue:** Ant Design components (`<Calendar>`, `<DatePicker>`, `<Select>`, `<Rate>`, `<Spin>`, `<Modal>`) inject their own CSS that conflicts with Bootstrap styles, increasing CSS payload and causing visual inconsistencies.
- **Builder.io Action:** For each Ant Design component in use, register a Custom Component wrapper in Builder.io that: (1) applies Symplify Design Token styling over Ant Design defaults, (2) suppresses Ant Design CSS for properties that conflict with Bootstrap (using CSS specificity or `!important` scoped to the wrapper), (3) exposes the same prop interface as the native Ant component for Builder.io content binding. Priority order: `DatePicker` (most visible conflict on Appointments page) → `Select` → `Calendar` → `Modal` → `Spin` → `Rate`.
- **Expected Result:** Ant Design functionality preserved with Symplify visual appearance. CSS conflicts eliminated at the wrapper boundary. Progressive path toward full replacement.

---

## Content Strategy & SEO

### Breadcrumb Consistency — P2
- **Audit ref:** Section 5.3 — Navigation & Back-Link Patterns
- **Issue:** The `Breadcrumb` component exists and is used in `PageHeader`, but detail/create pages bypass it entirely, using ad-hoc back-link patterns instead.
- **Builder.io Action:** Create a `Breadcrumb` Symbol with `schema.org BreadcrumbList` structured data embedded via a Custom Code block. Define content slots for each crumb level (Home → Module → Page → Detail). Ensure all pages — including detail/create pages — render the Breadcrumb Symbol within the `PageHeader` Symbol. Bind crumb data to a Content Model field for dynamic pages.
- **Expected Result:** Every page renders a breadcrumb trail with valid schema.org markup. Google Rich Results Test validates BreadcrumbList on all URLs.

---

## Ambiguous Findings

### Sidebar Theme Variants — Needs Clarification
- **Audit ref:** Section 2 — Color System Analysis (implicit from `_variables.scss` review)
- **Issue:** The audit identified 7 sidebar color variants (`sidebar1`–`sidebar7`) plus 7 gradient variants and a custom dark teal variant. The audit did not explicitly flag these as inconsistencies, but the sheer volume (15 sidebar themes) suggests a theming system that may never be exercised in the healthcare production context.
- **Clarification needed:** Are all 15 sidebar variants used in production? If not, which should be deprecated? Should Builder.io manage sidebar theming through Targeting (audience-based) or a Content Model field?

### RTL Support Completeness — Needs Clarification
- **Audit ref:** Section structure/_rtl.scss exists, `[dir="rtl"]` selectors appear in breadcrumb and form styles
- **Issue:** RTL support is partially implemented but the audit did not assess its completeness or flag specific RTL issues.
- **Clarification needed:** Is RTL support required for any deployment context? If yes, a dedicated RTL audit should be conducted before Builder.io implementation to ensure all Symbols and Custom Components render correctly in both directions.

### Loading/Spinner Component Unification — Needs Clarification
- **Audit ref:** Section 8 — Framework Conflict, row 7
- **Issue:** The audit notes both a custom CSS spinner (shift-handoff) and Ant Design `<Spin>` (TriagePriorityBadge) are in use, but does not specify which pattern should be the standard.
- **Clarification needed:** Should a unified `LoadingSpinner` Symbol be created? If so, should it follow the Ant Design spinner visual or a custom Symplify-branded animation?

### Calendar Component Strategy — Needs Clarification
- **Audit ref:** Section 8 — Framework Conflict, row 3
- **Issue:** Both FullCalendar plugin and Ant Design `<Calendar>` are in use, but the audit flags this as Medium severity without specifying a preferred approach.
- **Clarification needed:** Should one calendar implementation be chosen? FullCalendar offers richer event management; Ant Calendar is lighter. The choice impacts the Builder.io Custom Component registration strategy.

---

## Quality Assurance Checklist

Before publishing any generated designs, validate against the following:

- [ ] Every P0 directive has been implemented and verified
- [ ] Components render correctly across all six target breakpoints (xxl, xl, lg, md, sm, xs)
- [ ] Accessibility audit passes (axe-core): zero critical/serious violations
- [ ] Color contrast meets WCAG AA minimums (4.5:1 text, 3:1 large text) on all text elements in both light and dark mode
- [ ] Clinical severity colors are identical across all badge/status components (verify with screenshot comparison)
- [ ] Keyboard navigation flows logically through all interactive components (tab order audit)
- [ ] Touch targets measure ≥32px on desktop and ≥44px on mobile (verify via DevTools element inspector)
- [ ] Performance: font payload reduced by ≥300KB after icon consolidation
- [ ] Brand consistency: all colors, fonts, and spacing reference Design Tokens (audit with Stylelint `no-hardcoded-values` rule)
- [ ] Interactive states (hover, focus-visible, active, disabled) present on all actionable elements
- [ ] Dark mode renders correctly for all AI feature components (drug interaction, voice documentation, shift handoff, AI assistant, email priority, clinical alerts)
- [ ] Zero hardcoded hex color values remain in any Custom Component or Symbol
- [ ] Breadcrumb structured data validates via Google Rich Results Test
- [ ] User flows tested end-to-end on real devices: iPad with glove-compatible stylus (clinical), desktop Chrome, iPhone Safari

---

## Success Metrics Tracking

Configure Builder.io analytics and connected tools to monitor improvement against audit baselines:

| Metric Category | What to Track | Target |
|---|---|---|
| **Performance** | Font payload size, LCP, CLS, INP | Font payload <200KB (from ~500KB); LCP <2.5s; CLS <0.1; INP <200ms |
| **Accessibility** | axe-core violation count, touch target compliance rate, heading hierarchy compliance | Zero critical/serious violations; 100% elements ≥32px desktop / ≥44px mobile; zero heading skips |
| **Design Token Adoption** | % of color, spacing, and typography values using Design Tokens vs. hardcoded | ≥95% token usage (from ~40% current) |
| **Severity Color Consistency** | Number of distinct hex values used for same semantic severity | 1 value per severity per theme (from 3–5 current) |
| **Dark Mode Coverage** | Number of components with hardcoded light-only colors | Zero (from 7 current per audit Section 9) |
| **Component Reuse** | Number of unique badge/button/card implementations | 1 Symbol per component type (from 3–5 current) |
| **Clinical Workflow UX** | Task completion rate for bedside documentation, triage assessment | Improvement over pre-audit baseline (establish via user testing) |
