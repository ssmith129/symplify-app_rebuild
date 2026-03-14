# Symplify Case Study — Full Rewrite Spec

## Implementation Guide

**Purpose:** Complete restructured content, section-by-section, implementing all P0–P2 audit recommendations. This document serves as the source of truth for rebuilding `SymplifyCaseStudy.tsx` and all `/components/symplify/` files.

**Key changes from current version:**
1. Integrates 10 shared case study components (was 0)
2. Adds 18 visual asset placeholders requiring real screenshots/exports
3. Adds SectionTLDR to every major section
4. Makes section nav sticky
5. Adds reading time + reading progress indicator
6. Restructures hero to front-load the most dramatic metric
7. Adds "Final Product" showcase section with annotated live screenshots
8. Adds design evolution progression for key features
9. Adds Open Graph meta tags
10. Extracts colors to semantic tokens

---

## File Structure (New)

```
client/pages/SymplifyCaseStudy.tsx          ← Orchestrator (rewrite)
client/components/symplify/
  ├── HeroSection.tsx                       ← Rewrite: add metric to subtitle
  ├── ImpactMetrics.tsx                     ← Rewrite: unified before/after table
  ├── ProjectOverview.tsx                   ← Rewrite: visual timeline + TL;DR
  ├── ProblemSection.tsx                    ← Rewrite: TL;DR + real artifact images
  ├── ConstraintsBar.tsx                    ← Minor: add TL;DR
  ├── ResearchSection.tsx                   ← Rewrite: add research photos + TL;DR
  ├── DesignDecisions.tsx                   ← Major rewrite: real screenshots replace coded mockups
  ├── ProductShowcase.tsx                   ← NEW: annotated live product screenshots
  ├── PivotalMoments.tsx                    ← Minor: add TL;DR
  ├── SystemOverview.tsx                    ← Rewrite: add design system specimen
  ├── ReflectionsSection.tsx                ← Minor: add CaseStudySummary
  └── DesignEvolution.tsx                   ← NEW: wireframe progression gallery
```

---

## Page-Level Orchestrator: `SymplifyCaseStudy.tsx`

### New Imports (Shared Components to Integrate)

```tsx
// NEW — Shared case study components
import { CaseStudyStructuredData } from "../components/case-study";
import ReadingProgress from "../components/case-study/ReadingProgress";
// Note: SectionTLDR is imported within individual section components
// Note: BeforeAfterComparison is imported within DesignDecisions
// Note: DesignEvolutionShowcase is imported within DesignEvolution
// Note: AnnotatedDemo is imported within ProductShowcase
// Note: CaseStudyFooterNav is used at page bottom
```

### New SEO: Open Graph Meta Tags

Add to the `useEffect` that handles SEO:

```tsx
// Open Graph
const ogTags = [
  { property: "og:title", content: "Symplify — Turning Hospital Chaos into Clinical Clarity" },
  { property: "og:description", content: "Case study: Designing an AI-enhanced hospital management platform that reduced triage time 40% and improved accuracy to 89% across 3 facilities." },
  { property: "og:image", content: "https://cdn.builder.io/api/v1/image/assets%2Fba69a23156414a589de97341511272c9%2Fadf782ed456e4ee188c3992a86747eef" },
  { property: "og:type", content: "article" },
  { property: "og:url", content: "https://smithdesign.live/case-studies/symplify-hospital-management-system" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Symplify — Turning Hospital Chaos into Clinical Clarity" },
  { name: "twitter:description", content: "Designing an AI-enhanced hospital management platform. 40% faster triage, 89% accuracy, 3 facilities." },
];
```

Replace inline JSON-LD with:

```tsx
<CaseStudyStructuredData
  title="Symplify — Turning Hospital Chaos into Clinical Clarity"
  description="End-to-end design of an AI-enhanced hospital management platform for 65 clinical staff across 3 facilities."
  authorName="Sean Smith"
  authorJobTitle="Senior UX/Product Designer"
  publishedDate="2024-08-01"
  modifiedDate="2026-02-23"
  imageUrl="https://cdn.builder.io/api/v1/image/assets%2F..."
  url="https://smithdesign.live/case-studies/symplify-hospital-management-system"
/>
```

### Sticky Section Nav

Replace the inline nav with:

```tsx
{/* Sticky Section Navigation */}
<div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#F1F5F9] shadow-sm">
  <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
    <nav
      aria-label="Case study sections"
      className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide
                 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-8 before:bg-gradient-to-r before:from-white/80 before:to-transparent before:z-10 before:pointer-events-none
                 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-8 after:bg-gradient-to-l after:from-white/80 after:to-transparent after:z-10 after:pointer-events-none"
    >
      {sectionNav.map((item) => { /* ...same pill rendering... */ })}
    </nav>
  </div>
</div>
```

### Reading Time Badge

Add below the hero subtitle:

