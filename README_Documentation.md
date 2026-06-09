# Symplify Health

An AI-enhanced hospital and clinic management platform — a multi-role administrative system for clinical and operational staff, with clinical-decision-support surfaces layered onto a conventional healthcare admin dashboard.

## Overview

Healthcare administration spans many roles and high-stakes workflows: triage, scheduling, handoffs, medication safety, documentation, and back-office operations across patients, providers, and facilities. Most admin tools treat these as disconnected screens; clinical judgment and operational data rarely share an interface.

Symplify Health is the front-end of a platform that consolidates these surfaces and threads an AI layer through them. Beyond standard dashboards for patients, doctors, and super-admins — plus clinic, HRM, finance, content, and support modules — it embeds clinical-support components: smart triage scoring, predictive clinical alerts, an assistant popup, SBAR-structured shift handoff, drug-interaction checking, and voice documentation.

The target users are clinical and operational staff working in role-specific contexts — a triage nurse, an attending physician, and a facility administrator need different defaults from the same system. The design thesis follows from that: a shared design-token foundation (including healthcare-specific severity tokens) keeps the surface coherent, while role-aware layouts and an injectable AI service boundary let the same components serve different roles and back ends. The AI currently runs on a bundled mock engine behind a swappable `AIService` interface — the seam is real even though live inference is not yet wired. [ASSUMED: target-user framing inferred from role-based routes and the `UserRole` type `'admin' | 'doctor' | 'nurse' | 'triage'`]

## Key Features

Grouped by user-facing capability.

- **Role-based dashboards** — distinct dashboard surfaces for patients, doctors, and super-admins. *Why it matters:* each role lands on a view scoped to its decisions instead of a generic catch-all.
- **Smart triage & patient acuity** — priority scoring (5-level), acuity widgets, and a patient-acuity dashboard. *Why it matters:* surfaces which patients need attention first, with confidence and contributing factors shown rather than hidden.
- **Predictive clinical alerts** — a clinical alert prediction surface and dashboard widget. *Why it matters:* moves alerting from reactive to anticipatory at the point of work.
- **AI assistant** — an embeddable popup/widget with quick actions, a confidence indicator, voice input toggle, and a HIPAA badge. *Why it matters:* contextual help without leaving the current screen; the confidence and compliance cues set expectations about what the assistant can be trusted to do.
- **Shift handoff (SBAR)** — handoff summaries, an SBAR generator, per-patient handoff cards, and a timeline. *Why it matters:* structures the highest-risk moment in care continuity into a consistent, reviewable format.
- **Drug-interaction checker** — interaction alerts, a medication review panel, and severity badges. *Why it matters:* medication-safety checks rendered with explicit severity rather than undifferentiated warnings.
- **Voice documentation** — recorder, transcription editor, note formatter, and medical-terms highlighter. *Why it matters:* reduces documentation burden while keeping clinicians in control of the final note.
- **AI-augmented communication** — priority-aware notifications, email categorization, message-urgency analysis, and a chat inbox widget. *Why it matters:* triages the communication load the same way the clinical surface triages patients.
- **Operational admin suite** — clinic, HRM (staff, attendance, leaves, payroll), finance (invoices, payments, transactions, reports), content, and support modules. *Why it matters:* the operational backbone a facility needs alongside the clinical surface.
- **Internationalization & layout modes** — i18next-driven localization, RTL, dark mode, and multiple layout densities. *Why it matters:* adapts to facility, locale, and operator preference without forking the UI.

## Design Specifications

Foundations are defined as CSS custom properties in `src/style/scss/_variables.scss` and consumed across the SCSS layer. Naming conventions below are the project's actual token names.

**Color.** Brand tokens `--primary` (`#2E37A4`) and `--secondary` (`#00D3C7`); semantic tokens for success (`#27AE60`), info (`#2F80ED`), danger (`#EF1E1E`), and warning (`#C9A227`); a nine-step gray ramp (`--gray-100` → `--gray-900`) and nine-step light ramp; each color carries `-hover`, `-transparent`, and `-rgb` companions.

**Clinical tokens.** A dedicated healthcare severity set — `--clinical-critical`, `--clinical-urgent`, `--clinical-caution`, `--clinical-stable`, `--clinical-info` — each paired with `-bg` and `-border` values. This is the design-system decision that most distinguishes the product: clinical severity is a first-class token family, not an ad-hoc reuse of danger/warning.

