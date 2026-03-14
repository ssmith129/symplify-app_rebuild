# Symplify Case Study — Builder.io Implementation Guide

**Version:** 1.0  
**Date:** March 12, 2026  
**Scope:** smithdesign.live/case-studies/symplify-hospital-management-system  
**Target:** Builder.io Visual Editor + Custom Code Fields  

---

## Assumptions

The following assumptions are based on direct code review of the live TSX source files, the Symplify-1.7.4 platform design system (`_variables.scss`), and the completed audit report. Where current Builder.io state could not be verified against the visual editor, assumptions are flagged explicitly.

- [ ] **A-1:** The case study page is built as a React/TypeScript SPA with components in `/client/components/symplify/`. Builder.io is used for media asset hosting (cdn.builder.io) and potentially as a visual CMS layer. Instructions assume Builder.io blocks can target or wrap these React components.
- [ ] **A-2:** The `sym-*` Tailwind token system (defined in `tailwind.config.ts`) is the authoritative design system for this case study. Builder.io custom CSS fields should reference these tokens or their resolved hex values.
- [ ] **A-3:** The current case study contains 24+ images and 3 autoplay videos, all hosted on cdn.builder.io. New assets will be uploaded to the same CDN bucket.
- [ ] **A-4:** The `SymTLDR` component exists in `shared.tsx` but is currently **unused** in any section component. All TL;DR implementation requires adding import + JSX.
- [ ] **A-5:** The case study uses `loading="lazy"` on all images including the hero — this is a known performance issue.
- [ ] **A-6:** The Product Showcase section relies exclusively on autoplay videos with no static annotated screenshots.
- [ ] **A-7:** The section navigation contains 10 flat items with no visual grouping.

---

## Table of Contents