```
⏱ 14 min read
```

### Updated Section Order

```tsx
<main id="main-content">
  <ImpactMetrics />            {/* At a Glance — unified before/after */}
  <SectionDivider />
  <ProjectOverview />          {/* Context — visual timeline */}
  <SectionDivider />
  <ProblemSection />           {/* Problem — with research artifact images */}
  <ConstraintsBar />
  <SectionDivider />
  <ResearchSection />          {/* Research — with photo artifacts */}
  <SectionDivider />
  <DesignEvolution />          {/* NEW: Wireframe progression */}
  <SectionDivider />
  <DesignDecisions />          {/* Decisions — real screenshots */}
  <SectionDivider />
  <ProductShowcase />          {/* NEW: Final product annotated screens */}
  <SectionDivider />
  <PivotalMoments />           {/* Pivots */}
  <SectionDivider />
  <SystemOverview />           {/* Architecture + Design System specimen */}
  <SectionDivider />
  <ReflectionsSection />       {/* Outcomes + Reflection + CaseStudySummary */}
</main>
```

---

## Section 1: Hero

### Changes from Current

- Add most dramatic metric to subtitle line
- Add reading time badge
- Increase meta badge contrast

### Content

**Tag:** `HEALTHCARE AI PLATFORM`

**H1:** Turning Hospital Chaos into Clinical Clarity

**Subtitle (revised):**
> I led end-to-end design for a 0-to-1 AI-enhanced hospital management platform that unified fragmented EHR, Excel, and email workflows into a single, trustworthy system — reducing triage time by 40% across 3 facilities and 65 clinical staff.

**Reading time:** `⏱ 14 min read` (small muted badge below subtitle)

**Meta badges:** (same as current)
- Founding Product Designer
- Jan – Aug 2024
- 2 Engineers, 1 PM, 4 Clinical Advisors
- 3 Facilities · 65 Staff · 6-Week Pilot

**Role / Scope:** (same as current)

### Hero Image

**`📸 ASSET: hero-dashboard-tablet.jpg`**
*Current Builder.io hosted image. Keep as-is but add an alternative:*

**`📸 ASSET: hero-dashboard-desktop-full.png`**
*Full-width annotated desktop screenshot from symplify-v4-live.vercel.app showing the main dashboard with callout labels pointing to: AI triage queue, confidence badges, alert tiers, and scheduling panel.*

Recommended: Use the desktop screenshot as primary hero, tablet as secondary context image. The desktop screenshot shows more detail at a glance.

---

## Section 2: Impact at a Glance

### Changes from Current

- Add unified Before → After comparison table at top
- Keep animated metric cards
- Move the business value estimate into a collapsible `<details>` to reduce visual weight

### TL;DR

```
<SectionTLDR>
  6-week pilot across 3 facilities: 40% faster triage, 89% accuracy,
  35% less admin overhead, and ~$78K/year estimated savings — with full
  AI transparency maintained (11% override rate, <10% false positives).
</SectionTLDR>
```

### Unified Before → After Comparison Table (NEW)

This replaces the scattered metric cards as the primary scanning element:

| Metric | Before (Baseline) | After (6-Week Pilot) | Change |
|---|---|---|---|
| Triage Time | 2m 15s per message | 1m 18s per message | **~40% faster** |
| Triage Accuracy | 60% | 89% | **+29 pts** |
| SLA Compliance | 72% | 85.3% | **+13 pts** |
| Admin Overhead | 12.5 hrs/wk | 8.1 hrs/wk | **-35%** |
| No-Show Rate | 9.8% | 7.4% | **-2.4 pts** |
| Alert Fatigue | Baseline | -38% from baseline | **-38%** |

Implementation: Render as a styled table component with color-coded change column (green for improvements). This becomes the single artifact a hiring manager can screenshot and share.

### Animated Metric Cards

Keep the current 6-card grid with animated counters below the table. These serve as the visual "wow" moment but the table above is the scannable reference.

### Guardrails + Caveat

Keep exactly as-is. The green AI guardrails box and yellow pilot caveat are trust-building elements.

### Business Value Estimate

Wrap in `<details>` with summary "View estimated business value":

```html
<details>
  <summary>View estimated annual business value (pilot scale)</summary>
  <!-- Current 3-card grid: ~$47K saved, ~$31K recovered, ~957 min/week freed -->
  <!-- Current disclaimer italic text -->
</details>
```

---

## Section 3: Project Overview

### Changes from Current

- Add TL;DR
- Replace dense paragraphs with a visual project timeline
- Add a structured role/scope card instead of inline paragraphs

### TL;DR

```
<SectionTLDR>
  Custom Data Processing Inc. needed a clinical coordination platform
  that integrates with (not replaces) legacy EHR systems, complies with
  HIPAA, and proves value in 6 weeks. As founding product designer,
  I owned research through pilot validation.
</SectionTLDR>
```

