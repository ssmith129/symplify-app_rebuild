# Design System Audit: Buttons & Form Inputs

**Date:** March 29, 2026
**Scope:** `_buttons.scss`, `_forms.scss`, `_variables.scss`, and TSX component usage across the Symplify codebase
**Components reviewed:** 2 (Buttons, Form Inputs) | **Issues found:** 12 | **Score: 52/100**

---

## 1. Naming Consistency

| Issue | Where | Recommendation |
|-------|-------|----------------|
| **`btn-liner-gradient`** — typo in class name ("liner" instead of "linear") | `_buttons.scss:296` | Rename to `btn-linear-gradient` and update all references |
| **`btn-white` vs `btn-outline-white`** — two separate implementations with different behavior, both defined outside the `@each` loop | `_buttons.scss:114, 247` | Consolidate into the `$theme-colors` map or document as intentional exceptions |
| **`btn-xs`** size only exists for `.btn-icon`, not for `.btn` | `_buttons.scss:31` | Either add `btn-xs` as a general size variant or remove the inconsistency |
| **Manual checkbox/radio color classes** duplicated after an `@each` loop that should handle them | `_forms.scss:106–116` (loop) vs `_forms.scss:746–808` (manual) | The manual block re-declares what the `@each` loop at line 106 already generates — remove the duplicate block |

---

## 2. Token Coverage

| Category | Tokens Defined | Hardcoded Values Found | Severity |
|----------|---------------|----------------------|----------|
| **Colors** | 13 in `$theme-colors`, full CSS custom property set | 4 hardcoded hex values in `_buttons.scss` (`#0B0D0E` × 2, `#2E37A4`, `#0E9384` in gradient) | Medium |
| **Spacing** | `--space-1` through `--space-16` (4px grid) | Button padding uses raw `6px 10px`, `8px 12px`, `6px 12px` — none reference spacing tokens | **High** |
| **Typography** | `--text-xs` through `--text-2xl` | Buttons use raw `0.75rem`, `14px`, `12px` — only mobile override uses `var(--text-sm)` | **High** |
| **Border Radius** | `$border-radius: .3rem`, `--radius-card: 8px` | Buttons hardcode `border-radius: 5px`; forms also hardcode `5px` throughout | **High** |
| **Shadows** | `--shadow-subtle`, `--shadow-medium`, `--shadow-elevated` | Buttons set `box-shadow: none` — fine, but form dropdowns use `$box-shadow` inconsistently | Low |

### Details on Hardcoded Values

**In `_buttons.scss`:**
- Line 107–108: `background-color: #0B0D0E` — should use `var(--dark)` or `$dark`
- Lines 297, 304: Gradient uses literal `#2E37A4` and `#0E9384` — should reference `var(--primary)` and `var(--teal)`
- Lines 13–14: `font-size: 0.75rem; padding: 6px 10px` — should use `var(--text-sm)` and spacing tokens

**In `_forms.scss`:**
- 15 instances of hardcoded `font-size` values (e.g., `16px`, `14px`, `13px`, `12px`, `0.875rem`, `20px`)
- `border-radius: 5px` hardcoded in at least 6 places (`.form-control`, `.choices__inner`, `.choices__list--dropdown`, `.select2-*`)
- Form padding uses raw pixel values (`0.5rem 0.75rem`, `5px 12px`, `8px 12px`) instead of spacing tokens

---

## 3. Component Completeness

### Buttons

| Aspect | Status | Notes |
|--------|--------|-------|
| **Variants** | ✅ Solid, Outline, Soft, White, Gradient, Animation | 6 variant families — good coverage |
| **Sizes** | ⚠️ Partial | `btn-sm`, `btn-lg` defined; `btn-xs` only for icon buttons; no explicit default size token |
| **States** | ⚠️ Partial | Default, hover, active, disabled covered. **No loading state** defined (no spinner/skeleton). No `aria-busy` pattern. |
| **Focus** | ✅ Good | `focus-visible` with `2px solid var(--primary)` and `outline-offset: 2px` |
| **Disabled** | ✅ Good | `opacity: 0.5; cursor: not-allowed; pointer-events: none` |
| **Accessibility** | ⚠️ Partial | Focus ring present. Mobile touch targets enforced (`--touch-target-desktop: 32px`). But `btn-sm` on mobile still uses `--touch-target-desktop` instead of `--touch-target-mobile` — may violate WCAG 2.5.8 (Target Size) |
| **Dark Mode** | ✅ | Inherits from CSS custom properties; dark mode tokens swap automatically |
| **RTL** | ❌ Missing | No RTL-specific button styles (though forms have some RTL handling) |
| **Documentation** | ❌ None | No component docs, usage guidelines, or prop table |

**Score: 6/10**

### Form Inputs

| Aspect | Status | Notes |
|--------|--------|-------|
| **Variants** | ⚠️ Mixed | Bootstrap `.form-control`, `.form-select`, plus 3 third-party select libraries (Choices.js, Select2, Ant Design Input) — **3 competing select implementations** |
| **Sizes** | ✅ | `form-control-sm`, `form-control-lg`, default |
| **States** | ⚠️ Partial | Default, focus, disabled covered. `is-valid`/`is-invalid` handled. **No explicit error message styling** component. No loading/skeleton state. |
| **Focus** | ✅ Good | `focus-visible` with `outline: 2px solid var(--primary)` |
| **Disabled** | ✅ | `background-color: $light; opacity: 1` |
| **Placeholder** | ✅ | Consistent `color: $gray-400` across `.form-control`, `.choices__input`, `.choices__placeholder` |
| **Accessibility** | ⚠️ | Mobile zoom prevention via `font-size: 16px` — good. Touch targets enlarged on mobile (48px). But `.card-radio .form-check-input` is `display: none` with no visible focus indicator on the label. |
| **Dark Mode** | ✅ | Token-based, auto-swaps |
| **RTL** | ⚠️ Partial | Some RTL rules for Choices.js and Select2, but incomplete |
| **Documentation** | ❌ None | No component docs |

