# Design Critique: Symplify Clinical Notification Dashboard

**Design stage:** Final polish
**Viewport:** 1440px desktop
**Context:** Healthcare / clinical alert management system for hospital staff

---

## Overall Impression

This is a well-structured clinical notification center with clear severity tiering and a sensible grouping model (Emergency → Urgent → Routine). The priority color system (red/orange left borders + badges) communicates urgency effectively. **The biggest opportunity** is tightening the action affordances — the icon-only buttons at the card level are ambiguous in a high-stakes clinical context where misclicks carry real consequences.

---

## Usability

| Finding | Severity | Recommendation |
|---------|----------|----------------|
| **Icon-only action buttons lack labels.** The red "send" and blue "checkmark" buttons on each alert card have no text labels or tooltips visible in the design. In a cardiac arrest scenario (CODE BLUE), staff need zero ambiguity about what "acknowledge" vs "escalate" vs "dismiss" means. | 🔴 Critical | Add short text labels beneath or beside each icon button (e.g., "Escalate," "Acknowledge"). At minimum, design a tooltip state. For the most critical alerts, consider a confirmation step before acknowledgment. |
| **Inconsistent action sets across severity levels.** Critical alerts show a red button + blue checkmark. The HIGH-severity Drug Interaction alert shows an eye icon + X icon. There's no visible pattern for which actions appear when. | 🔴 Critical | Standardize the action model: define which actions map to which severity tier and document it. Users should be able to predict what buttons they'll see. |
| **No visible "selected" or "expanded" card state.** All cards appear in the same resting state. If a clinician clicks a card, it's unclear what the interaction model is — does it expand in-place, open a detail panel, or navigate away? | 🟡 Moderate | Design and include the expanded/detail state. For a notification center, an in-line expansion or a right-side detail panel would preserve context while showing full information. |
| **Filter pills at the top lack labels.** The icon + number chips (bell 8, alert 3, warning 1, envelope 5) rely solely on icon recognition. New users or fatigued staff may not immediately parse the difference between the bell and alert icons at 18px. | 🟡 Moderate | Add short text labels ("All," "Critical," "High," "Messages") next to or below the icons, or use a segmented control pattern with text. |
| **"3 unread" badge competes with the teal checkmark button.** In the section headers, the blue "3 unread" pill and teal icon-button are close together and similar in size, creating visual competition for two different functions. | 🟡 Moderate | Increase visual separation — either move the unread count to the left near the section title, or differentiate the action button's shape/style more clearly from the informational badge. |
| **Search bar is narrow (190px) for a primary navigation element.** At 1440px viewport, the search input feels undersized and may truncate query terms, especially when searching patient names or alert content. | 🟢 Minor | Expand to at least 280–320px, or allow the input to expand on focus. |

---

## Visual Hierarchy

- **What draws the eye first:** The "CODE BLUE - Room 412" card title with its bold weight and the red CRITICAL badge. This is correct — the most urgent item should dominate attention.
- **Reading flow:** Header → filter pills → Clinical Emergency section (most urgent) → cards descend by severity. The top-down priority ordering works well for scan-and-triage workflows.
- **Emphasis concern:** The section headers ("Clinical Emergency," "Clinical Urgent") are styled in `#595F6E` semi-bold at 14px — they're visually quieter than the card titles at 16px semi-bold in `#0A1B39`. This is good for keeping focus on the cards themselves, but the sections could benefit from slightly more weight to create clearer landmarks when scrolling a long list.
- **Collapsed sections (System, Admin Routine)** read as secondary, which is appropriate — but they have no visual count indicator, so it's unclear whether they contain 0 alerts or simply aren't showing them. Add an item count even when collapsed.

---

## Consistency