### Visual Project Timeline (NEW)

**`📸 ASSET: project-timeline-graphic.svg`** or build as coded component:

```
Jan 2024          Feb              Mar              Apr              May              Jun              Jul              Aug
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
[  Discovery  ]   [ Research  ]    [  Synthesis  ]   [ Design Sprint 1 ] [ Design Sprint 2 ]  [  Pilot  ]  [ Analysis ]
  Stakeholder      18 shadows       Journey maps      AI confidence       Scheduling +        6-week         Metrics
  interviews       3,000 tasks      Insight cards      Triage inbox        Alert tiers          rollout        analysis
                   14 interviews    Competitive        Coded prototypes    Usability tests      65 staff       Report
                                    benchmarking       3 rounds of                              3 sites
                                                       user testing
```

### Structured Role Card (replaces 3 paragraphs)

Present as a compact 2-column card:

**Client:** Custom Data Processing Inc. — mid-sized health IT services company
**Users:** 65 clinical staff (MDs, RNs, admins) across 3 public health facilities
**Problem:** Fragmented EHR + Excel + email workflows causing measurable clinical and operational losses
**My Role:** Founding Product Designer — research planning, interaction design, prototyping, design system, pilot validation
**Team:** 2 Engineers, 1 PM, 4 Clinical Advisors
**Timeline:** Jan – Aug 2024 (8 months total, 6-week pilot)
**Constraint:** Prove measurable improvement within 6-week pilot window or project doesn't get broader rollout

### Success Criteria Cards

Keep the current 4-card grid (Reduce cognitive overhead, Improve compliance visibility, Unify fragmented workflows, Prove viability at pilot scale). No changes needed.

---

## Section 4: The Problem

### Changes from Current

- Add TL;DR
- Add real research artifact photos
- Keep journey map swim lanes (strong existing element)

### TL;DR

```
<SectionTLDR>
  Staff operated across 3 disconnected systems with no shared triage model.
  18% of urgent handoffs were missed at shift change. Doctors spent 2 minutes
  per message just deciding if it was urgent — 8 hours of cognitive overhead per month.
</SectionTLDR>
```

### Research Artifact Photos (NEW)

Add before the journey map:

**`📸 ASSET: affinity-wall-photo.jpg`**
*Photo of the physical or digital affinity wall from the contextual inquiry synthesis. Shows sticky notes grouped by theme (Triage Delays, Handoff Gaps, Alert Overload, Compliance Blindspots). If no photo exists, recreate in FigJam and screenshot.*
Caption: "Affinity mapping from 18 contextual inquiry sessions — 4 primary pain clusters emerged."

**`📸 ASSET: journey-map-whiteboard.jpg`**
*Photo of the early-stage journey map on a whiteboard or in Miro/FigJam before it was cleaned up into the coded swim lane version. Shows the messy, real research process.*
Caption: "Raw journey mapping workshop with clinical advisors. The swim lane visualization was refined from this working session."

### Journey Map Swim Lanes

Keep exactly as-is. This is one of the strongest existing elements.

### Stakeholder Quotes

Keep the 3 quotes. No changes.

### Problem Stats Strip

Keep the 4-stat strip (18%, 9.8%, 14.2%, 60%). No changes.

---

## Section 5: Constraints Bar

### Changes from Current

- Add a brief TL;DR-style summary line

### Summary Line (above the 4-card grid)

> Every design decision operated within four non-negotiable constraints. Violating any one meant instant rejection by clinical staff or compliance teams.

### Constraint Cards

Keep exactly as-is: HIPAA + SOC 2, Legacy EHRs Stay, Zero Added Workload, Intermittent Connectivity.

---

## Section 6: Research

### Changes from Current

- Add TL;DR
- Add research process photos
- Keep methodology table and insight cards (strong existing elements)

### TL;DR

```
<SectionTLDR>
  Shadowed 18 staff across 3 facilities, logged 3,000+ tasks, conducted
  14 interviews, and analyzed 1,200 messages. Three insights reshaped the
  project: staff wanted augmentation not automation, "urgent" had no shared
  meaning, and compliance failures were visibility problems not discipline problems.
</SectionTLDR>
```

### Research Process Photos (NEW)

Add a 3-image horizontal gallery between the methods strip and the insight cards:

**`📸 ASSET: contextual-inquiry-photo.jpg`**
*Photo from a contextual inquiry session (faces blurred/anonymized). Shows the researcher observing a clinician at their workstation with multiple systems open.*
Caption: "Shadowing an RN supervisor during shift change — one of 18 contextual inquiry sessions across 3 facilities."

**`📸 ASSET: task-logging-dashboard.png`**
*Screenshot of the task logging tool or spreadsheet used to capture the 3,000+ tasks. Shows the data structure: timestamp, role, task type, urgency, time-to-complete.*
Caption: "Automated task logging captured 3,000+ clinical coordination tasks over 2 weeks — eliminating self-reporting bias."

