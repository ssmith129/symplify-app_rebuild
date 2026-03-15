**SYMPLIFY HEALTHCARE PLATFORM**

**Design System Consistency Audit**

Version 1.7.4 • Comprehensive UI/UX Analysis

Prepared for: Symplify Engineering & Design Teams

Audit Date: March 14, 2026

Auditor: Senior UX/UI Design Audit

**CONFIDENTIAL**

Table of Contents

1\. Executive Summary

This audit provides a comprehensive analysis of design system consistency across the Symplify Healthcare Operations Platform (v1.7.4). The platform spans 200+ page components across 15 major module directories, built on React with TypeScript, and uses a dual UI framework approach combining Bootstrap 5 and Ant Design.

The audit identified 47 distinct inconsistency patterns across 7 major categories. These range from critical accessibility violations that impact clinical workflows to minor cosmetic variations. The findings are organized by severity to enable a prioritized remediation plan.

+-----------------+-----------------+-----------------+-----------------+
| **8**           | **14**          | **16**          | **9**           |
|                 |                 |                 |                 |
| Critical Issues | High Issues     | Medium Issues   | Low Issues      |
+-----------------+-----------------+-----------------+-----------------+

Key areas of concern include a fragmented color system with hardcoded values competing with CSS custom properties, inconsistent button sizing and spacing across modules, mixed icon library usage, and a dual-framework conflict between Bootstrap and Ant Design components that creates unpredictable visual behavior, particularly on clinical-facing pages.

2\. Color System Analysis

2.1 Defined Palette vs. Actual Usage

The \_variables.scss file defines a comprehensive token system with 90+ CSS custom properties. However, actual component usage frequently deviates from this system.

2.1.1 Hardcoded Color Values (Critical)

Multiple AI feature stylesheets bypass the design token system entirely, using hardcoded hex values that do not match any defined variable:

  ---------------------------- -------------------------------- -------------------------------- --------------
  **File / Component**         **Hardcoded Value**              **Expected Token**               **Severity**

  \_drug-interaction.scss      #0d6efd (primary-color)          var(\--primary) = #2E37A4        **CRITICAL**

  \_drug-interaction.scss      #28a745 (success green)          var(\--success) = #27AE60        **CRITICAL**

  \_drug-interaction.scss      #dc3545 (danger red)             var(\--danger) = #EF1E1E         **CRITICAL**

  \_drug-interaction.scss      #ffc107 (warning yellow)         var(\--warning) = #C9A227        **CRITICAL**

  \_voice-documentation.scss   #dc3545, #6f42c1                 var(\--danger), var(\--purple)   **HIGH**

  \_shift-handoff.scss         #0d6efd, #667eea, #764ba2        No token equivalent              **HIGH**

  \_ai-assistant.scss          #7B1FA2 (Material purple)        No token equivalent              **MEDIUM**

  EmailPriorityBadge.tsx       Inline: #DC2626, #F97316, etc.   var(\--clinical-\*) tokens       **HIGH**

  TriagePriorityBadge.tsx      Inline: #F44336, #FF9800, etc.   var(\--clinical-\*) tokens       **HIGH**
  ---------------------------- -------------------------------- -------------------------------- --------------