1. [Phase 1: Global Styles & Typography](#phase-1-global-styles--typography)
2. [Phase 2: Layout & Spacing Normalization](#phase-2-layout--spacing-normalization)
3. [Phase 3: Section-by-Section Content Edits](#phase-3-section-by-section-content-edits)
4. [Phase 4: Image & Media Optimization](#phase-4-image--media-optimization)
5. [Phase 5: Component-Level Polish](#phase-5-component-level-polish)
6. [Phase 6: Navigation & Reading Flow](#phase-6-navigation--reading-flow)
7. [Phase 7: Accessibility Hardening](#phase-7-accessibility-hardening)
8. [Phase 8: Performance Optimization](#phase-8-performance-optimization)
9. [QA Checklist](#qa-checklist)
10. [Design Token Reference Tables](#design-token-reference-tables)

---

## Phase 1: Global Styles & Typography

### 1.1 Typography Scale

All text in the case study uses Inter (Google Fonts) as the primary typeface and JetBrains Mono for technical/data values. The following scale must be enforced globally.

| Role | Element | Size | Weight | Line-Height | Letter-Spacing | Color |
|------|---------|------|--------|-------------|----------------|-------|
| Hero H1 | `<h1>` | 3.25rem (52px) desktop / 1.875rem (30px) mobile | 600 (semibold) | 1.15 (65px desktop) | -0.03em | `#0F172A` |
| Section H2 | `<h2>` | 1.875rem (30px) desktop / 1.5rem (24px) mobile | 600 | 1.3 | -0.02em | `#0F172A` |
| Sub-heading H3 | `<h3>` | 1.125rem (18px) | 600 | 1.4 | normal | `#0F172A` |
| Body | `<p>` | 0.9375rem (15px) | 400 | 1.6 (24px) | normal | `#334155` |
| Label (uppercase) | `<span>` | 0.75rem (12px) | 600 | 1.5 | 0.1em | varies per section |
| Caption/Figcaption | `<figcaption>` | 0.75rem (12px) | 400 | 1.5 | normal | `#64748B` |
| Data/Metric | metric values | 1.5–1.875rem (24–30px) | 700 | 1.2 | normal | per-metric color |
| Code/Mono | code blocks | 0.6875rem (11px) | 500 | 1.5 | normal | `#0F172A` |

**Builder.io Actions:**

- [ ] **1.1.1** Open the page in Builder.io visual editor. Select the top-level page block. In the **Style** tab, set `font-family: 'Inter', -apple-system, Roboto, Helvetica, sans-serif` as the base.
- [ ] **1.1.2** For each heading block (`<h1>`, `<h2>`, `<h3>`), verify sizes match the scale above at each breakpoint. In Builder.io, click the heading block → **Style** tab → **Typography** section. Set font-size, font-weight, line-height, and letter-spacing per the table.
- [ ] **1.1.3** For body text blocks, verify `font-size: 15px`, `line-height: 1.6`, `color: #334155`. Check this in every section's paragraph blocks.
- [ ] **1.1.4** For uppercase label spans (section category labels like "The Problem", "Discovery", etc.), verify `font-size: 12px`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.1em`.

### 1.2 Font Loading

- [ ] **1.2.1** In Builder.io **Page Settings** → **Custom Code** → `<head>`, ensure these Google Fonts links are present:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```
- [ ] **1.2.2** Verify `font-display: swap` is active (this is the default in the Google Fonts URL above via `&display=swap`).

### 1.3 Color System

The case study uses a dedicated `sym-*` token namespace. All colors must resolve to these hex values.

| Token | Hex | Usage | WCAG AA on White |
|-------|-----|-------|-----------------|
| `sym-heading` | `#0F172A` | All headings, strong text | 16.75:1 ✅ |
| `sym-body` | `#334155` | Body paragraphs | 9.68:1 ✅ |
| `sym-muted` | `#64748B` | Captions, secondary text | 4.91:1 ✅ |
| `sym-label` | `#6B7280` | Uppercase labels | 4.64:1 ✅ |
| `sym-blue` | `#3B82F6` | Discovery sections, CTAs, links | 3.44:1 ⚠️ (use on bg-blue only) |
| `sym-green` | `#10B981` | Product sections, success | 3.25:1 ⚠️ (use on bg-green only) |
| `sym-purple` | `#8B5CF6` | Evolution sections | 3.81:1 ⚠️ |
| `sym-amber` | `#F59E0B` | Warning states | 2.15:1 ❌ (text only on amber bg) |
| `sym-red` | `#EF4444` | Problem sections, errors | 3.67:1 ⚠️ |
| `sym-card` | `#FFFFFF` | Card backgrounds | — |
| `sym-card-border` | `#E2E8F0` | Card/divider borders | — |
| `sym-divider` | `#F1F5F9` | Section dividers | — |
| `sym-bg-primary` | `#F8FAFC` | Light section backgrounds | — |

**Builder.io Actions:**

- [ ] **1.3.1** In Builder.io **Page Settings** → **Custom Code** → `<head>`, add a `<style>` block with CSS custom properties for the sym-* tokens (if not already inherited from Tailwind):
```css
<style>
:root {
  --sym-heading: #0F172A;
  --sym-body: #334155;
  --sym-muted: #64748B;
  --sym-label: #6B7280;
  --sym-blue: #3B82F6;
  --sym-green: #10B981;
  --sym-purple: #8B5CF6;
  --sym-amber: #F59E0B;
  --sym-red: #EF4444;
  --sym-card: #FFFFFF;
  --sym-card-border: #E2E8F0;
  --sym-divider: #F1F5F9;
  --sym-bg-primary: #F8FAFC;
  --sym-bg-blue: #EFF6FF;
  --sym-bg-green: #F0FDF4;
  --sym-bg-amber: #FFFBEB;
  --sym-bg-purple: #F5F3FF;
  --sym-bg-red: #FEF2F2;
}
</style>
```
- [ ] **1.3.2** Audit every text element for contrast compliance. Any `sym-blue`, `sym-green`, or `sym-purple` text on white must be at least 18px bold or 24px regular to meet WCAG AA for large text. If used as small body text on white, switch to the heading color (`#0F172A`) or darken the accent (e.g., `#2563EB` for blue, `#059669` for green).

> **⚠️ CRITICAL NOTE:** The accent colors `sym-blue` (#3B82F6), `sym-green` (#10B981), and `sym-purple` (#8B5CF6) do NOT meet WCAG 2.1 AA contrast ratio (4.5:1) for normal-sized text on white backgrounds. They are safe for: large text (18px+ bold or 24px+ regular), decorative elements, or text on their respective tinted backgrounds (bg-blue, bg-green, bg-purple). Do NOT use them for body-sized text on white.

---

## Phase 2: Layout & Spacing Normalization

### 2.1 Content Width

- [ ] **2.1.1** All section content is constrained to `max-width: 1200px` with horizontal padding. In Builder.io, select each top-level section block and verify in **Style** → **Size**: `max-width: 1200px`, `margin: 0 auto`.
- [ ] **2.1.2** Horizontal padding per breakpoint:
  - Desktop (1024px+): `padding-left: 48px; padding-right: 48px`
  - Tablet (768px): `padding-left: 32px; padding-right: 32px`
  - Mobile (< 480px): `padding-left: 16px; padding-right: 16px`
- [ ] **2.1.3** Body text paragraphs should have `max-width: 720px` for optimal reading line length (65–75 characters). Select each `<p>` block in body sections → **Style** → `max-width: 720px`.

### 2.2 Section Vertical Spacing

All major sections use 64px vertical padding (py-16 in Tailwind's default scale). One exception needs correction.

- [ ] **2.2.1** **ConstraintsBar** currently uses `py-12` (48px). Change to `py-16` (64px) for consistency. In Builder.io, select the Constraints section block → **Style** → **Spacing** → set top and bottom padding to `64px`.
- [ ] **2.2.2** Verify all other sections maintain `64px` top and bottom padding:
  - ProjectOverview: 64px ✅
  - ProblemSection: 64px ✅  
  - ResearchSection: 64px ✅
  - ImpactMetrics: 64px ✅
  - DesignEvolution: 64px ✅
  - DesignDecisions: 64px ✅
  - ProductShowcase: 64px ✅
  - SystemOverview: 64px ✅
  - ReflectionsSection (both sub-sections): 64px ✅

### 2.3 Card & Grid Gaps

- [ ] **2.3.1** All card grids use `gap: 16px` (4-column grids) or `gap: 20px` (2-3 column grids). Verify consistency in Builder.io by selecting each grid/flex container → **Style** → **Layout** → gap value.
- [ ] **2.3.2** Responsive grid columns:
  - **4-column grids** (methods strip, constraints, next steps, platforms): `4 cols` at lg, `2 cols` at sm, `1 col` below sm
  - **3-column grids** (quotes, research photos): `3 cols` at md, `1 col` below md
  - **2-column grids** (objectives, decisions, wins/misses): `2 cols` at sm, `1 col` below sm

### 2.4 Section Dividers

- [ ] **2.4.1** Section dividers use `<hr>` with `border-color: #F1F5F9` (sym-divider). Verify in Builder.io that each divider block between sections has `border-top: 1px solid #F1F5F9` and `max-width: 1200px; margin: 0 auto; padding: 0 48px`.

---

## Phase 3: Section-by-Section Content Edits

This is the largest phase. Each sub-section below corresponds to a case study section in top-to-bottom page order.

### 3.1 Hero Section (HeroSection.tsx)

#### 3.1.1 Hero Image Loading

- [ ] **3.1.1a** Select the hero image block (the large platform screenshot below the hero text). In Builder.io, click the image → **Settings** panel → change `loading` attribute from `lazy` to `eager`.
- [ ] **3.1.1b** Additionally, add a preload hint in **Page Settings** → **Custom Code** → `<head>`:
```html
<link rel="preload" as="image" href="https://cdn.builder.io/api/v1/image/assets%2Fba69a23156414a589de97341511272c9%2Fa365aabaf0c94e5ea46663d1d7bd4cb3">
```

#### 3.1.2 Hero Copy — No Changes Required

The hero headline ("Turning Hospital Chaos into Clinical Clarity"), subhead, meta badges, and role description are well-crafted. No content edits needed.

> **ℹ️ NOTE:** The hero is performing well. Do not modify the headline, reading time estimate, or meta badges.

### 3.2 Project Overview (ProjectOverview.tsx)

#### 3.2.1 Add TL;DR Summary

- [ ] **3.2.1a** In Builder.io, navigate to the Project Overview section. Click **+ Add Block** immediately after the section heading (after the "Project Overview" h2 and before the ProjectTimeline component).
- [ ] **3.2.1b** Insert a **Custom Code** block (or a styled Box block) with the following structure:

**Content:**
> **TL;DR:** 0-to-1 AI hospital platform across 3 facilities, 65 staff. 8-month timeline from discovery to pilot analysis. 4 success criteria defined upfront: reduce cognitive overhead, improve compliance visibility, unify workflows, and prove pilot viability.

**Styling (apply in Style tab):**
```css
background: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05));
border-radius: 12px;
padding: 16px;
border-left: 4px solid #3B82F6;
margin-bottom: 32px;
```

**Inner structure:**
- Zap icon (or ⚡ emoji): 24x24px, background `rgba(59, 130, 246, 0.1)`, border-radius `8px`
- Label: "TL;DR" — `font-size: 12px; font-weight: 600; color: #3B82F6; text-transform: uppercase; letter-spacing: 0.05em`
- Body text: `font-size: 14px; font-weight: 500; color: #0F172A; line-height: 1.5`

### 3.3 Problem Section (ProblemSection.tsx)

#### 3.3.1 Add TL;DR Summary

- [ ] **3.3.1a** Insert TL;DR block after the Problem section heading, using identical styling as 3.2.1b.

**Content:**
> **TL;DR:** Staff operated across EHR, Excel, and email with no shared prioritization. 18% of urgent handoffs were missed at shift change, 60% of staff time was lost to context-switching, and SLA breach risk sat at 14.2%.

#### 3.3.2 Add Cost-of-Problem Estimate

- [ ] **3.3.2a** After the stats strip (the red stat cards showing 18%, 14.2%, 60%), add a new block.
- [ ] **3.3.2b** Insert a **Box** block with these styles:
```css
margin-top: 32px;
background-color: #FFFBEB;
border: 1px solid #FDE68A;
border-radius: 12px;
padding: 20px;
```
- [ ] **3.3.2c** Add content inside:
  - **Heading:** "Estimated Cost of the Problem" — `font-size: 14px; font-weight: 600; color: #92400E; margin-bottom: 4px`
  - **Body:** "At 60% context-switching overhead across 65 clinical staff averaging $41/hr, fragmented workflows cost an estimated $830K+ annually in lost productivity — before accounting for missed handoffs, SLA penalties, and patient impact." — `font-size: 12px; color: #78350F; line-height: 1.5`

### 3.4 Constraints Bar (ConstraintsBar.tsx)

#### 3.4.1 Spacing Fix

- [ ] **3.4.1a** Select the Constraints section block → **Style** → **Spacing** → change top padding from `48px` to `64px` and bottom padding from `48px` to `64px`.

### 3.5 Research Section (ResearchSection.tsx)

#### 3.5.1 Add TL;DR Summary

- [ ] **3.5.1a** Insert TL;DR block after the Research section heading.

**Content:**
> **TL;DR:** 18 staff shadowed, 3,000+ tasks logged, 14 interviews conducted, 1,200 messages analyzed. Three key insights: staff wanted augmentation not automation, "urgent" had no shared definition, and compliance failures were a visibility problem not a behavior problem.

#### 3.5.2 Research Photo Alt Text Audit

- [ ] **3.5.2a** Verify each of the 3 research photos has descriptive alt text. Select each image block → **Settings** → **Alt text**. Current alt texts are comprehensive — no changes needed unless images are replaced.

### 3.6 Impact Metrics (ImpactMetrics.tsx)

#### 3.6.1 Add TL;DR Summary

- [ ] **3.6.1a** Insert TL;DR block after the Impact section heading, before the metric cards.

**Content:**
> **TL;DR:** 6-week pilot across 3 facilities: 40% faster triage, 89% accuracy (up from 60%), 35% admin overhead reduction, and estimated $78K+ annual value. All metrics system-logged against 4-week baselines. Pilot ran during non-flu months — promising, not proven at scale.

### 3.7 Design Evolution (DesignEvolution.tsx)

#### 3.7.1 Add TL;DR Summary

- [ ] **3.7.1a** Insert TL;DR block after the Design Evolution section heading.

**Content:**
> **TL;DR:** 67% of clinicians rejected auto-assigned routing. This pivotal failure drove the shift to suggestion-based design: AI recommends, humans decide. The HIPAA audit requirement unexpectedly improved UX through hover-to-reveal reasoning.

### 3.8 Design Decisions (DesignDecisions.tsx)

#### 3.8.1 Add TL;DR Summary

- [ ] **3.8.1a** Insert TL;DR block after the Design Decisions section heading.

**Content:**
> **TL;DR:** Four core decisions shaped the product: 3-tier confidence badges over percentages (89% acceptance), auditable AI reasoning with 1-click override, suggestion-based scheduling that prevented conflicts, and risk-tiered alerts that cut daily interruptions from 47 to 12.

### 3.9 Product Showcase (ProductShowcase.tsx)

#### 3.9.1 Add TL;DR Summary

- [ ] **3.9.1a** Insert TL;DR block after the Product Showcase section heading.

**Content:**
> **TL;DR:** Three role-specific views (Doctor, Nurse, Admin) share a single data layer. Each view is optimized for its workflow: AI-augmented triage for doctors, structured shift handoffs for nurses, and real-time compliance tracking for admins.

#### 3.9.2 Add Annotated Static Screenshots (HIGH PRIORITY)

This is the single highest-impact visual change. Each of the 3 product showcase cards currently shows only an autoplay video. Hiring managers cannot scan video in 90 seconds — they need static annotated screenshots.

- [ ] **3.9.2a** For each ShowcaseCard (Doctor Dashboard, Nurse Shift Handoff, Admin Compliance), add a **ZoomableImage block** ABOVE the existing AutoplayVideo block.
- [ ] **3.9.2b** For each image block, in Builder.io:
  1. Click **+ Add Block** inside the showcase card, positioned before the video
  2. Select **Image** block type
  3. Upload the annotated screenshot (see Section 4 for asset creation instructions)
  4. Set aspect ratio to 16:9
  5. Add descriptive alt text (see below)
  6. Enable zoom-on-click interaction (wrap in a button block with lightbox behavior, or use the ZoomableImage component if available as a registered Builder.io component)

**Alt text for each annotated screenshot:**

- **Doctor Dashboard:** "Annotated Symplify doctor dashboard showing: (1) AI Triage Queue with messages pre-sorted by clinical risk, (2) SLA Countdown Timers surfaced in context, (3) Patient Context Panel with 1-click access, (4) Quick Actions for Accept/Override/Escalate with keyboard shortcuts"
- **Nurse Handoff:** "Annotated Symplify nurse shift handoff view showing: (1) Handoff Status Board with visual state tracking, (2) Unresolved Flags for items needing immediate attention, (3) Structured Handoff Notes replacing phone-call handoffs, (4) Alert Tier Summary for critical vs. informational at a glance"
- **Admin Compliance:** "Annotated Symplify admin compliance dashboard showing: (1) SLA Compliance Tracker with real-time rates by facility, (2) Auto-Generated Reports replacing manual Excel workflow, (3) AI-assisted Demand Forecasting, (4) Searchable Audit Trail Browser for every AI decision"

- [ ] **3.9.2c** Set each annotated image to `loading="lazy"` (these are below the fold).
- [ ] **3.9.2d** Add caption text below each image: "Annotated: [view name] with numbered callouts mapping to features below. Scroll down for the interactive walkthrough video."

### 3.10 System Overview (SystemOverview.tsx)

No content edits required. The architecture diagram, design system specimen, and platform grid are well-structured.

### 3.11 Reflections Section (ReflectionsSection.tsx)

No content edits required. The Wins/Misses structure and Reflections cards are effective. The Next Steps section provides forward-looking credibility.

---

## Phase 4: Image & Media Optimization

### 4.1 Create Annotated Product Screenshots

> **⚠️ CRITICAL:** This is the highest-priority visual asset work. Without these, the Product Showcase section fails the 90-second scan test.

#### 4.1.1 Capture Base Screenshots

- [ ] **4.1.1a** Open `https://symplify-v4.netlify.app/` in Chrome.
- [ ] **4.1.1b** Set viewport to 1440×900 (DevTools → Toggle Device Toolbar → set custom dimensions).
- [ ] **4.1.1c** Navigate to the Doctor Dashboard view. Ensure representative data is visible.
- [ ] **4.1.1d** Open DevTools → Cmd+Shift+P → type "Capture full size screenshot" → execute.
- [ ] **4.1.1e** Repeat for Nurse Handoff view and Admin Compliance view.
- [ ] **4.1.1f** Save as: `symplify-doctor-dashboard-base.png`, `symplify-nurse-handoff-base.png`, `symplify-admin-compliance-base.png`

#### 4.1.2 Annotation Template (Figma)

- [ ] **4.1.2a** Create a new Figma file: "Symplify Case Study — Annotated Screenshots"
- [ ] **4.1.2b** Create a frame: 1440×900, no fill (transparent background)
- [ ] **4.1.2c** Build a "Callout Number" component:
  - Circle: 32×32px, fill `#2E37A4` (Symplify primary), no border
  - Text: Inter Bold 14px, `#FFFFFF`, center-aligned
  - Auto Layout: center-center, fixed 32×32
- [ ] **4.1.2d** Build a "Callout Label" component:
  - Rectangle: auto-width, auto-height
  - Fill: `#FFFFFF`
  - Border: 1px solid `#E7E8EB`
  - Border-radius: 8px
  - Padding: 6px 12px
  - Shadow: `0px 1px 2px rgba(0, 0, 0, 0.05)` (shadow-subtle from Symplify tokens)
  - Text: Inter Medium 12px, `#0A1B39`
- [ ] **4.1.2e** Build a "Connector Line" component:
  - Line: 2px stroke, `#2E37A4`, dashed (4px dash, 4px gap)
  - Opacity: 40%
- [ ] **4.1.2f** Build a "Subtle Overlay" rectangle:
  - Fill: `#000000` at 2% opacity
  - Used to dim non-highlighted areas (optional)

#### 4.1.3 Annotate Doctor Dashboard

- [ ] **4.1.3a** Place `symplify-doctor-dashboard-base.png` as the background of a 1440×900 frame.
- [ ] **4.1.3b** Place callout #1 at the AI Triage Queue area (typically top-left message list). Connect to label: "AI Triage Queue — Messages pre-sorted by clinical risk with hover reasoning"
- [ ] **4.1.3c** Place callout #2 at the SLA timer area. Label: "SLA Countdown Timers — Compliance deadlines surfaced in context"
- [ ] **4.1.3d** Place callout #3 at the patient context panel. Label: "Patient Context Panel — 1-click access to relevant history"
- [ ] **4.1.3e** Place callout #4 at the action buttons area. Label: "Quick Actions — Accept/Override/Escalate with keyboard shortcuts"
- [ ] **4.1.3f** Export at 2× as PNG: `symplify-doctor-dashboard-annotated@2x.png`

#### 4.1.4 Annotate Nurse Handoff

- [ ] **4.1.4a** Repeat the above process for the Nurse Handoff view with callouts:
  1. Handoff Status Board
  2. Unresolved Flags
  3. Handoff Notes
  4. Alert Tier Summary

#### 4.1.5 Annotate Admin Compliance

- [ ] **4.1.5a** Repeat for the Admin Compliance view with callouts:
  1. SLA Compliance Tracker
  2. Auto-Generated Reports
  3. Demand Forecasting
  4. Audit Trail Browser

#### 4.1.6 Export & Upload

- [ ] **4.1.6a** Export all 3 annotated screenshots at 2× resolution as PNG.
- [ ] **4.1.6b** Compress each with TinyPNG (https://tinypng.com/) — target under 500KB per file.
- [ ] **4.1.6c** Upload to cdn.builder.io (same asset bucket as existing images): Builder.io → **Content** → **Assets** → Upload.
- [ ] **4.1.6d** Copy the CDN URLs for use in step 3.9.2.

### 4.2 Add Video Poster Frames

- [ ] **4.2.1** For each of the 3 product showcase videos, capture the first frame as a static image.
  - In Chrome, navigate to each video URL directly, pause at 0:00, and screenshot.
  - Or use ffmpeg: `ffmpeg -i video.mp4 -vframes 1 -f image2 poster.jpg`
- [ ] **4.2.2** Upload poster images to cdn.builder.io.
- [ ] **4.2.3** In Builder.io, select each video block → **Settings** → add `poster` attribute with the poster image URL. This ensures the page renders text + images immediately while videos buffer.

### 4.3 Image Optimization Audit

- [ ] **4.3.1** Verify all images below the fold use `loading="lazy"`. In Builder.io, select each image block → **Settings** → confirm `loading="lazy"`.
- [ ] **4.3.2** Verify the hero image (step 3.1.1a) uses `loading="eager"`.
- [ ] **4.3.3** Confirm all images have `aspect-ratio` set (16:9 for full-width images, auto for design system specimens). This prevents layout shift during loading.
- [ ] **4.3.4** Verify all images use the cdn.builder.io URL with optimization parameters (e.g., `?width=1200&format=webp` appended to the URL if supported by the CDN).

### 4.4 Before/After Workflow Comparisons (Optional — P2)

If time allows, create side-by-side comparison images for the Design Decisions section:

- [ ] **4.4.1** Figma frame: 1200×600px, white background
- [ ] **4.4.2** Left panel (580px): Screenshot of "before" state, overlaid with `#FEF2F2` at 30% opacity. Label "BEFORE" in Inter Bold 11px, `#991B1B`, uppercase, top-left.
- [ ] **4.4.3** Center divider: 2px solid `#E7E8EB` with a "vs" badge (circle, 32px, white fill, 1px border `#E7E8EB`, Inter Bold 12px, `#64748B`)
- [ ] **4.4.4** Right panel (580px): Screenshot of "after" state, overlaid with `#F0FDF4` at 30% opacity. Label "AFTER" in Inter Bold 11px, `#166534`, uppercase, top-left.
- [ ] **4.4.5** Recommended comparisons:
  - Triage inbox: email inbox vs. AI triage queue
  - Alert system: flat 47-alert list vs. tiered 2+3+42
  - Scheduling: plain calendar vs. conflict detection modal
  - Compliance: Excel spreadsheet vs. real-time dashboard

---

## Phase 5: Component-Level Polish

### 5.1 TL;DR Block Component

If TL;DR blocks are implemented as reusable Builder.io Symbols:

- [ ] **5.1.1** Create a new **Symbol** in Builder.io called "Case Study TL;DR".
- [ ] **5.1.2** Structure:
  - Outer box: `display: flex; gap: 12px; align-items: flex-start`
  - Icon container: `width: 24px; height: 24px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px`
  - Icon: Zap SVG or ⚡ at 14px, color `#3B82F6`
  - Content container: `flex: 1`
  - Label: "TL;DR" — styles from 3.2.1b
  - Body: data-bound text input — styles from 3.2.1b
- [ ] **5.1.3** Outer wrapper styles:
```css
background: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05));
border-radius: 12px;
padding: 16px;
border-left: 4px solid #3B82F6;
margin-bottom: 32px;
```
- [ ] **5.1.4** Add a data binding for the body text content so each instance can have unique copy.
- [ ] **5.1.5** Deploy the Symbol, then use it in sections 3.2 through 3.9.

### 5.2 Stat Cards (Problem Section)

- [ ] **5.2.1** Verify the 3 stat cards (18%, 14.2%, 60%) use:
  - Background: `#FEF2F2` (sym-bg-red)
  - Border: `1px solid #FECACA`
  - Border-radius: `12px`
  - Text color for value: `#DC2626`
  - Text color for label: `#991B1B`
  - Padding: `16px 20px` on desktop, `12px 16px` on mobile
  - Text alignment: center

### 5.3 Metric Cards (Impact Section)

- [ ] **5.3.1** Verify the 6 animated metric cards use consistent styling:
  - Background: `#FFFFFF`
  - Border: `1px solid #E2E8F0`
  - Border-radius: `16px` (rounded-2xl)
  - Padding: `20px 24px` desktop, `20px` mobile
  - Value: 24–30px bold, per-metric color
  - Before/After: `12px`, with before on gray chip (`#F1F5F9` background) and after in semibold body color

### 5.4 Insight Cards (Research Section)

- [ ] **5.4.1** Verify the 3 insight cards (01, 02, 03) use:
  - Border-radius: `16px`
  - Border: `1px solid #E2E8F0`
  - Number panel width: `80px` on desktop, full-width bar on mobile
  - Number: `24px` bold in the section's accent color
  - Body padding: `24px`
  - Principle text: `14px` semibold italic in the section's accent color

### 5.5 Result Callout Boxes

- [ ] **5.5.1** Verify all "Result" callouts (green boxes with checkmark) in Design Decisions use:
  - Background: `#F0FDF4` (sym-bg-green)
  - Border: `1px solid #BBF7D0`
  - Border-radius: `12px`
  - Padding: `16px 20px`
  - Icon: CheckCircle, `20px`, `#10B981`
  - Text: `14px` medium, `#166534`

### 5.6 Quote Cards (Problem Section)

- [ ] **5.6.1** Verify the 3 stakeholder quote cards use:
  - Background: `#FFFFFF`
  - Border: `1px solid #E2E8F0`
  - Border-radius: `16px`
  - Padding: `24px`
  - Quote text: `15px` italic, `#334155`
  - Citation: `12px` semibold uppercase, `#6B7280`, with "— " prefix

---

## Phase 6: Navigation & Reading Flow

### 6.1 Section Nav Grouping

- [ ] **6.1.1** In Builder.io, select the sticky section navigation bar. Locate the flex container holding the 10 pill-shaped anchor links.
- [ ] **6.1.2** Add thin vertical separators between logical groups. Insert a **Box** block between groups with:
```css
width: 1px;
height: 16px;
background-color: #E2E8F0;
flex-shrink: 0;
margin: 0 4px;
```
- [ ] **6.1.3** Groups (insert separator AFTER the last item in each group):
  - **Context:** Overview, Problem | ← separator here
  - **Process:** Research, Evolution, Design Decisions | ← separator here
  - **Outcome:** Outcomes, Product, Architecture | ← separator here
  - **Reflection:** Assessment, Reflection

### 6.2 Section Nav Pill Styling

- [ ] **6.2.1** Verify each nav pill has:
  - Default: `background: rgba(255,255,255,0.8); border: 1px solid #E2E8F0; color: #334155; border-radius: 9999px; padding: 8px 14px; font-size: 13px; font-weight: 500`
  - Active: `background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); color: #3B82F6`
  - Hover: same as active
  - Focus-visible: `outline: none; ring: 2px solid #3B82F6`

### 6.3 Sticky Nav Bar

- [ ] **6.3.1** Verify the sticky nav bar has:
  - `position: sticky; top: 0; z-index: 40`
  - `background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px)`
  - `border-bottom: 1px solid #F1F5F9`
  - `box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05)`

### 6.4 Scroll-to-Top Button

- [ ] **6.4.1** Verify the scroll-to-top button:
  - Appears after 400px scroll
  - Position: `fixed; bottom: 80px; right: 48px` (within the 1200px container)
  - Size: `44px × 44px` (meets touch target minimum)
  - Background: `linear-gradient(to right, #3B82F6, #10B981)`
  - Border-radius: `50%`
  - Focus ring: `2px solid #3B82F6; offset: 2px`

---

## Phase 7: Accessibility Hardening

### 7.1 Semantic Heading Order

- [ ] **7.1.1** Verify heading hierarchy is strictly sequential:
  - `<h1>`: "Turning Hospital Chaos into Clinical Clarity" (only one per page)
  - `<h2>`: Each section title (Project Overview, Problem, Research, etc.)
  - `<h3>`: Sub-headings within sections (Decision headers, evolution track titles, etc.)
  - No skipped levels (no h1 → h3 without h2)

### 7.2 Image Alt Text Completeness

- [ ] **7.2.1** Audit all 24+ images for alt text. Every image must have descriptive alt text (30+ words) that describes both what is shown AND the design insight it communicates.
- [ ] **7.2.2** Decorative images (background blobs, gradient orbs) should have `alt=""` and `aria-hidden="true"`.
- [ ] **7.2.3** The ZoomableImage lightbox buttons must have `aria-label="View enlarged image"` or equivalent.

### 7.3 Focus States

- [ ] **7.3.1** Verify all interactive elements have visible focus indicators:
  - Nav pills: `focus-visible: ring 2px #3B82F6`
  - Buttons (scroll-to-top, CTA): `focus-visible: ring 2px #3B82F6, offset 2px`
  - Zoomable images: `focus-visible: ring 2px #3B82F6`
  - Collapsible `<details>` summaries: `focus-visible: ring 2px #3B82F6`
  - Links (back to case studies, live platform): `focus-visible: ring 2px #3B82F6`
- [ ] **7.3.2** Ensure no focus indicator is hidden by `outline: none` without a replacement.

### 7.4 ARIA Attributes

- [ ] **7.4.1** Add `aria-label` to each EvolutionTrack stage card. In Builder.io, select each card block → **Settings** → add attribute `aria-label="Stage [N]: [stage title]"`.
  - Stage 1: "Stage 1: Initial Sketches"
  - Stage 2: "Stage 2: Wireframe v1 — Percentage Scores"
  - etc.
- [ ] **7.4.2** Add `aria-label` to each DesignDecision card: "Design Decision [N]: [title]"
- [ ] **7.4.3** Verify the reading progress bar has `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-label="Reading progress"`.

### 7.5 Touch Targets

- [ ] **7.5.1** Verify all tappable elements meet the 44×44px minimum:
  - Section nav pills: padding creates >= 44px height ✅ (8px top + 13px text + 8px bottom = ~36px → increase padding to `10px 14px` for 43px, or wrap in 44px min-height container)
  - Scroll-to-top button: 44px ✅
  - Back link: text + padding area >= 44px tap zone
  - Zoomable image buttons: full image area ✅
  - Collapsible summary triggers: line-height creates adequate area
- [ ] **7.5.2** On mobile (375px viewport), verify nav pills don't overlap and have at least 8px gap between tappable areas.

### 7.6 Color Contrast Fixes

- [ ] **7.6.1** The section category labels use accent colors on white/near-white backgrounds:
  - `sym-blue` (#3B82F6) on white: 3.44:1 — **FAILS** AA for small text
  - Fix: Change label text color to `#2563EB` (blue-600) which provides 4.56:1 ✅
  - OR: Keep `#3B82F6` but ensure font-size is ≥ 18px bold or ≥ 24px regular (currently 12px — does NOT meet exception)
- [ ] **7.6.2** Apply the same fix to `sym-green` labels: change from `#10B981` to `#059669` (emerald-600, 4.53:1 ✅)
- [ ] **7.6.3** Apply to `sym-purple` labels: change from `#8B5CF6` to `#7C3AED` (violet-600, 4.89:1 ✅)
- [ ] **7.6.4** In Builder.io: select each section's category label span → **Style** → **Typography** → update `color` to the corrected value.

---

## Phase 8: Performance Optimization

### 8.1 Image Loading Strategy

- [ ] **8.1.1** Hero image: `loading="eager"` (step 3.1.1a)
- [ ] **8.1.2** All other images: `loading="lazy"` ✅ (already implemented)
- [ ] **8.1.3** Add `decoding="async"` to all non-hero images for non-blocking decode. In Builder.io, add this as an HTML attribute on each image block.

### 8.2 Video Optimization

- [ ] **8.2.1** Add poster frames to all 3 product videos (step 4.2)
- [ ] **8.2.2** Verify videos use `preload="metadata"` (not `preload="auto"`). This is already set in the code — confirm in Builder.io that no override exists.
- [ ] **8.2.3** Verify `muted` and `playsinline` attributes are present on all videos (required for autoplay on mobile).

### 8.3 Unnecessary Blocks

- [ ] **8.3.1** Review the Builder.io layers panel for any hidden or empty blocks that add to DOM size. Remove any blocks with `display: none` that aren't used for responsive show/hide.
- [ ] **8.3.2** The `AssetPlaceholder` component in `shared.tsx` is a development utility. Verify no instances appear in the published page.

### 8.4 CSS Optimization

- [ ] **8.4.1** Verify the background pattern (radial-gradient dots at 0.025 opacity) and the gradient blur orbs use `pointer-events: none` and don't create unnecessary paint layers. These are already implemented correctly in the code.
- [ ] **8.4.2** Verify scroll-reveal animations use `transform` and `opacity` only (GPU-accelerated properties). The current implementation uses `classList.add("visible")` which triggers CSS transitions — this is the correct approach.

---

## QA Checklist

Run this checklist after implementing all phases.

### Visual QA

- [ ] **QA-1** Desktop (1440px): All sections have 48px horizontal padding, 64px vertical padding, 1200px max-width
- [ ] **QA-2** Tablet (768px): Grids collapse to 2 columns or 1 column appropriately, no horizontal overflow
- [ ] **QA-3** Mobile (375px): Single column layout, 16px horizontal padding, no text truncation, all images fit within viewport
- [ ] **QA-4** TL;DR blocks visible in all 6 sections (Overview, Problem, Research, Impact, Evolution, Decisions)
- [ ] **QA-5** Annotated screenshots visible above videos in all 3 Product Showcase cards
- [ ] **QA-6** Cost-of-problem estimate visible below stats strip in Problem section
- [ ] **QA-7** Section nav separators visible between 4 groups

### Functional QA

- [ ] **QA-8** Section nav anchor links scroll to correct sections
- [ ] **QA-9** Active section highlighting updates correctly while scrolling
- [ ] **QA-10** ZoomableImage lightbox opens/closes correctly on new annotated screenshots
- [ ] **QA-11** Autoplay videos play when scrolled into view, pause when scrolled away
- [ ] **QA-12** Collapsible sections (Research Methodology, Business Value) expand/collapse
- [ ] **QA-13** Scroll-to-top button appears after 400px scroll and works
- [ ] **QA-14** "View Live Platform" CTA opens symplify-v4.netlify.app in new tab
- [ ] **QA-15** Back to Case Studies link navigates correctly

### Accessibility QA

- [ ] **QA-16** Tab through entire page: every interactive element receives focus in logical order
- [ ] **QA-17** All focus indicators are visible (no invisible focus states)
- [ ] **QA-18** ESC closes ZoomableImage lightbox and returns focus to trigger
- [ ] **QA-19** Screen reader announces: page title, all headings in order, all image alt text, all landmark regions
- [ ] **QA-20** Run Lighthouse accessibility audit — target score ≥ 95
- [ ] **QA-21** Run axe DevTools scan — zero critical or serious violations

### Performance QA

- [ ] **QA-22** Hero image loads within first paint (verify with DevTools Network tab — should appear before LCP)
- [ ] **QA-23** All below-fold images lazy load (verify no unnecessary network requests on initial load)
- [ ] **QA-24** Video poster frames display before video loads
- [ ] **QA-25** Lighthouse Performance score ≥ 85
- [ ] **QA-26** Total page weight < 5MB (check DevTools Network tab → transferred size)
- [ ] **QA-27** No layout shift during image loading (CLS < 0.1)

---

## Design Token Reference Tables

### Symplify Platform Tokens (from _variables.scss)

| Category | Token | Value | Notes |
|----------|-------|-------|-------|
| **Primary** | `--primary` | `#2E37A4` | Sidebar, primary buttons, annotation callouts |
| **Secondary** | `--secondary` | `#00D3C7` | Teal accents, success indicators |
| **Success** | `--success` | `#27AE60` | Positive outcomes |
| **Info** | `--info` | `#2F80ED` | Informational badges |
| **Danger** | `--danger` | `#EF1E1E` | Critical alerts |
| **Warning** | `--warning` | `#C9A227` | Caution states |
| **Heading** | `--heading-color` | `#0A1B39` | All headings in platform |
| **Body** | `--body-color` | `#595F6E` | Default body text |
| **Border** | `--border-color` | `#E7E8EB` | All borders |
| **Background** | `--light` | `#F5F6F8` | Page backgrounds |
| **Font** | `$font-family-base` | `'Inter', sans-serif` | Primary typeface |
| **Font Mono** | `$font-family-mono` | `'JetBrains Mono', monospace` | Data/code values |
| **Radius SM** | `$border-radius` | `0.3rem` | Small elements |
| **Radius LG** | `$border-radius-lg` | `0.6rem` | Cards, panels |

### Clinical Severity Tokens

| Severity | Text | Background | Border |
|----------|------|------------|--------|
| Critical | `#DC2626` | `#FEF2F2` | `#FECACA` |
| Urgent | `#EA580C` | `#FFF7ED` | `#FED7AA` |
| Caution | `#CA8A04` | `#FEFCE8` | `#FEF08A` |
| Stable | `#16A34A` | `#F0FDF4` | `#BBF7D0` |
| Info | `#2563EB` | `#EFF6FF` | `#BFDBFE` |

### Shadow System

| Level | Value | Usage |
|-------|-------|-------|
| Subtle | `0px 1px 2px rgba(0,0,0,0.05)` | Cards at rest, annotation labels |
| Medium | `0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)` | Cards on hover |
| Elevated | `0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)` | Modals, lightbox |

### Spacing Grid (4px base)

| Token | Value | Common Usage |
|-------|-------|-------------|
| `--space-1` | 4px | Tight gaps |
| `--space-2` | 8px | Icon-to-text gap |
| `--space-3` | 12px | Inline element spacing |
| `--space-4` | 16px | Card padding (mobile), grid gaps |
| `--space-5` | 20px | Card padding (desktop) |
| `--space-6` | 24px | Section sub-spacing |
| `--space-8` | 32px | Between content groups |
| `--space-10` | 40px | Large vertical gaps |
| `--space-12` | 48px | Section padding (current ConstraintsBar) |
| `--space-16` | 64px | Section padding (standard) |

---

*End of implementation guide. Total action items: 87 checkboxes across 8 phases + 27 QA checks.*