**`📸 ASSET: interview-synthesis-wall.jpg`**
*Photo or screenshot of the interview coding process. Shows how quotes were grouped into themes. Could be a FigJam board, Dovetail screenshot, or physical sticky notes.*
Caption: "Independent dual-coding of 14 semi-structured interviews. The 67% 'no automation' finding emerged from this synthesis."

### Methods Strip

Keep the 4-card grid (Shadowed 18 staff, Logged 3,000+ tasks, 14 interviews, Analyzed 1,200 messages). No changes.

### Detailed Research Methodology Table

Keep the collapsible `<details>` table. No changes.

### Insight Cards

Keep the 3 numbered insight cards. No changes. These are strong.

### Competitive Analysis Table

Keep as-is. No changes.

---

## Section 7: Design Evolution (NEW SECTION)

### Purpose

This section addresses the biggest audit finding: **no wireframe or iteration evidence**. It shows how the two most critical features evolved from sketches to production.

### TL;DR

```
<SectionTLDR>
  Key features went through 3-4 rounds of iteration based on clinical
  feedback. The AI confidence display pivoted from percentages to badges
  after testing showed 67% of clinicians rejected numerical precision.
  Scheduling went from auto-booking to suggestion-based after similar rejection.
</SectionTLDR>
```

### Evolution 1: AI Triage Inbox

Uses `DesignEvolutionShowcase` component:

**Stage 1: Initial Sketches**
**`📸 ASSET: triage-inbox-sketch.jpg`**
*Low-fidelity pencil/iPad sketch of the triage inbox concept. Shows rough layout of message list with urgency indicators.*
Caption: "Initial concept sketch exploring how to surface AI-assessed urgency alongside message content."
Learning: "First question we needed to answer: how do you show AI confidence without creating false precision?"

**Stage 2: Wireframe v1 — Percentage Scores**
**`📸 ASSET: triage-inbox-wireframe-v1.png`**
*Mid-fidelity wireframe (Figma gray-box) showing the inbox with percentage-based confidence scores (e.g., "73% urgent"). This is the version that tested at 33% acceptance.*
Caption: "Wireframe tested with 12 clinicians. Percentage scores felt like 'fake precision' — only 33% acceptance."
Learning: "Clinicians aren't statisticians. Exact percentages made them question the AI more, not trust it more."

**Stage 3: Wireframe v2 — 3-Tier Badges**
**`📸 ASSET: triage-inbox-wireframe-v2.png`**
*Mid-fidelity wireframe showing the inbox redesigned with High/Medium/Low badge system and hover-to-reveal reasoning panel.*
Caption: "Redesigned with 3-tier badges after the percentage rejection. Tested at 89% acceptance."
Learning: "The breakthrough: badges communicate 'suggested priority' rather than 'calculated probability.' Staff felt like it was an assistant, not a replacement."

**Stage 4: Production UI**
**`📸 ASSET: triage-inbox-production.png`**
*Full hi-fi screenshot from symplify-v4-live.vercel.app showing the actual production triage inbox with confidence badges, AI reasoning panel expanded, and Accept/Override actions.*
Caption: "Shipped production UI. 11% override rate with full audit trail on every decision."
Learning: "Result: override rate dropped from 18% (percentage version) to 11% (badge version). Trust through transparency."

### Evolution 2: Scheduling Conflict Flow

**Stage 1: Auto-Booking Concept**
**`📸 ASSET: scheduling-sketch-autobook.jpg`**
*Sketch showing the original auto-booking concept where the system automatically assigns appointment slots.*
Caption: "Original concept: system auto-books optimal slots. Seemed like an obvious efficiency win."
Learning: "67% of clinicians rejected this outright. 'It feels like the system is making clinical decisions without me.'"

**Stage 2: Suggestion-Based Wireframe**
**`📸 ASSET: scheduling-wireframe-suggestion.png`**
*Wireframe showing the pivot to suggestion-based scheduling with conflict detection modal and 'Accept Suggestion' / 'Override & Keep Original' actions.*
Caption: "Post-pivot wireframe: detect conflicts, suggest alternatives, always allow override."
Learning: "Error prevention over error correction. Don't just say 'no' — offer a better option with context."

**Stage 3: Production Conflict Modal**
**`📸 ASSET: scheduling-conflict-production.png`**
*Full hi-fi screenshot from the live platform showing the actual conflict detection modal with room suggestion, patient preference match, and audit logging note.*
Caption: "Production conflict modal. 89% of suggestions accepted. No-show rate dropped 2.4 points."
Learning: "The override escape hatch was key. Clinicians who know they CAN override feel safe accepting suggestions."

---

## Section 8: Design Decisions

### Changes from Current

