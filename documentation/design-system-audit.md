# Design System Audit — Symplify 1.7.4

**Date:** March 29, 2026
**Auditor:** Claude (Design System Review)
**Scope:** Full codebase — tokens, components, patterns, naming, theming

---

## Summary

**Components reviewed:** 36 shared + 3 sidebars + theme system | **Issues found:** 18 | **Score: 52/100**

The Symplify design system has a strong foundation — well-structured SCSS tokens, a responsive spacing grid, clinical color semantics, and a functioning theme engine with dark mode. However, adoption is inconsistent. Hardcoded values outnumber token references in many areas, three separate sidebar implementations duplicate logic, inline styles are pervasive (515 instances), and z-index values are unmanaged. The type system offers almost no safety, and two competing select component libraries coexist without clear guidance.

---

## 1. Naming Consistency

| Issue | Where | Recommendation |
|-------|-------|----------------|
| Sidebar component naming: `Sidebar`, `SidebarTwo`, `Sidebarthree` | `src/core/common/` | Standardize to `SidebarThree` (PascalCase) |
| Directory naming: `sidebar/`, `sidebar-two/`, `sidebarthree/` | `src/core/common/` | Adopt consistent kebab-case: `sidebar-three/` |
| Feature directory typo: `feathure-components` | `src/feature-module/` | Rename to `feature-components` |
| Interface field casing: `feesCode`, `cardNo`, `studentName` mixed with `Jan`, `APR`, `mar` | `src/core/data/interface/index.tsx` | Standardize on camelCase for all data fields |
| Ad-hoc CSS class names: `add-invest`, `remove-advices`, `add-schedule-btn` | Dynamic form components | Document naming convention; adopt BEM or consistent prefix |

---

## 2. Token Coverage

| Category | Tokens Defined | Hardcoded Values Found | Adoption Rate |
|----------|---------------|----------------------|---------------|
| **Colors** | 126 variables + CSS custom props | ~790 hardcoded hex values (396 SCSS + 394 TSX) | ~40% |
| **Spacing** | 10-step scale (4px grid) + aliases | ~299 hardcoded pixel values in SCSS | ~50% |
| **Typography** | 7-step scale + 4 weights | ~382 hardcoded font-size declarations | ~35% |
| **Shadows** | 3 elevation tiers | Not audited in detail | — |
| **Z-Index** | **None defined** | 15+ unique values (from -1 to 99999) | 0% |
| **Border Radius** | 2 tokens (card, modal) | Scattered `border-radius` declarations | ~30% |
| **Motion** | **None defined** | Ad-hoc transitions in inline styles | 0% |

### Hardcoded Color Hotspots

The primary color `#2e37a4` appears hardcoded 15+ times in TSX files. Medical status colors (`#4CAF50`, `#FF9800`, `#F44336`) are used in React components but have no corresponding design tokens — the clinical tokens use different values (`#16A34A`, `#EA580C`, `#DC2626`), creating two competing status color systems.

### Hardcoded Spacing Hotspots

Plugin override files (calendar, charts, select2, datatable) account for ~70% of hardcoded spacing. Core component SCSS files use tokens more consistently, but the plugin layer undermines the system.

---

## 3. Component Completeness

| Component | States | Variants | Accessibility | Docs | Score |
|-----------|--------|----------|---------------|------|-------|
| **DataTable** | ✅ Loading, empty, selected | ✅ Configurable columns | ⚠️ No ARIA roles on custom pagination | ❌ | 7/10 |
| **CommonSelect** | ⚠️ Default only | ⚠️ Single style | ⚠️ Relies on react-select defaults | ❌ | 4/10 |
| **PageHeader** | ✅ | ✅ Flexible title/breadcrumb/actions | ✅ Semantic heading | ❌ | 7/10 |
| **Sidebar (Admin)** | ✅ Expanded, collapsed, hover, mobile | ✅ Mini, full, hidden layouts | ⚠️ No skip-nav, keyboard nav partial | ❌ | 6/10 |
| **SidebarTwo (Doctor)** | ✅ Same states | ⚠️ Duplicated implementation | ⚠️ Same gaps | ❌ | 5/10 |
| **Sidebarthree (Patient)** | ✅ Same states | ⚠️ Duplicated implementation | ⚠️ Same gaps | ❌ | 5/10 |
| **Header** | ✅ Multiple states | ✅ Role-aware content | ⚠️ Search modal lacks focus trap | ❌ | 6/10 |
| **Modal (pattern)** | ⚠️ Open/close only | ❌ No reusable component | ❌ No focus management | ❌ | 2/10 |
| **Button (pattern)** | ✅ Via Bootstrap | ✅ Via Bootstrap classes | ✅ Via Bootstrap | ❌ | 7/10 |
| **Form Inputs** | ✅ Via Bootstrap | ⚠️ Mixed select libraries | ⚠️ Label association inconsistent | ❌ | 5/10 |
| **Dynamic Forms** | ⚠️ Basic add/remove | ❌ 6 unique implementations, no base | ❌ No error states | ❌ | 3/10 |
| **ErrorBoundary** | ✅ Error/normal | ✅ | N/A | ❌ | 6/10 |
| **Theme Settings** | ✅ | ✅ Layout, color, sidebar, topbar, RTL | ⚠️ Toggle a11y unclear | ❌ | 6/10 |

**Documentation score: 0/10** — No component has written usage documentation, prop tables, or examples.

---

## 4. Architecture Issues

### 4a. Competing UI Libraries