**Impact:** The drug-interaction and voice-documentation features use Bootstrap 5's default palette (#0d6efd, #28a745, #dc3545) which conflicts with Symplify's custom brand palette (#2E37A4, #27AE60, #EF1E1E). This creates a visible "two-system" appearance when users navigate between core platform pages and AI features. Dark mode is also broken in these components since they don't reference CSS custom properties.

2.1.2 Duplicate Semantic Color Systems

The platform defines two overlapping semantic color systems:

  ------------------------------------ ------------- --------------------- ------------- ------------
  **System**                           **Success**   **Danger/Critical**   **Warning**   **Info**

  Platform Tokens (\--success, etc.)   #27AE60       #EF1E1E               #C9A227       #2F80ED

  Clinical Tokens (\--clinical-\*)     #16A34A       #DC2626               #CA8A04       #2563EB

  Bootstrap Defaults (in AI SCSS)      #28a745       #dc3545               #ffc107       #0d6efd
  ------------------------------------ ------------- --------------------- ------------- ------------

**Recommendation:** Consolidate to a single semantic color system. The clinical tokens (\--clinical-\*) are the best candidate as they follow Tailwind CSS conventions and have proper light/dark mode variants. Map all Bootstrap defaults to these tokens. Remove hardcoded hex values from AI feature stylesheets.

3\. Typography Inconsistencies

3.1 Font Size Fragmentation

The codebase declares Inter as the base font (\$font-family-base: \'Inter\', sans-serif) at 0.875rem (14px). However, multiple competing font-size patterns exist:

  ------------------------------------ -------------------------- ------------------------------------------------------------------------------------ --------------
  **Pattern**                          **Location**               **Values Found**                                                                     **Severity**

  Utility classes in \_ai-pages.scss   Global scope, !important   fs-11 (11px), fs-12 (12px), fs-14 (14px), fs-15 (15px), fs-18 (18px), fs-22 (22px)   **HIGH**

  Button .btn base font-size           \_buttons.scss             0.75rem (12px) --- conflicts with Bootstrap default                                  **MEDIUM**

  Button .btn-sm dual declaration      \_buttons.scss             font-size: 0.75rem AND font-size: 13px (same rule block)                             **MEDIUM**

  .form-control desktop vs mobile      \_forms.scss               0.875rem desktop / 16px mobile (correct for iOS zoom)                                **LOW**

  .form-select font-size               \_forms.scss               14px (hardcoded, not using rem)                                                      **LOW**

  Card title vs header-title           \_card.scss                .card-title: 16px / .header-title: 1rem (same value, different units)                **LOW**

  AI component font sizes              AI SCSS files              10px--18px range with px units, not rem                                              **HIGH**
  ------------------------------------ -------------------------- ------------------------------------------------------------------------------------ --------------

3.2 Font Weight Inconsistencies

Variables define four weights (400, 500, 600, 700) but component usage mixes SCSS variable references with Bootstrap utility classes:

  -------------------------- ------------------------------ -------------------------------------- --------------
  **Component**              **SCSS/Variable Usage**        **Inline/Utility Usage**               **Severity**

  Page headers               \$font-weight-semibold (600)   fw-bold (700) in PageHeader.tsx        **MEDIUM**

  Doctor details back link   fw-semibold fs-14              ---                                    **LOW**

  Create patient back link   fw-bold                        Different weight than doctor details   **MEDIUM**

  Table headers              \$font-weight-semibold         Consistent (good)                      **LOW**

  Badges                     \$font-weight-bold (700)       Consistent (good)                      **LOW**
  -------------------------- ------------------------------ -------------------------------------- --------------

**Key finding:** The PageHeader component uses h4.fw-bold while individual pages use h6.fw-semibold and h6.fw-bold inconsistently for the same back-navigation pattern. The create-patient page and doctor-details page are directly comparable workflows yet use different heading weights and sizes.

4\. Button & Interactive Element Audit

4.1 Button Sizing Conflicts

Three competing button size definitions exist:

  ---------------------------- ----------------------------------- ----------------- ----------------- --------------- --------------
  **Source**                   **Base .btn**                       **.btn-sm**       **.btn-lg**       **.btn-icon**   **Severity**

  \_buttons.scss               6px 10px / 0.75rem                  6px 10px / 13px   8px 12px / 14px   32×32px         **HIGH**

  \_ai-pages.scss (override)   ---                                 ---               ---               30×30px         **HIGH**

  \_ai-pages.scss .btn-xs      3px 10px / 11px                     ---               ---               ---             **MEDIUM**

  Mobile (@media \<md)         6px 12px / 0.8125rem / min-h:32px   min-h: 32px       ---               min-h: 32px     **MEDIUM**
  ---------------------------- ----------------------------------- ----------------- ----------------- --------------- --------------

**Issue:** The \_ai-pages.scss file redefines .btn-icon with a 30×30px size, conflicting with the 32×32px definition in \_buttons.scss. Because \_ai-pages.scss loads after \_buttons.scss in the main.scss import order, the AI override wins globally, shrinking all icon buttons sitewide by 2px and falling below the WCAG minimum 32px touch target on desktop.

4.2 Touch Target Compliance

The mobile responsive rules enforce a 32px minimum touch target (WCAG 2.5.8 at Level AAA requires 44px). Analysis of touch targets:

  ---------------------------------------- ------------------------------- -------------------- ---------------------------- --------------
  **Element**                              **Desktop Size**                **Mobile Size**      **WCAG 2.5.5 (44px)**        **Severity**

  Table action items (.action-item \> a)   22×22px                         32×32px              Fails on all viewports       **CRITICAL**

  .btn-icon base                           32×32px (.btn) / 30×30px (AI)   32×32px              Fails AAA on all viewports   **HIGH**

  .btn-icon.btn-xs                         20×20px                         No mobile override   Fails on all viewports       **CRITICAL**

  .header-link                             32×32px                         No increase          Fails AAA on mobile          **HIGH**

  Form checkboxes (mobile)                 Default                         20×20px              Fails AAA                    **MEDIUM**
  ---------------------------------------- ------------------------------- -------------------- ---------------------------- --------------

**Clinical context:** Healthcare workers frequently use touch devices while wearing gloves, which significantly reduces touch precision. The 22px action items in data tables are a critical usability issue for bedside documentation workflows.

5\. Component Pattern Inconsistencies

5.1 Modal Border-Radius Conflict

The \_modal.scss file declares border-radius twice on .modal-content:

Line 1: **border-radius: 10px;** (hardcoded)

Line 2: **border-radius: \$border-radius;** (= 0.3rem ≈ 4.8px)

The second declaration wins, so modals render at \~5px radius while the intended design appears to be 10px. Mobile modals override to 12px. This creates three different modal corner treatments across viewports.

5.2 Card Component Inconsistencies

  ------------------------ ---------------------------------- ---------------------------------------------- --------------
  **Property**             **Value in \_card.scss**           **Value in AI Components**                     **Severity**

  border-radius            5px                                8px--16px (varies by AI component)             **HIGH**

  padding (.card-body)     20px desktop / 16px--12px mobile   1.5rem (24px) in drug-interaction              **MEDIUM**

  box-shadow               None (border only)                 0 2px 12px rgba(0,0,0,0.08) in shift-handoff   **MEDIUM**

  card-header background   transparent                        linear-gradient in shift-handoff-widget        **MEDIUM**
  ------------------------ ---------------------------------- ---------------------------------------------- --------------

5.3 Navigation & Back-Link Patterns

Two distinct back-navigation patterns exist across pages:

  --------------------------- ----------------------------------- ----------------- ------------ -----------------
  **Page**                    **Pattern Used**                    **Heading Tag**   **Weight**   **Severity**

  Doctor Details              h6.fw-semibold.fs-14 with icon      h6                600          **MEDIUM**

  Create Patient              h6.fw-bold with icon + "Patients"   h6                700          **MEDIUM**

  Dashboard (PageHeader)      h4.fw-bold with breadcrumb          h4                700          **LOW**

  Appointments (PageHeader)   h4.fw-bold with breadcrumb          h4                700          **LOW**
  --------------------------- ----------------------------------- ----------------- ------------ -----------------

**Recommendation:** Standardize all detail/create pages to use the PageHeader component with consistent back-navigation. This also benefits accessibility by providing a uniform landmark structure.

5.4 Badge & Status Indicator Fragmentation

Four different badge/status systems are in use simultaneously:

  --------------------------------------- -------------------------- --------------------------------------------------- --------------
  **System**                              **Used In**                **Color Pattern**                                   **Severity**

  Bootstrap badge-soft-\* utilities       Core platform pages        var(\--state-transparent) bg + var(\--state) text   **LOW**

  TriagePriorityBadge (inline styles)     Appointments, AI pages     Hardcoded Material colors (bg-danger, etc.)         **HIGH**

  EmailPriorityBadge (inline styles)      Email AI features          Tailwind palette (#DC2626, #22C55E)                 **HIGH**

  SeverityBadge (.severity-badge class)   Drug interaction checker   Bootstrap defaults (#d4edda, #28a745)               **HIGH**

  .cc-severity-badge (AI assistant)       Chat assistant cards       Yet another color set                               **MEDIUM**
  --------------------------------------- -------------------------- --------------------------------------------------- --------------

**Impact:** A clinician viewing a "Critical" alert will see different shades of red depending on whether they are viewing a triage badge, email priority, drug interaction severity, or clinical alert. This undermines the semantic consistency that healthcare UIs critically depend on for patient safety.

6\. Icon System Analysis

6.1 Multiple Icon Libraries

The platform loads 7 different icon font files:

  ---------------------- ----------------------------- ----------------------------------------- --------------
  **Library**            **Font Files**                **Primary Usage**                         **Severity**

  Tabler Icons (ti-\*)   Via CDN/import                Primary UI icons throughout platform      **LOW**

  Feather Icons          Feather.svg/ttf/woff          Older components, some navigation items   **MEDIUM**

  Font Awesome           fontawesome-webfont.\*        Sparse usage, legacy                      **MEDIUM**

  Material Icons         MaterialIcons-Regular.\*      Very sparse usage                         **MEDIUM**

  Iconsax                iconsax.\*                    Sparse usage in specific modules          **MEDIUM**

  Line Awesome           la-\*.woff2                   Minimal usage                             **MEDIUM**

  Bootstrap Icons        Via CSS (bootstrap-related)   Settings/theme UI                         **LOW**
  ---------------------- ----------------------------- ----------------------------------------- --------------

**Performance impact:** Loading 7 icon font families adds approximately 300--500KB of unnecessary font data. Tabler Icons is clearly the primary library (used in navigation, breadcrumbs, table sorting, and all AI components). The other 6 libraries should be audited for usage count and eliminated.

7\. Spacing & Layout Inconsistencies

7.1 Spacing Token Adoption

The \_variables.scss file defines a clean 4px-grid spacing system (\--space-1 through \--space-16), but actual component usage overwhelmingly ignores these tokens:

  -------------------------- ------------------------ ------------------------------------------ --------------
  **Component**              **Defined Spacing**      **Actual Usage**                           **Severity**

  Card body padding          \--spacing-card: 20px    Hardcoded 20px in \_card.scss              **MEDIUM**

  Card header padding        \--spacing-card-header   Hardcoded 0.9375rem 1.25rem                **MEDIUM**

  Modal header/footer        ---                      16px 20px (hardcoded)                      **LOW**

  Table cell padding         ---                      8px 16px (th) / 12px 16px (td) hardcoded   **LOW**

  AI assistant chat          ---                      10px---14px (px throughout)                **MEDIUM**

  Drug interaction checker   ---                      1.5rem / 1rem / 0.75rem (rem mix)          **MEDIUM**
  -------------------------- ------------------------ ------------------------------------------ --------------

**Key finding:** The spacing tokens exist but are essentially unused. The only consumer is the .form-wizard-header class. All other components use hardcoded pixel or rem values, defeating the purpose of having responsive spacing tokens that adjust across breakpoints.

7.2 Responsive Breakpoint Strategy Conflict

The \_mixins.scss file documents a conflict: the platform uses both mobile-first (respond-above) and desktop-first (respond-below) patterns. The mixin file's own comment says "for new components, prefer respond-above (mobile-first) pattern" but approximately 80% of existing styles use respond-below (desktop-first).

The AI feature stylesheets (shift-handoff, AI assistant) use raw \@media queries with hardcoded pixel breakpoints (480px, 768px, 1024px, 1440px) that don't align with the platform's defined breakpoint map (576px, 768px, 992px, 1200px, 1400px).

8\. Framework Conflict: Bootstrap 5 vs. Ant Design

The platform uses both Bootstrap 5 (via SCSS and utility classes) and Ant Design (imported as React components). This dual-framework approach creates several conflicts:

  --------------------- ---------------------------------------- ------------------------------------------- --------------
  **Conflict Area**     **Bootstrap Pattern**                    **Ant Design Pattern**                      **Severity**

  Form selects          .form-select with custom styling         \<Select\> from antd with its own styles    **HIGH**

  Date pickers          bootstrap-daterangepicker                \<DatePicker\> from antd                    **HIGH**

  Calendar              FullCalendar plugin                      \<Calendar\> from antd on dashboard         **MEDIUM**

  CSS variable naming   \--bs-\* (Bootstrap convention)          \--ant-\* (Ant convention)                  **MEDIUM**

  Modal styling         Bootstrap .modal with custom overrides   Ant Modal component (in some AI features)   **HIGH**

  Rating component      None (custom stars in AI)                \<Rate\> from antd (smart-scheduler)        **LOW**

  Spin/Loading          Custom CSS spinner in shift-handoff      \<Spin\> from antd in TriagePriorityBadge   **MEDIUM**
  --------------------- ---------------------------------------- ------------------------------------------- --------------

**Root cause:** The core platform was built as a Bootstrap 5 admin template (attributed to "Dreams Technologies" / ThemeForest in main.scss). The AI features and clinical enhancements were later added using Ant Design components, creating two visual systems. This is most apparent in the Appointments page where Bootstrap-styled form controls sit alongside the Ant Design DatePicker and Calendar.

9\. Dark Mode Support Gaps

The \_variables.scss defines comprehensive dark mode tokens under :root\[data-bs-theme=dark\]. However, multiple components will break in dark mode:

  ------------------------------- ------------------------------------------------------------------------------------------- --------------
  **Component**                   **Issue**                                                                                   **Severity**

  Drug interaction checker        Uses hardcoded #d4edda, #f8d7da, #fff3cd --- light-only colors                              **CRITICAL**

  Voice documentation             Uses hardcoded #dc3545 on white assumed backgrounds                                         **HIGH**

  Shift handoff summary           Uses \--card-bg, \--bg-light, \--text-primary fallbacks that don't map to Symplify tokens   **HIGH**

  AI assistant chat               Uses var(\--bs-body-bg) and var(\--bs-body-color) --- Bootstrap vars, not Symplify vars     **MEDIUM**

  Interaction alert backgrounds   #d4edda, #fff3cd, #f8d7da will appear as bright patches in dark mode                        **CRITICAL**

  Email priority badge            Inline styles with hardcoded bgColor values                                                 **HIGH**

  Clinical alert widget           background-color: #fff hardcoded on .alert-item                                             **HIGH**
  ------------------------------- ------------------------------------------------------------------------------------------- --------------

10\. Issue Severity Distribution

  ------------------------- -------------- ---------- ------------ --------- -----------------
  **Category**              **Critical**   **High**   **Medium**   **Low**   **Total**

  Color System              4              4          1            0         9

  Typography                0              2          3            3         8

  Buttons & Touch Targets   2              2          2            0         6

  Component Patterns        0              3          4            2         9

  Icon System               0              0          5            2         7

  Spacing & Layout          0              0          4            2         6

  Dark Mode                 2              3          1            0         6

  **TOTAL**                 **8**          **14**     **16**       **9**     **47**
  ------------------------- -------------- ---------- ------------ --------- -----------------

11\. Design System Recommendations

11.1 Unified Color Palette

Consolidate all three color systems (platform tokens, clinical tokens, Bootstrap defaults) into a single hierarchy:

  ---------------- ---------------------------------------- ------------------------------------------ ----------------------------
  **Token Tier**   **Purpose**                              **Naming Convention**                      **Example**

  Primitive        Raw color values (never used directly)   \--color-blue-600                          #2E37A4

  Semantic         Meaning-based tokens                     \--color-primary, \--color-danger          Maps to primitives

  Clinical         Healthcare-specific semantics            \--clinical-critical, \--clinical-stable   Extends semantic tier

  Component        Scoped to specific UI patterns           \--btn-primary-bg, \--alert-success-bg     References semantic tokens
  ---------------- ---------------------------------------- ------------------------------------------ ----------------------------

11.2 Typography Scale

Replace all ad-hoc font sizes with a rational scale anchored to the 14px base:

  --------------- ------------------ --------------------------------- ----------------
  **Token**       **Size**           **Use Case**                      **Weight**

  \--text-xs      0.6875rem (11px)   Timestamps, badges, fine print    500--600

  \--text-sm      0.75rem (12px)     Table headers, secondary labels   500--600

  \--text-base    0.875rem (14px)    Body text, form inputs, buttons   400--500

  \--text-md      1rem (16px)        Card titles, emphasized text      600

  \--text-lg      1.125rem (18px)    Section headers                   600--700

  \--text-xl      1.25rem (20px)     Page titles                       700

  \--text-2xl     1.5rem (24px)      Dashboard stat values             700--800
  --------------- ------------------ --------------------------------- ----------------

11.3 Component Standardization

Define a single source of truth for each reusable pattern:

  --------------------------- ------------------------------------------------------------ ------------------- ---------------
  **Component**               **Proposed Standard**                                        **border-radius**   **Priority**

  Buttons (all sizes)         Align to 8px/12px/16px pad, min 32px desktop / 44px mobile   6px                 P0 (Sprint 1)

  Cards                       20px padding, 8px radius, var(\--border-color) border        8px                 P0 (Sprint 1)

  Modals                      Fix dual border-radius, 16px header/footer, 20px body        12px                P1 (Sprint 2)

  Badge / Status indicators   Single ClinicalBadge component using clinical tokens         4px / pill          P0 (Sprint 1)

  Form inputs                 All use rem units, min-height 44px on mobile                 6px                 P1 (Sprint 2)

  Table action items          Minimum 32px desktop, 44px mobile                            6px                 P0 (Sprint 1)
  --------------------------- ------------------------------------------------------------ ------------------- ---------------

11.4 Implementation Roadmap

  ------------------------------- --------------- --------------------------------------------------------------------------- ----------------------------
  **Phase**                       **Sprint(s)**   **Focus**                                                                   **Impact**

  Phase 0: Critical Safety        Sprint 1        Fix touch targets below 32px, unify clinical severity colors                8 Critical + 4 High issues

  Phase 1: Token Migration        Sprint 2--3     Replace all hardcoded colors in AI SCSS with design tokens, fix dark mode   10 High + 6 Medium issues

  Phase 2: Component Library      Sprint 4--5     Create shared ClinicalBadge, StandardButton, FormInput components           12 Medium + 4 Low issues

  Phase 3: Icon Consolidation     Sprint 6        Audit & remove unused icon fonts, standardize on Tabler                     5 Medium + 2 Low

  Phase 4: Framework Resolution   Sprint 7--8     Migrate Ant Design components to Symplify-styled wrappers or replace        Long-term architecture
  ------------------------------- --------------- --------------------------------------------------------------------------- ----------------------------

11.5 Governance Recommendations

1.  **Lint rules:** Add Stylelint rules to flag hardcoded color hex values and px font sizes in SCSS files.

2.  **Component library:** Establish a Storybook instance documenting every approved component variant with its props and visual states.

3.  **PR review checklist:** Require design token usage verification in code review for any UI-touching changes.

4.  **Accessibility CI:** Integrate axe-core or Lighthouse accessibility audits into the CI pipeline to catch touch-target violations automatically.

5.  **Dark mode testing:** Add dark mode screenshots to visual regression tests, especially for all AI feature components.

*End of Audit Report*

Symplify Design System Audit • v1.7.4 • March 2026