- Add TL;DR
- **Replace all coded HTML mockups with real screenshots** from the live platform
- Keep the A/B/C comparison data for Decision 01 (strong)
- Add `BeforeAfterComparison` slider for Decision 04 (Alert Fatigue)

### TL;DR

```
<SectionTLDR>
  Four core design decisions shaped the platform: a 3-tier AI confidence
  system (89% acceptance vs. 33% for percentages), auditable plain-language
  AI reasoning, suggestion-based scheduling with override escape hatches,
  and risk-tiered alert batching that cut alert fatigue 38%.
</SectionTLDR>
```

### Decision 01: AI Confidence Display

Keep the A/B/C comparison cards (these are strong data-driven comparisons). Add a real screenshot:

**`📸 ASSET: confidence-badge-production-closeup.png`**
*Cropped screenshot showing 2-3 inbox items in the production UI with different confidence levels (High in red, Medium in amber, Low in gray/blue). Show the badge + one expanded reasoning panel.*
Caption: "Production confidence badges with hover-to-reveal reasoning. The 'smart assistant' framing drove 89% acceptance."

Replace the ResultCallout text (keep component, update copy):
> **Result:** Switching from percentages to 3-tier badges dropped AI override rate from 18% to 11%, while maintaining full HIPAA audit compliance.

### Decision 02: Auditable AI Reasoning

**Replace** the coded InboxCardMockup with a real screenshot:

**`📸 ASSET: ai-reasoning-panel-expanded.png`**
*Full screenshot from the live platform showing a high-priority triage item with the AI reasoning panel fully expanded. Should show: confidence badge, plain-language reasoning bullets (Symptom severity, Patient history, SLA requirement), and Accept/Override buttons.*
Caption: "The AI reasoning panel at the point of decision. Clinicians see 'why' on demand — satisfying both HIPAA audit requirements and clinical trust needs."

Keep the 4-step process cards (confidence badges → plain-language reasoning → 1-click override → retraining loop). No changes.

### Decision 03: Smart Scheduling

**Replace** the coded ConflictModalMockup with a real screenshot:

**`📸 ASSET: scheduling-conflict-modal-production.png`**
*Screenshot of the actual conflict detection modal from the live platform. Should show the conflict description, suggested alternative with room/time/accessibility details, and the Accept/Override buttons with the audit logging note.*
Caption: "Production conflict detection modal. Context-rich suggestions (room, time, accessibility) reduced scheduling conflicts and contributed to the 2.4-point no-show reduction."

Keep the design rationale paragraph. No changes.

### Decision 04: Solving Alert Fatigue

**Replace** the coded AlertBeforeAfter with `BeforeAfterComparison` component:

```tsx
<BeforeAfterComparison
  featureName="Alert System"
  beforeImage={{
    src: "📸 ASSET: alerts-before-flat-list.png",
    alt: "Flat list of 47 alerts all marked with equal urgency, no prioritization or grouping"
  }}
  afterImage={{
    src: "📸 ASSET: alerts-after-tiered.png",
    alt: "Risk-tiered alert system: 2 critical actions, 3 items for review, 42 FYI items batched into a single collapsible digest"
  }}
  painPoints={[
    "All alerts marked '!' with no priority differentiation",
    "47+ daily interruptions per clinician",
    "Critical SLA deadlines buried in noise",
    "No batch/digest option — every alert demanded individual attention"
  ]}
  improvements={[
    "3-tier risk classification: Critical Action / Review Needed / FYI",
    "Similar alerts batched into daily digests",
    "FYI tier collapses to acknowledge without demanding attention",
    "Clinical risk score + SLA deadline determines tier automatically"
  ]}
  impactStatement="Alert fatigue reduced 38%. On-time follow-ups increased 18%. Average daily interruptions per clinician dropped from 47 to 12."
/>
```

**`📸 ASSET: alerts-before-flat-list.png`**
*Screenshot or recreation showing the old flat alert list. If this can't be captured from a legacy system, create a realistic mockup in Figma showing 7+ alerts all with identical "!" urgency markers.*

**`📸 ASSET: alerts-after-tiered.png`**
*Screenshot from the live platform showing the tiered alert system: 2 red Critical Action items with countdown timers, 3 amber Review Needed items, and a collapsed gray FYI section showing "42 items batched."*

---

## Section 9: Product Showcase (NEW SECTION)

### Purpose

This section provides the **visual proof of craft** that the audit identified as missing. 3–4 full-screen annotated screenshots from the live platform, each with callout annotations explaining the design decisions visible in the UI.

### TL;DR

```
<SectionTLDR>
  The production platform serves three distinct user roles through a shared
  data layer. Each view surfaces only the information and actions relevant
  to that role's workflow, reducing cognitive overhead while maintaining
  cross-team visibility.
</SectionTLDR>
```

### Screenshot 1: Doctor Dashboard