**Spacing.** A 4px-grid scale: `--space-1` (4px) through `--space-16` (64px), with semantic aliases (`--space-card-inset`, `--space-card-header`, `--space-modal-body`, `--space-table-cell`).

**Type scale.** `--text-xs` (0.6875rem) → `--text-2xl` (1.5rem); base body size `0.875rem`.

**Radius & elevation.** Radius tokens `--radius-sm/md/lg/xl` with component aliases (`--radius-card`, `--radius-modal`); a three-tier shadow system `--shadow-subtle`, `--shadow-medium`, `--shadow-elevated`.

**Interaction & accessibility posture.** Touch-target tokens are explicit — `--touch-target-desktop: 32px`, `--touch-target-mobile: 44px` — and the active target switches to 44px at mobile and tablet breakpoints, matching common minimum touch-target guidance. Responsive tokens recalibrate page/card spacing and chart heights at mobile (≤767.98px), iPad Pro 11" portrait (768–834px), and tablet-landscape (835–1210px) ranges. [VERIFY: contrast ratios and screen-reader behavior were not audited from source; only token-level intent is confirmed]

**Compliance posture.** The assistant ships a `HIPAABadge` component and the route set includes a compliance dashboard and a GDPR/cookies settings surface, signaling intent to operate under healthcare/privacy compliance. This reflects design intent expressed in the UI, not a certification or audited control. [VERIFY: no compliance attestation exists in the repo]

**Component layer.** Built on Ant Design 5, React-Bootstrap 5, and PrimeReact 10, with SCSS partials organized under `components/`, `pages/`, `plugins/`, and `structure/` (including a dedicated `components/ai/` group).

## Product Specifications

**Surfaces / platforms.** Responsive web SPA. Layout modes: default, mini, hover-expand, hidden, full-width, dark, and RTL. Breakpoint-aware tokens explicitly target phone, iPad Pro 11" (both orientations), and tablet-landscape.

**Primary user flows.** Authentication (login/register/forgot/reset/2FA/lock-screen, in cover/illustration/basic variants) → role dashboard → role-specific work: patient management, doctor scheduling and consultations, appointment booking/calendar, AI triage/alerts/handoff, communication (chat/email/calls/notifications), and operational admin (HRM, finance, content, support, settings).

**Key states.** Auth variants and error states (`error-404`, `error-500`), plus utility pages (coming-soon, under-maintenance, under-construction). Clinical components express state through severity tokens and confidence indicators. [SCREENSHOT NEEDED: empty, loading, and error states for AI surfaces]

**Scope boundaries.** This repository is the front end only. AI inference is served by a bundled mock engine (`src/core/ai/mockApi.ts`) behind the `AIService` interface — no live clinical model is included. There is no test suite, and no environment-driven backend integration is active (`.env` is empty). These are intentional boundaries of the current artifact, not gaps to hide. [VERIFY: whether a production backend/model is planned]

## Design Decisions & Rationale

1. **Clinical severity as a first-class token family.** *Constraint:* clinical urgency is semantically distinct from generic UI danger/warning and must read consistently across triage, alerts, and medication surfaces. *Decision:* a dedicated `--clinical-*` token set (critical/urgent/caution/stable/info) with matched bg/border, separate from the brand semantic palette. *Result:* severity is centrally tunable and visually coherent wherever it appears.

2. **Pluggable AI service boundary.** *Constraint:* the assistant originally imported the mock engine directly, making it impossible to swap for a real service. *Decision:* an `AIService` interface with a default `mockAIService`, injected via an `aiService` prop. *Result:* components depend on an interface, not the mock; a real backend can replace it without component changes. (Rationale stated directly in `AIService.ts`.)

3. **Token-driven responsive density over per-component breakpoints.** *Constraint:* the same dense admin surface must work on desktop, tablet, and phone. *Decision:* recalibrate spacing, touch targets, and chart heights through `:root` token overrides at each breakpoint rather than scattering media queries through components. *Result:* one place governs density; touch targets correctly grow to 44px on touch devices.