The project imports **Bootstrap 5.3**, **Ant Design 5.29**, **React Bootstrap**, and **PrimeReact** simultaneously. This creates:

- **Two select components**: `CommonSelect` (react-select) vs Ant Design `<Select>` — used interchangeably with no guidance on when to use which
- **Two table systems**: Ant Design `<Table>` (in DataTable) and Bootstrap table classes elsewhere
- **Multiple modal approaches**: Bootstrap data-attributes, potential Ant Design modals, no unified wrapper

### 4b. Three Sidebar Implementations

`Sidebar`, `SidebarTwo`, and `Sidebarthree` share ~80% identical logic (submenu toggling, mini-sidebar detection, mobile handling, active route highlighting) but are maintained as three separate files. Changes must be replicated across all three.

### 4c. Theme State Duplication

Theme attributes are applied in at least three places: `ThemeSettings` component, `Header` component, and `Feature` layout. No single source of truth — both Redux state and direct DOM `getAttribute()` calls are used to read the current theme.

### 4d. Type Safety

The `TableData` interface contains **296 properties, nearly all typed as `any`**. This provides zero compile-time safety and makes refactoring dangerous.

### 4e. Inline Style Proliferation

**515 `style={{}}` instances** across TSX files. Many contain hardcoded colors (`backgroundColor: 'rgba(29, 62, 94, 1)'`), display toggles (`display: openSubmenus.x ? "block" : "none"`), and spacing values that should use CSS classes or tokens.

---

## 5. Z-Index Landscape (No Layer System)

| Value | Used In | Count |
|-------|---------|-------|
| 99999 | `_theme.scss` sidebar overlay | 1 |
| 9999 | Sidebar, header, dragula, email | 4+ |
| 1050 | Modals, sidebar overlays, AI assistant | 5+ |
| 1000 | Dropdowns, header, shift handoff | 4+ |
| 10 | Various components | 6+ |
| -1 | Invoice backgrounds, simplebar | 2+ |

No centralized z-index scale exists. Values are assigned ad-hoc, creating fragile stacking contexts where any new component risks overlapping existing UI.

---

## 6. What's Working Well

- **Design token foundation is solid**: 126 colors, 10-step spacing grid, 7-step type scale, 3 shadow tiers, responsive aliases — all well-organized in `_variables.scss`
- **Clinical tokens are thoughtful**: Critical/Urgent/Caution/Stable/Info with background, border, and dark-mode variants — appropriate for a healthcare platform
- **Responsive system is centralized**: Breakpoint mixins with mobile-first guidance, touch-target tokens (44px mobile / 32px desktop)
- **Theme engine works end-to-end**: Dark mode, 7+ sidebar themes, 7 topbar themes, RTL, layout modes — all functional with localStorage persistence and version tracking
- **Icon usage is consistent in core**: Tabler Icons is the primary library with a clean `ti ti-{name}` class pattern

---

## 7. Priority Actions

### P0 — High Impact, High Urgency

1. **Consolidate sidebars into one configurable component.** Extract shared logic (submenu state, mini-sidebar detection, mobile toggle, route highlighting) into a base component. Pass role-specific menu data and styles as props. This eliminates triple-maintenance and reduces bugs.

2. **Establish a z-index layer system.** Define semantic layers in `_variables.scss` (`$z-dropdown: 1000`, `$z-sticky: 1020`, `$z-modal: 1050`, `$z-tooltip: 1070`, `$z-overlay: 9000`). Replace all hardcoded z-index values. This prevents stacking bugs as the UI grows.

3. **Replace the mega `TableData` interface with domain-specific types.** Split into `PatientRecord`, `AppointmentRow`, `InvoiceRow`, etc. with proper typing. Start with the most-used data shapes and migrate incrementally.

### P1 — High Impact, Moderate Urgency

4. **Migrate hardcoded colors in TSX to CSS custom properties.** The 394 inline hex values bypass the theme engine entirely — dark mode and theme switching can't reach them. Prioritize sidebar colors and medical status indicators.

5. **Standardize on one select component library.** Recommend Ant Design `<Select>` since the DataTable already depends on it. Deprecate `CommonSelect` (react-select wrapper) and migrate its ~12 usage sites.

6. **Create a reusable Modal component.** Wrap Bootstrap's modal markup in a React component with props for `isOpen`, `onClose`, `title`, `size`, and built-in focus trapping. This eliminates scattered `data-bs-toggle` patterns and improves accessibility.

7. **Add motion/transition tokens.** Define `--duration-fast: 150ms`, `--duration-normal: 250ms`, `--duration-slow: 400ms` and standard easing curves. Replace the inline `transition` styles.

### P2 — Foundational, Lower Urgency

8. **Audit and reduce inline styles.** Target the 515 `style={{}}` instances. Convert display toggles to CSS class toggling, move colors to tokens, extract repeated patterns into utility classes.

9. **Document the top 10 components.** Start with DataTable, PageHeader, Sidebar, Header, CommonSelect, ErrorBoundary, and the dynamic form pattern. Include props, variants, states, and usage examples.

10. **Reconcile the two medical status color systems.** The SCSS clinical tokens (`#DC2626`, `#16A34A`) and the TSX hardcoded values (`#F44336`, `#4CAF50`) represent the same semantic concepts with different values. Pick one set and use it everywhere.

---

*Generated from a full codebase audit of Symplify 1.7.4. Token counts are approximate based on pattern matching across all `.scss` and `.tsx` files.*