**`📸 ASSET: product-doctor-dashboard-annotated.png`**
*Full-width annotated screenshot of the doctor's dashboard view. Add numbered callout bubbles pointing to:*

1. **AI Triage Queue** — Messages pre-sorted by clinical risk. High/Medium/Low badges with hover reasoning.
2. **SLA Countdown Timers** — Compliance deadlines surfaced in context, not buried in email.
3. **Patient Context Panel** — 1-click access to relevant history without opening the EHR.
4. **Quick Actions** — Accept/Override/Escalate with keyboard shortcuts for power users.

Caption: "Doctor's primary view: AI-augmented triage with full transparency. Every recommendation is explainable, overridable, and audit-logged."

### Screenshot 2: Nurse Shift Handoff View

**`📸 ASSET: product-nurse-handoff-annotated.png`**
*Full-width annotated screenshot of the nurse's shift handoff view. Callouts:*

1. **Handoff Status Board** — Visual state of every in-progress item at shift change.
2. **Unresolved Flags** — Items that need immediate attention are surfaced at the top.
3. **Handoff Notes** — Structured format replaces the "call the previous shift at home" workflow.
4. **Alert Tier Summary** — At-a-glance view of what's critical vs. informational.

Caption: "Nurse shift handoff: structured visibility replaced 20-minute phone calls. Handoff-related missed items dropped from 18% baseline."

### Screenshot 3: Admin Compliance Dashboard

**`📸 ASSET: product-admin-compliance-annotated.png`**
*Full-width annotated screenshot of the admin's compliance and reporting view. Callouts:*

1. **SLA Compliance Tracker** — Real-time compliance rates by facility, department, and provider.
2. **Auto-Generated Reports** — Replaces the manual Excel export + monthly report build workflow.
3. **Demand Forecasting** — AI-assisted demand predictions replacing "guesswork" (per the admin quote).
4. **Audit Trail Browser** — Searchable log of every AI recommendation, override, and outcome.

Caption: "Admin compliance dashboard: replaced 4.4 hrs/week of manual Excel work. 15% of admins still export to Excel for board reports — a change management gap we're addressing in v2."

### Screenshot 4: Mobile Triage (On-Call)

**`📸 ASSET: product-mobile-triage-annotated.png`**
*Mobile screenshot showing the critical-only on-call triage view. Callouts:*

1. **Critical Alerts Only** — FYI and Review items are suppressed on mobile.
2. **1-Thumb Operation** — Accept/Override actions sized for one-handed use (44x44px touch targets).
3. **Offline Indicator** — Shows sync status for rural/intermittent connectivity sites.

Caption: "Mobile on-call view: critical alerts only, designed for 1-thumb operation in clinical corridors. Offline-first architecture caches pending actions for rural sites."

---

## Section 10: Pivotal Moments

### Changes from Current

- Add TL;DR
- Content stays the same (this section is already the strongest in the case study)

### TL;DR

```
<SectionTLDR>
  Two critical moments reshaped the project. The 67% rejection of auto-assignment
  forced a pivot from automation to augmentation. A HIPAA audit requirement initially
  seen as a burden produced the highest-rated feature (89% trust score) by forcing
  transparent AI reasoning at the point of decision.
</SectionTLDR>
```

### Moments

Keep both Pivotal Moments exactly as-is. No content changes needed.

---

## Section 11: System Architecture + Design System

### Changes from Current

- Add TL;DR
- Keep coded architecture diagram (appropriate for technical content)
- Add design system specimen sheet
- Add real component screenshots

### TL;DR

```
<SectionTLDR>
  Symplify acts as a read-only integration layer — extending legacy EHR, Excel,
  and email systems through AI-powered recommendation rather than replacement.
  The design system was built around WCAG 2.2 AA compliance, 8pt grid, and
  role-based information density.
</SectionTLDR>
```

### Architecture Diagram

Keep the existing coded diagram. It's appropriate for technical content and renders well.

### Design System Specimen Sheet (NEW)