| Element | Issue | Recommendation |
|---------|-------|----------------|
| **Left border thickness** | Critical cards use a 4px left border in red. The HIGH card uses 4px in orange. Good — this is consistent. | No change needed. ✓ |
| **Card background** | All alert cards use `rgba(99,102,241,0.03)` — a very faint indigo tint. This is the same regardless of severity. | Consider subtly varying the background tint to match severity (faint red wash for critical, faint amber for high) to reinforce the left-border color coding. |
| **Action button sizing** | All action buttons are 44×44px (good for touch), but their border radius (10px) differs from the section header's expand/collapse chevron area. | Unify interactive element border radii to a single token (e.g., `radius-action: 10px`). |
| **Typography scale** | Card titles: 16px/600. Card body: 13px/400. Metadata: 12.3px/400. Section headers: 14px/600. Filter pills: 16px/700. The scale is mostly coherent but the 12.3px value is an unusual fractional size. | Round to 12px for cleaner rendering and token alignment. |
| **Timestamp format** | "2m ago," "5m ago," "45m ago" — relative timestamps are good for recency. But they'll become meaningless at longer durations ("3d ago"). | Define a threshold (e.g., >24h switches to absolute date/time). In clinical contexts, exact timestamps matter for charting and liability. |

---

## Accessibility

- **Color contrast — card body text:** `#595F6E` on the `rgba(99,102,241,0.03)` background (effectively near-white) yields approximately **5.2:1** contrast. Passes WCAG AA for normal text. ✓
- **Color contrast — metadata text:** `#595F6E` at 12.3px is borderline. At that size, WCAG AA requires 4.5:1 — it passes, but barely. Consider bumping to `#4A4F5C` for more breathing room.
- **Color contrast — filter pill numbers:** The red `#DC2626` number on the faint red background (`rgba(220,38,38,0.05)`) should be verified — it likely passes, but the orange `#F97316` on `rgba(249,115,22,0.05)` is worth double-checking at 16px bold.
- **Color-only severity coding:** Severity is communicated through color (red border + red badge vs. orange border + orange badge). Users with color vision deficiency may struggle to differentiate these. Add a secondary differentiator — the text labels "CRITICAL" and "HIGH" help, but consider also varying the badge icon or shape.
- **Touch targets:** Action buttons at 44×44px meet the 44px minimum. ✓
- **Keyboard navigation:** Not visible in the static comp — ensure tab order flows logically from filter pills → section headers → individual cards → card actions. The section collapse/expand should be keyboard-operable.
- **Screen reader concerns:** The icon-only buttons need `aria-label` attributes. The Tabler Icons font characters will read as gibberish to assistive technology without proper labeling.

---

## What Works Well

- **Severity tiering is immediately scannable.** The combination of left-border color, badge color, and badge text ("CRITICAL" / "HIGH") creates a strong visual signal that doesn't require deep reading.
- **Information density is well-balanced.** Each card shows title, description, source, and timestamp without feeling cramped — important for a dashboard that clinicians will glance at during fast-paced shifts.
- **Collapsible sections** keep lower-priority categories out of the way while remaining discoverable. The "unread" badges on sections provide a reason to expand.
- **Dark header with gradient** clearly separates navigation from content and gives the app a professional, clinical feel appropriate for the healthcare context.
- **The "AI Assistance" button** is well-placed and visually distinct (gradient fill) without competing with the alert content below.

---

## Priority Recommendations

### 1. Label the action buttons — this is patient-safety-critical
Add visible text labels or, at minimum, design a tooltip/hover state for every action button. In healthcare UIs, ambiguity in actions can lead to missed escalations or accidental dismissals. Consider a brief confirmation modal for "acknowledge" on CRITICAL-severity alerts. This is the single highest-impact change before shipping.

### 2. Standardize and document the action model per severity tier
Define a clear, predictable mapping: which actions appear on which severity level, and why. Currently, CRITICAL cards have "escalate + acknowledge," while HIGH has "view + dismiss" — but this isn't communicated anywhere. Create a pattern spec that developers can implement consistently and that new users can learn quickly.

### 3. Add counts to collapsed sections and ensure empty states exist
Collapsed sections (System, Admin Routine) give no indication of their content volume. Add a count badge (even "0") so users can make informed decisions about whether to expand. Also design an empty state for sections with no current alerts — a simple "No alerts" message reinforces that the system is working, rather than leaving users wondering if something failed to load.

---

*Critique prepared for final-polish stage. These findings focus on production readiness, edge cases, and clinical safety considerations specific to healthcare notification UIs.*