4. **Confidence and compliance made visible in the assistant.** *Constraint:* AI suggestions in a clinical setting must not be mistaken for authoritative output. *Decision:* ship a `ConfidenceIndicator` and `HIPAABadge` as standing parts of the assistant UI. *Result:* the interface continually signals trust boundaries to the user.

5. **Tradeoff — broad library surface vs. bundle discipline.** The app composes three overlapping UI ecosystems (Ant Design, React-Bootstrap/Bootstrap, PrimeReact) plus jQuery, Moment, and multiple charting and input libraries. *Honest limitation:* this accelerates building a large screen catalog but carries real cost in bundle size and styling-consistency risk across systems. A committed `feature-module.zip` (~1.2 MB) in the source tree is a related housekeeping smell. [VERIFY: intent of the archive]

## Screens / Visual Reference

- [SCREENSHOT NEEDED: Patient dashboard]
- [SCREENSHOT NEEDED: Doctor dashboard]
- [SCREENSHOT NEEDED: Super-admin dashboard]
- [SCREENSHOT NEEDED: Smart triage / patient-acuity dashboard]
- [SCREENSHOT NEEDED: Predictive clinical alerts]
- [SCREENSHOT NEEDED: AI assistant popup (with confidence indicator + HIPAA badge)]
- [SCREENSHOT NEEDED: Shift handoff / SBAR generator]
- [SCREENSHOT NEEDED: Drug-interaction checker with severity badges]
- [SCREENSHOT NEEDED: Voice documentation editor]
- [SCREENSHOT NEEDED: Dark mode and RTL layout variants]

> Reference HTML mockups exist in-repo under `documentation/new pages/` (`patient-acuity-dashboard.html`, `predictive-clinical-alerts.html`, `smart-insights-cards.html`) and `src/feature-module/ai/aiassistantpopupmockup.html`, but are not substitutes for live-product screenshots.

## Outcomes / Impact

No verified product outcomes are available from the repository. A case-study *rewrite spec* in `documentation/rewrites/` cites figures (e.g., reduced triage time, accuracy, multi-facility/staff counts), but these appear as draft narrative targets inside a planning document rather than measured, reproducible results — so they are not reproduced here as outcomes. See the Gap Log. *(Section intentionally reports no metrics rather than restating unverified ones.)*

## Links

- **Repository:** https://github.com/ssmith129/Symplify-1.7.4
- **Live demo:** [DATA NEEDED] — `vercel.json` indicates a Vercel deployment, but no canonical demo URL is verified in the repo. A case-study spec references `smithdesign.live`, unconfirmed as a live Symplify demo. [VERIFY]
- **Related artifacts:** `documentation/` (design-system audit, design critiques, case-study audit, implementation/Builder.io guides).

---

## Appendix — Gap Log

| Flag | Item | What's missing / where it slots in |
| --- | --- | --- |
| [ASSUMED] | Target-user framing | Inferred from role-based routes and `UserRole` = `'admin' \| 'doctor' \| 'nurse' \| 'triage'`. Overview / Key Features. |
| [VERIFY] | Accessibility specifics | Token-level intent (touch targets) confirmed; contrast ratios and screen-reader behavior not audited. Design Specifications. |
| [VERIFY] | Compliance posture | `HIPAABadge`, compliance dashboard, and GDPR settings show intent only — no attestation. Design Specifications. |
| [VERIFY] | Production AI backend | AI runs on a bundled mock; whether a real model/backend is planned is unconfirmed. Overview / Product Specifications. |
| [VERIFY] | `feature-module.zip` | ~1.2 MB archive committed in `src/feature-module/`; purpose unclear. Design Decisions (tradeoff). |
| [SCREENSHOT NEEDED] | All key screens + AI states | Live-product captures absent; only HTML mockups exist in-repo. Screens / Visual Reference. |
| [DATA NEEDED] | Live demo URL | No verified canonical demo link. Links. |
| [DATA NEEDED] | Outcomes / metrics | No verified results; rewrite-spec figures treated as draft, not reproduced. Outcomes / Impact. |
| [VERIFY] | `smithdesign.live` reference | Cited in a case-study spec; unconfirmed as a live Symplify demo. Links. |

## Appendix — Fabrication Ledger

No `[FABRICATED-PLAUSIBLE]` content was introduced. Every claim traces to a repository source or carries a flag; no externally verifiable specifics (people, dates, metric values, version numbers, URLs, license terms) were invented.