**`📸 ASSET: design-system-specimen.png`**
*Full-width Figma export showing the design system overview. Include:*
- Color palette: Primary blue (#3B82F6), success green (#10B981), warning amber (#F59E0B), danger red (#EF4444), neutrals
- Typography scale: Headings, body, labels, with actual font family and sizes
- Spacing grid: 8pt grid demonstration
- Core components: Confidence badges (High/Medium/Low), alert tier cards, action buttons (Accept/Override), form inputs
- Accessibility notes: Color-blind safe badge variants, focus ring styles, keyboard nav indicators

Caption: "Design system specimen: WCAG 2.2 AA baked into tokens. Color-blind safe confidence badges, keyboard navigation, and screen reader support from day one."

### Component Detail Screenshots (NEW)

**`📸 ASSET: ds-confidence-badges.png`**
*Close-up of the three confidence badge variants: High (red), Medium (amber), Low (blue/gray) in both default and color-blind-safe modes.*
Caption: "Confidence badge variants. Color-blind safe versions use pattern + label redundancy."

**`📸 ASSET: ds-alert-tier-cards.png`**
*Close-up of the three alert tier card variants: Critical Action (red border, countdown timer), Review Needed (amber border), FYI (gray, collapsible).*
Caption: "Alert tier hierarchy. Critical items demand action; FYI items collapse to reduce cognitive load."

### Platform-Specific Considerations

Keep the existing 3-card grid (Desktop / Tablet / Mobile). No changes.

---

## Section 12: Reflections (Outcomes + Reflection + Summary)

### Changes from Current

- Add TL;DR to Outcomes section
- Keep Wins/Misses grid (strong)
- Keep post-pilot quotes (strong)
- Replace the closing quote with `CaseStudySummary` component
- Keep Next Steps

### Outcomes TL;DR

```
<SectionTLDR>
  Trust through transparency worked — 11% override rate proved users felt safe
  disagreeing with AI. Modular rollout built credibility incrementally. But early
  prototypes over-automated (67% rejection), mobile alert density remained too
  high, and 15% of admins still exported to Excel.
</SectionTLDR>
```

### Wins / Misses Grid

Keep exactly as-is. No changes.

### Post-Pilot Feedback Quotes

Keep exactly as-is. No changes.

### Reflection Cards

Keep exactly as-is. The 4 reflection cards are strong.

### Closing: CaseStudySummary (replaces closing quote)

Use the `CaseStudySummary` shared component:

```tsx
<CaseStudySummary
  projectName="Symplify"
  metrics={[
    { value: "40%", label: "Faster Triage", icon: "trending" },
    { value: "89%", label: "Triage Accuracy", icon: "award" },
    { value: "~$78K", label: "Annual Savings", icon: "zap" },
    { value: "65", label: "Pilot Staff", icon: "users" },
  ]}
  keyTakeaways={[
    "Trust is a design constraint, not a feature — every AI pattern is really a trust pattern",
    "Compliance constraints (HIPAA audit trails) can improve UX when embraced rather than resisted",
    "Augmentation > Automation for clinical professionals who need to maintain professional judgment",
    "Honest metrics with caveats build more credibility than polished presentations without context",
  ]}
  nextSteps={[
    "Predictive staffing models to cut overtime 15-20%",
    "Broader EHR integration via HL7 FHIR connectors",
    "Patient sentiment analysis with real-time NLP",
    "Dedicated mobile-first redesign beyond responsive",
  ]}
/>
```

### Next Steps Cards

Keep the 4-card grid as a supplement below the summary. No changes.

---

## Visual Asset Manifest

### Required Screenshots from Live Platform (symplify-v4-live.vercel.app)

| # | Asset ID | Description | Source | Priority |
|---|---|---|---|---|
| 1 | `hero-dashboard-desktop-full.png` | Full desktop dashboard, annotated | Live platform | P0 |
| 2 | `triage-inbox-production.png` | Production inbox with confidence badges | Live platform | P0 |
| 3 | `ai-reasoning-panel-expanded.png` | Expanded AI reasoning on high-priority item | Live platform | P0 |
| 4 | `scheduling-conflict-modal-production.png` | Conflict detection modal | Live platform | P0 |
| 5 | `alerts-after-tiered.png` | Risk-tiered alert system | Live platform | P0 |
| 6 | `product-doctor-dashboard-annotated.png` | Doctor dashboard with 4 callouts | Live platform + Figma annotation | P0 |
| 7 | `product-nurse-handoff-annotated.png` | Nurse shift handoff view with callouts | Live platform + Figma annotation | P0 |
| 8 | `product-admin-compliance-annotated.png` | Admin compliance dashboard with callouts | Live platform + Figma annotation | P1 |
| 9 | `product-mobile-triage-annotated.png` | Mobile critical-only triage view | Live platform (responsive) | P1 |

### Required Design Process Artifacts

| # | Asset ID | Description | Source | Priority |
|---|---|---|---|---|
| 10 | `affinity-wall-photo.jpg` | Affinity map from contextual inquiry | Photo or FigJam recreation | P0 |
| 11 | `journey-map-whiteboard.jpg` | Raw journey mapping session | Photo or Miro/FigJam screenshot | P1 |
| 12 | `contextual-inquiry-photo.jpg` | Research observation session (anonymized) | Photo (blurred faces) | P1 |
| 13 | `task-logging-dashboard.png` | Task logging tool/spreadsheet | Screenshot | P2 |
| 14 | `interview-synthesis-wall.jpg` | Interview coding/synthesis process | Photo or tool screenshot | P2 |

### Required Wireframe Progression Assets

| # | Asset ID | Description | Source | Priority |
|---|---|---|---|---|
| 15 | `triage-inbox-sketch.jpg` | Low-fi sketch of triage inbox concept | Scan/photo or recreate | P0 |
| 16 | `triage-inbox-wireframe-v1.png` | Mid-fi wireframe with percentage scores | Figma export or recreate | P0 |
| 17 | `triage-inbox-wireframe-v2.png` | Mid-fi wireframe with 3-tier badges | Figma export or recreate | P0 |
| 18 | `scheduling-sketch-autobook.jpg` | Sketch of auto-booking concept | Scan/photo or recreate | P1 |
| 19 | `scheduling-wireframe-suggestion.png` | Wireframe of suggestion-based scheduling | Figma export or recreate | P1 |
| 20 | `scheduling-conflict-production.png` | Production conflict modal (full context) | Live platform | P0 |

### Required Design System Assets

| # | Asset ID | Description | Source | Priority |
|---|---|---|---|---|
| 21 | `design-system-specimen.png` | Full DS overview (colors, type, components) | Figma export | P1 |
| 22 | `ds-confidence-badges.png` | Badge variants including colorblind-safe | Figma export | P2 |
| 23 | `ds-alert-tier-cards.png` | Alert tier card variants | Figma export | P2 |
| 24 | `alerts-before-flat-list.png` | Old flat alert list (for before/after) | Recreate in Figma | P1 |

**Total: 24 visual assets** (9 P0, 8 P1, 7 P2)

---

## Shared Component Integration Checklist

| Component | Where Used | Status |
|---|---|---|
| `CaseStudyStructuredData` | Page-level (replaces manual DOM manipulation) | To implement |
| `SectionTLDR` | Every major section (8 instances) | To implement |
| `BeforeAfterComparison` | Decision 04: Alert Fatigue | To implement |
| `DesignEvolutionShowcase` | New Design Evolution section (2 features) | To implement |
| `CaseStudySummary` | Reflections section (replaces closing quote) | To implement |
| `InteractiveImage` | Product Showcase screenshots (4 instances) | To implement |
| `QuickWinsStrip` | Could replace animated metric cards | Consider |
| `ProblemEvidenceContainer` | Problem section (research artifact photos) | To implement |
| `ReadingProgress` | Page-level (top progress bar) | Stub — needs implementation |
| `CaseStudyFooterNav` | Page bottom (prev/next case study) | Stub — needs implementation |

**Note:** `ReadingProgress`, `SectionNav`, `CaseStudyFooterNav`, `DesignSystemSection`, `ExplorationSection`, and `MyRoleSection` are currently stub components (return `null`). These need implementation before integration. The rewrite spec above accounts for this — they can be implemented as part of this work or left for a follow-up pass.

---

## Color Token Extraction

Replace all hardcoded hex values with semantic Tailwind tokens. Add to `tailwind.config.ts`:

```js
theme: {
  extend: {
    colors: {
      sym: {
        // Primary palette
        blue: '#3B82F6',
        green: '#10B981',
        purple: '#8B5CF6',
        amber: '#F59E0B',
        red: '#EF4444',
        pink: '#EC4899',
        indigo: '#6366F1',

        // Text
        heading: '#0F172A',
        body: '#334155',       // Upgraded from #475569 per audit
        muted: '#64748B',
        label: '#94A3B8',

        // Surfaces
        card: '#FFFFFF',
        'card-border': '#E2E8F0',
        'card-border-hover': '#CBD5E1',
        divider: '#F1F5F9',
        'bg-primary': '#F8FAFC',
        'bg-blue': '#EFF6FF',
        'bg-green': '#F0FDF4',
        'bg-amber': '#FFFBEB',
        'bg-purple': '#F5F3FF',
        'bg-red': '#FEF2F2',
      }
    }
  }
}
```

Usage: Replace `text-[#475569]` → `text-sym-body`, `border-[#E2E8F0]` → `border-sym-card-border`, etc.

---

## Estimated Implementation Timeline

| Phase | Tasks | Hours |
|---|---|---|
| **Phase 1: Asset Creation** | Capture 9 P0 screenshots from live platform, create wireframe recreations, add Figma annotations | 3–4 hrs |
| **Phase 2: Component Integration** | Wire up CaseStudyStructuredData, SectionTLDR (×8), BeforeAfterComparison, DesignEvolutionShowcase, CaseStudySummary, InteractiveImage, ProblemEvidenceContainer | 3–4 hrs |
| **Phase 3: Content Restructuring** | Rewrite HeroSection (metric in subtitle), restructure ImpactMetrics (unified table), build ProductShowcase section, build DesignEvolution section, make nav sticky | 3–4 hrs |
| **Phase 4: Polish** | Color token extraction, OG meta tags, accessibility fixes (aria-labels on images, table captions, contrast check), mobile nav fade indicators | 2–3 hrs |
| **Total** | | **11–15 hrs** |

**Recommended approach:** Phase 1 first (assets unblock everything else), then Phase 2 + 3 in parallel, Phase 4 last.