**Score: 5/10**

---

## 4. Consistency Issues Across Components

### Mixed Unit Systems
The codebase uses **four different approaches** for the same values:

| Unit Style | Example | Where |
|------------|---------|-------|
| `px` | `padding: 6px 10px` | Buttons, forms |
| `rem` | `font-size: 0.75rem` | Buttons default |
| `var()` tokens | `font-size: var(--text-sm)` | Mobile overrides only |
| `calc()` | `height: calc(0.6rem + 1.5em + 2px)` | Icon button sizes |

**Recommendation:** Standardize on CSS custom property tokens (`var(--text-sm)`, `var(--space-2)`) for all values. Reserve `calc()` only for truly computed dimensions.

### Three Competing Select Components
The codebase styles **three different select implementations**, each with its own styling rules:

1. **Native `<select>` / `.form-select`** — Bootstrap standard (lines 71–78)
2. **Choices.js** — `.choices__inner`, `.choices__list` (lines 252–516)
3. **Select2** — `.select2-container`, `.select2-selection` (lines 519–691)

Plus **Ant Design `<Input>`** is imported in 5 files for specific cases (OTP, TextArea, DatePicker).

This creates a maintenance burden and visual inconsistency. Each has slightly different padding, font sizes, and border-radius values.

### `border-radius: 5px` Everywhere
Both buttons and forms hardcode `5px` for border-radius. The `$border-radius` SCSS variable is set to `.3rem` (≈4.8px), and `--radius-card` is `8px`. None of these are used consistently:

| Component | Actual Radius | Should Use |
|-----------|--------------|------------|
| `.btn` | `5px` | `$border-radius` or a new `--radius-input` token |
| `.form-control` | `5px` | `$border-radius` or `--radius-input` |
| `.choices__inner` | `5px !important` | Same token |
| `.select2-selection` | `5px` | Same token |

---

## 5. Priority Actions

### P0 — High Impact, Low Effort

1. **Create `--radius-input` and `--radius-btn` tokens** — Replace all hardcoded `5px` border-radius values with a single token. This alone fixes ~12 hardcoded values across both files.

2. **Map button padding/font-size to spacing & typography tokens** — The spacing system (`--space-1` through `--space-16`) and typography scale (`--text-xs` through `--text-2xl`) already exist but aren't used in buttons or forms. Wire them up:
   - `.btn` default: `padding: var(--space-2) var(--space-3); font-size: var(--text-sm);`
   - `.btn-sm`: `padding: var(--space-2) var(--space-3); font-size: var(--text-sm);` (note: currently identical to default — likely a bug)
   - `.btn-lg`: `padding: var(--space-2) var(--space-3); font-size: var(--text-base);`

3. **Fix `btn-liner-gradient` typo** — Rename to `btn-linear-gradient`, search-and-replace across TSX files.

### P1 — High Impact, Medium Effort

4. **Consolidate select component styling** — Pick one primary select library (recommend Choices.js or migrate fully to Ant Design `Select`) and deprecate the others. Currently maintaining 3 sets of select styles is unsustainable.

5. **Add a button loading state** — Define a `.btn-loading` class with a spinner pattern, `aria-busy="true"`, and disabled interaction. This is essential for a healthcare app where users submit forms and need clear feedback.

6. **Remove duplicate checkbox/radio color block** (lines 746–808 in `_forms.scss`) — The `@each` loop at line 106 already generates these classes. The manual block is dead weight and a drift risk.

### P2 — Medium Impact

7. **Fix `.btn-sm` being identical to `.btn` default** — Both use `font-size: 0.75rem; padding: 6px 10px`. The small variant should be visibly smaller.

8. **Add `.btn-xs` as a general size** — Currently only available for `.btn-icon`. Either formalize it for all buttons or remove it.

9. **Fix mobile touch target for `.btn-sm`** — Currently uses `--touch-target-desktop` (32px) instead of `--touch-target-mobile` (44px). On mobile, small buttons should still meet the 44px minimum.

10. **Add RTL button styles** — Forms have partial RTL support, but buttons have none. Given i18n supports 25 languages (some RTL), this is a gap.

### P3 — Documentation

11. **Document button and form input components** — Create usage guidelines covering variants, when to use each, and accessibility requirements.

12. **Create a visual component inventory page** — The `ui-modules` section has button/form demo pages (`uiButtons.tsx`, `formBasicInputs.tsx`) but these aren't linked to any design system documentation.

---

## Summary

The Symplify design system has a solid token foundation (colors, spacing scale, typography scale, shadows, clinical tokens) that is **underutilized** by its two most common components. Buttons and form inputs were likely built early and haven't been updated to consume the newer token system. The biggest wins come from wiring existing tokens into these components (P0 items) — this requires zero new infrastructure and immediately improves consistency across the ~250+ files that use buttons and the ~169 files that use form controls.
