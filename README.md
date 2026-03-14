<p align="center">
  <img src="logo.svg" alt="Symplify Logo" width="200"/>
</p>

<h1 align="center">Symplify — AI-Enhanced Healthcare Operations Platform</h1>

<p align="center">
  <strong>Intelligent clinical workflows, predictive insights, and streamlined hospital management.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.7.4-blue.svg" alt="Version 1.7.4"/>
  <img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Build Status"/>
  <img src="https://img.shields.io/badge/license-proprietary-lightgrey.svg" alt="License"/>
  <img src="https://img.shields.io/badge/react-19.2-61dafb.svg?logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/typescript-5.9-3178c6.svg?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/vite-6.3-646cff.svg?logo=vite" alt="Vite"/>
  <img src="https://img.shields.io/badge/HIPAA-compliant-green.svg" alt="HIPAA Compliant"/>
  <img src="https://img.shields.io/badge/WCAG_2.1-AA-blue.svg" alt="WCAG 2.1 AA"/>
</p>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [AI-Enhanced Features](#ai-enhanced-features)
- [Platform Architecture](#platform-architecture)
- [Page Documentation](#page-documentation)
- [Styling & Design System](#styling--design-system)
- [Installation & Setup](#installation--setup)
- [Usage Guidelines](#usage-guidelines)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing Guidelines](#contributing-guidelines)
- [Troubleshooting](#troubleshooting)
- [Support & Contact](#support--contact)

---

## Project Overview

**Symplify** is a modern, AI-enhanced healthcare operations platform built for hospitals, clinics, and multi-provider healthcare organizations. It unifies clinical workflows, administrative operations, and financial management into a single, intelligent system.

The platform serves three primary user roles — **administrators**, **doctors**, and **nurses** — with personalized dashboards, role-based access control, and AI-powered decision support that adapts to each user's clinical context.

### Core Mission

Symplify addresses three critical challenges in healthcare operations:

1. **Clinical Decision Fatigue** — AI triage assessment, drug interaction checking, and predictive clinical alerts reduce cognitive load and surface actionable insights at the point of care.
2. **Communication Gaps** — SBAR-structured shift handoffs, smart message routing, and urgency-aware notifications ensure critical information reaches the right clinician at the right time.
3. **Operational Inefficiency** — Intelligent appointment scheduling, automated compliance monitoring, and personalized dashboards eliminate manual overhead and minimize administrative burden.

### Target Audience

| Role | Primary Use Cases |
|------|------------------|
| **Hospital Administrators** | Staff management, compliance dashboards, financial reporting, resource allocation |
| **Physicians** | Patient queues, prescription management, lab results, appointment scheduling |
| **Nurses** | Shift handoffs, medication schedules, triage assessment, bed availability |
| **Clinical Staff** | Patient records, appointment booking, messaging, document management |

### Live Demo

The platform is deployed and accessible at: **[symplify-v4.netlify.app](https://symplify-v4.netlify.app/)**

### Repository

Source code is hosted at: **[github.com/ssmith129/Symplify-1.7.4](https://github.com/ssmith129/Symplify-1.7.4.git)**

---

## Key Features

### Clinical Management

- **Patient Records** — Comprehensive patient profiles with medical history, vitals tracking, prescriptions, invoices, and appointment history. Supports grid and list views with advanced filtering.
- **Appointment System** — Full appointment lifecycle management including new bookings, calendar views, consultation tracking, and cancellation workflows.
- **Doctor Management** — Provider profiles, scheduling, leave management, online consultations, and performance reviews.
- **Prescription Management** — Create, manage, and track prescriptions with detailed medication records for both doctor and patient portals.

### Administrative Operations

- **HRM Module** — Staff management, department organization, designations, attendance tracking, leave management, holiday calendars, and payroll processing.
- **Finance & Accounts** — Expense tracking and categorization, income management, invoice generation and editing, payment processing, and transaction logs.
- **Compliance Dashboard** — Regulatory compliance scoring across HIPAA documentation, patient consent, medication reconciliation, discharge summaries, and infection control.
- **Reporting Suite** — Income reports, expense reports, profit & loss statements, appointment analytics, and patient reports.

### Communication & Collaboration

- **Messaging System** — Internal messaging with AI-powered urgency detection and smart routing to appropriate recipients.
- **Email Management** — Full email client with AI priority detection and smart categorization across clinical, administrative, and general communications.
- **Notifications** — AI-enhanced notification system with intelligent prioritization and contextual grouping.
- **Video & Voice Calls** — Integrated telehealth capabilities with call history tracking.

### Content & Settings

- **Content Management** — Pages, blog posts, categories, tags, comments, testimonials, and FAQ management.
- **Settings Suite** — Organization settings, localization, email/SMS templates, payment methods, tax rates, security configurations, and system backup management.
- **Role-Based Permissions** — Granular roles and permissions management with administrator-level access control.

---

## AI-Enhanced Features

Symplify integrates **14 AI-powered capabilities** across clinical, operational, and communication workflows. Each feature includes a confidence scoring system, HIPAA-compliance indicators, and graceful degradation when AI services are unavailable.

### Feature 1: Smart Triage Priority Assessment

**Component:** `TriagePriorityBadge`

Analyzes patient symptoms, vital signs, and wait time to generate a 5-level triage priority score (ESI scale). The system cross-references critical symptom keywords (chest pain, difficulty breathing, severe bleeding), abnormal vital thresholds (HR >120, SpO2 <92%, temp >39.5°C), and wait-time escalation logic to produce a confidence-weighted acuity recommendation.

**Clinical Value:** Reduces triage assessment time and standardizes prioritization across shifts.

### Feature 2: AI Dashboard Personalization

**Component:** `AIDashboardWidgets`

Dynamically configures dashboard layouts based on user role (admin, doctor, nurse, triage), time of day, and interaction history. Widget suggestions adapt contextually — for example, the Shift Handoff widget surfaces automatically during shift change windows (6–8 AM).

**Sub-components:** `SmartWidget`, `PatientAcuityWidget`, `PatientQueueWidget`, `AIInsightsWidget`, `QuickStatsWidget`

### Feature 3: Intelligent Appointment Scheduler

**Component:** `SmartScheduler`

Evaluates provider availability, patient convenience, historical no-show risk, and wait-time optimization to rank appointment slot suggestions. Each slot includes a composite score and breakdown across four factors, helping staff make informed scheduling decisions.

### Feature 4: Clinical Alert Prediction System

**Component:** `ClinicalAlertWidget`

Monitors patient data streams and generates predictive alerts for clinical events including sepsis risk elevation, cardiac arrhythmia, respiratory distress, blood glucose instability, fall risk, and medication interactions. Alerts include risk severity classification (critical/high/moderate/low), confidence scores, contributing factors, and recommended clinical actions.

**Technical Note:** Operates via a mock WebSocket connection with 30-second polling intervals for real-time alert updates.

### Feature 5: Smart Message Router

**Component:** `SmartMessageRouter`

Analyzes outgoing message content to detect urgency level (critical/high/normal/low), classify category (Clinical/Administrative/General), suggest optimal recipients based on role relevance, and generate context-appropriate response templates. The system uses keyword extraction across clinical, administrative, and urgency vocabularies with sentiment analysis.

### Feature 6: Intelligent Calendar Scheduling

**Component:** `IntelligentCalendar`

Extends the appointment scheduler into a full calendar view with day-level slot analysis. Each calendar day includes aggregate insights: total available slots, optimal appointment windows, average no-show risk, and identified busy periods. Slot statuses are categorized as Recommended, Available, or Limited based on match scores and risk thresholds.

### Feature 7: AI Assistant Chatbot

**Component:** `AIAssistantPopup`

A context-aware conversational assistant that bridges all AI features into a unified chat interface. The assistant detects 15+ clinical and operational intents (drug interactions, triage, scheduling, navigation, bed status, compliance, shift handoff, and more) and returns structured response cards with inline actions. Supports role-specific quick actions, HIPAA badges, confidence indicators, and expandable detail panels.

**Sub-components:** `ChatMessageCard`, `ConfidenceIndicator`, `ExpandedPanel`, `HIPAABadge`, `QuickActionsBar`, `VoiceInputToggle`

### Feature 8: AI-Powered Shift Handoff

**Components:** `ShiftHandoffSummary`, `SBARGenerator`, `PatientHandoffCard`, `HandoffTimeline`, `ShiftHandoffWidget`

Generates structured shift handoff reports using the SBAR (Situation, Background, Assessment, Recommendation) communication framework. Includes patient handoff cards with current status, a timeline of key events during the shift, and a summary dashboard. Designed to reduce information loss during nursing shift transitions.

**Dedicated Page:** `/ai/shift-handoff`

### Feature 9: Voice Documentation Assistant

**Components:** `VoiceRecorder`, `TranscriptionEditor`, `NoteFormatter`, `MedicalTermsHighlighter`

Provides voice-to-text clinical documentation with medical terminology recognition and highlighting. Clinicians can dictate notes, review and edit transcriptions, and format them into structured clinical documentation.

### Feature 10: Drug Interaction Checker

**Components:** `DrugInteractionChecker`, `InteractionAlert`, `MedicationReviewPanel`, `SeverityBadge`, `DrugInteractionCheckerWidget`

Checks medication combinations for potential interactions with severity grading (critical/major/moderate/minor), interaction descriptions, clinical recommendations, and confidence scoring. Supports both a dedicated full-page checker and a dashboard widget for quick lookups.

**Dedicated Page:** `/ai/drug-interaction`

### Feature 11: AI-Enhanced Notifications

**Components:** `NotificationDropdownAI`, `NotificationPageAI`

Replaces standard notifications with an AI-prioritized system that groups alerts by urgency, surfaces clinical notifications above administrative ones, and provides contextual action buttons.

### Feature 12: Email Priority Detection

**Components:** `EmailPriorityBadge`, `EmailSidebarAI`, `EmailInboxAI`

Scans incoming email content to assign priority levels and categorize messages across clinical, administrative, and general channels. The enhanced inbox surfaces urgent clinical communications above routine correspondence.

### Feature 13: Message Urgency Analyzer

**Component:** `MessageUrgencyIndicator`

Analyzes chat message content in real time to display urgency indicators and suggest quick responses. Integrates directly into the messaging interface.

### Feature 14: Chat Inbox Dashboard Widget

**Component:** `ChatInboxWidget`

A dashboard-level widget that provides an at-a-glance view of recent messages with AI-generated urgency indicators and conversation summaries.

---

## Platform Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19.2 | Component-based UI architecture |
| **Language** | TypeScript 5.9 | Type-safe development |
| **Build Tool** | Vite 6.3 | Fast development server and optimized builds |
| **State Management** | Redux Toolkit 2.11 | Global state with AI feature slices |
| **UI Framework** | Ant Design 5.29 + Bootstrap 5.3 | Component library and layout system |
| **Routing** | React Router 7.9 | Client-side navigation with role-based routing |
| **Charts** | ApexCharts + Chart.js | Data visualization across dashboards and reports |
| **Calendar** | FullCalendar 6.1 | Appointment scheduling and calendar views |
| **Maps** | Leaflet + React Leaflet | Location mapping for clinic/facility management |
| **Internationalization** | i18next | Multi-language support with browser detection |
| **Styling** | SCSS + Bootstrap | Modular stylesheet architecture |
| **Deployment** | Netlify | Static site hosting with SPA rewrites |

### Directory Structure

```
Symplify-1.7.4/
├── public/                          # Static assets (images, icons, fonts)
├── src/
│   ├── core/                        # Shared infrastructure
│   │   ├── ai/                      # AI type definitions, mock APIs, and service layer
│   │   │   ├── types.ts             # TypeScript interfaces for all AI features
│   │   │   ├── mockApi.ts           # Simulated AI backend services
│   │   │   ├── emailTypes.ts        # Email AI type definitions
│   │   │   └── notificationTypes.ts # Notification AI type definitions
│   │   ├── api/                     # API client and endpoint configuration
│   │   ├── common/                  # Shared utilities
│   │   ├── data/                    # Static data and configuration
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── json/                    # JSON data fixtures
│   │   └── redux/                   # Redux store, slices, and middleware
│   ├── feature-module/
│   │   ├── components/
│   │   │   ├── ai/                  # AI-enhanced components
│   │   │   │   ├── assistant/       # AI Chatbot components
│   │   │   │   ├── shift-handoff/   # SBAR and handoff components
│   │   │   │   ├── voice-documentation/ # Voice-to-text components
│   │   │   │   ├── drug-interaction/    # Drug checker components
│   │   │   │   └── *.tsx            # Standalone AI widgets
│   │   │   ├── auth/                # Authentication screens
│   │   │   └── pages/               # Page-level components
│   │   │       ├── ai-modules/      # Dedicated AI feature pages
│   │   │       ├── dashboard/       # Main, doctor, and patient dashboards
│   │   │       ├── patient-modules/ # Patient portal pages
│   │   │       ├── doctor-modules/  # Doctor portal pages
│   │   │       ├── clinic-modules/  # Clinical management pages
│   │   │       ├── hrm-modules/     # Human resource pages
│   │   │       ├── finance-accounts-module/ # Financial management
│   │   │       ├── administration-modules/  # Admin and compliance
│   │   │       ├── application-modules/     # Communication tools
│   │   │       ├── settings-modules/        # System configuration
│   │   │       ├── support-modules/         # Help desk and support
│   │   │       ├── content-modules/         # CMS pages
│   │   │       └── ui-modules/              # UI component showcase
│   │   └── routes/                  # Route definitions and router config
│   ├── style/
│   │   ├── scss/                    # SCSS source files
│   │   ├── css/                     # Compiled CSS
│   │   ├── fonts/                   # Typography assets
│   │   └── icon/                    # Icon libraries
│   ├── main.tsx                     # Application entry point
│   └── environment.tsx              # Environment configuration
├── ai enhancements/                 # AI feature documentation
├── dist/                            # Production build output
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
└── vercel.json                      # Deployment rewrite rules
```

### State Management Architecture

The application uses Redux Toolkit with dedicated slices for AI feature state:

```typescript
interface AIState {
  triage: {
    acuityScores: Record<string, AcuityScore>;
    loading: boolean;
    error: string | null;
  };
  dashboard: {
    personalizedLayout: PersonalizedLayout | null;
    interactions: DashboardInteraction[];
    loading: boolean;
  };
  scheduler: {
    suggestions: SlotSuggestion[];
    loading: boolean;
    selectedSlot: SlotSuggestion | null;
  };
  clinicalAlerts: ClinicalAlertState;
  messageRouter: {
    currentAnalysis: MessageAnalysis | null;
    analyzing: boolean;
  };
}
```

---

## Page Documentation

### Dashboards

#### Admin Dashboard (`/dashboard`)

The primary administrative dashboard provides a high-level overview of clinic operations. Displays appointment statistics, revenue charts, staff schedules, resource utilization, top-performing doctors, and recent financial transactions. AI personalization dynamically reorders widgets based on the administrator's interaction patterns and time-of-day context.

#### Doctor Dashboard (`/doctor/doctor-dashboard`)

Tailored for physician workflows. Surfaces the day's appointment queue, pending prescriptions, lab results awaiting review, schedule overview, and patient alerts. AI suggestions highlight urgent items (e.g., critical lab results) and contextually promote relevant quick actions.

#### Patient Dashboard (`/patient/patient-dashboard`)

The patient-facing portal provides access to upcoming appointments, active prescriptions, recent invoices, and care team information. Designed for clarity and ease of navigation with minimal medical jargon.

### Clinical Modules

#### Doctors Directory (`/doctors`, `/doctors-list`)

Searchable provider directory with grid and list views. Each doctor profile includes specialization, schedule availability, patient reviews, and contact information. Administrators can add, edit, and manage provider records.

#### Patient Management (`/patients`, `/patients-grid`, `/patient-details`)

Patient registry with comprehensive profiles including demographics, visit history, prescriptions, invoices, and clinical notes. Supports both grid and list views with filtering by status, provider, and date range.

#### Appointments (`/appointments`, `/new-appointment`, `/appointment-calendar`)

Full appointment lifecycle management. The calendar view integrates with the AI Intelligent Calendar for optimized slot suggestions. Supports appointment creation, rescheduling, consultation tracking, and cancellation with reason capture.

#### Locations & Services (`/locations`, `/services`, `/specializations`)

Facility and service management for multi-location healthcare organizations. Configure clinic locations, available services, medical specializations, and equipment assets.

### AI Feature Pages

#### Shift Handoff (`/ai/shift-handoff`)

A dedicated page for the AI-Powered Shift Handoff system. Nurses access the SBAR generator, patient handoff cards, shift timeline, and handoff summary. Designed to be used at the start and end of each nursing shift to ensure complete information transfer.

#### Drug Interaction Checker (`/ai/drug-interaction`)

A full-page drug interaction analysis tool. Users input medication combinations and receive severity-graded interaction reports with clinical recommendations and confidence scores.

### Communication Tools

#### Chat (`/application/chat`)

Real-time messaging interface with AI-powered urgency indicators, smart recipient suggestions, and quick response templates. Supports one-on-one and group conversations.

#### Email (`/application/email`, `/application/email-reply`)

Feature-rich email client with AI priority detection. The enhanced sidebar categorizes messages by clinical urgency, and the inbox view highlights high-priority items.

#### Calendar (`/application/calendar`)

Integrated calendar with FullCalendar providing day, week, and month views. Syncs with the AI scheduling system for intelligent slot recommendations.

#### Notifications (`/notifications`)

AI-enhanced notification center that groups and prioritizes alerts. Clinical notifications surface above administrative items, with contextual action buttons for immediate response.

### HRM Module

#### Staffing (`/staffs`, `/hrm-departments`, `/designation`)

Staff directory, department organization, and role designation management. Supports hiring workflows, role assignments, and organizational hierarchy visualization.

#### Attendance & Leave (`/attendance`, `/leaves`, `/leave-type`, `/holidays`)

Employee attendance tracking, leave request management with approval workflows, configurable leave types, and holiday calendar management.

#### Payroll (`/payroll`)

Payroll processing with salary calculations, deduction management, and payment tracking.

### Finance & Accounts

#### Expense Management (`/expenses`, `/expense-category`)

Track and categorize organizational expenses with approval workflows and category-based reporting.

#### Revenue (`/income`, `/invoices`, `/payments`, `/transactions`)

Income tracking, invoice generation and management, payment processing, and transaction ledger.

### Administration

#### Compliance Dashboard (`/compliance-dashboard`)

Real-time compliance scoring across five key regulatory categories: HIPAA Documentation, Patient Consent Forms, Medication Reconciliation, Discharge Summaries, and Infection Control. Each category displays pass/warning/fail status with an aggregate compliance score.

#### Roles & Permissions (`/roles-and-permissions`, `/permissions`)

Granular access control configuration. Define custom roles, assign permissions at the feature level, and manage user access across the platform.

#### Reports

Dedicated report pages for income (`/income-report`), expenses (`/expense-report`), profit & loss (`/profit-and-loss`), appointments (`/appointment-report`), and patient analytics (`/patient-report`).

### Settings

The settings module provides over 30 configuration pages covering:

- **Organization** — Profile, localization, prefixes, SEO setup
- **Communication** — Email settings, email templates, SMS gateways, SMS templates
- **Security** — Login/register settings, GDPR cookies, ban IP addresses
- **Financial** — Payment methods, bank accounts, tax rates, currencies, invoice settings and templates
- **System** — Storage, cronjobs, clear cache, system backup, database backup, system updates, maintenance mode

---

## Styling & Design System

### Design Principles

1. **Clinical Clarity** — High contrast ratios and clear visual hierarchy prioritize readability in fast-paced clinical environments.
2. **Role-Aware Density** — Admin dashboards use compact data-dense layouts; patient-facing pages use generous spacing and simplified language.
3. **Progressive Disclosure** — AI insights surface as cards and badges within existing workflows rather than separate interfaces, reducing context switching.
4. **Accessibility First** — All components target WCAG 2.1 AA compliance with keyboard navigation, screen reader support, and sufficient color contrast.

### Color System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#2E75B6` | Navigation, primary actions, links |
| Success | `#28A745` | Positive status, confirmations, pass indicators |
| Warning | `#FFC107` | Caution states, moderate risk, pending items |
| Danger | `#DC3545` | Critical alerts, errors, high-risk indicators |
| Info | `#17A2B8` | Informational badges, AI confidence indicators |
| Dark | `#343A40` | Text, headings, primary content |
| Light | `#F8F9FA` | Backgrounds, card surfaces, muted areas |

### AI Severity Palette

| Severity | Color | Badge Style |
|----------|-------|-------------|
| Critical | `#DC3545` | Solid fill, white text, pulse animation |
| Major/High | `#FD7E14` | Solid fill, white text |
| Moderate | `#FFC107` | Solid fill, dark text |
| Minor/Low | `#28A745` | Outline or muted fill |

### Typography

- **Primary Font:** System font stack (Roboto, -apple-system, BlinkMacSystemFont, Segoe UI)
- **Heading Scale:** H1 (24px) → H6 (12px) with consistent 1.25 ratio
- **Body Text:** 14px base, 1.5 line height
- **Monospace:** Used in code blocks, IDs, and technical references

### Component Library

The platform combines Ant Design and Bootstrap components:

- **Layout:** Bootstrap grid (12-column) with responsive breakpoints
- **Forms:** Ant Design form components with React Hook Form integration
- **Tables:** Ant Design tables with sorting, filtering, and pagination
- **Charts:** ApexCharts for interactive dashboards, Chart.js for embedded visualizations
- **Icons:** Tabler Icons (primary), Font Awesome, Bootstrap Icons
- **Modals & Drawers:** Ant Design overlays with consistent header/footer patterns
- **Drag & Drop:** `@hello-pangea/dnd` for kanban and reorderable interfaces

### Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| xs | <576px | Mobile |
| sm | ≥576px | Landscape mobile |
| md | ≥768px | Tablet |
| lg | ≥992px | Desktop |
| xl | ≥1200px | Large desktop |
| xxl | ≥1400px | Widescreen |

---

## Installation & Setup

### Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later (or **yarn** 1.22+)
- **Git** for version control

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ssmith129/Symplify-1.7.4.git
cd Symplify-1.7.4

# Install dependencies
npm install

# Start the development server
npm run dev
```

The development server starts at `http://localhost:5173` with hot module replacement enabled.

### Environment Configuration

Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000/ws

# AI Service Configuration
VITE_AI_SERVICE_URL=http://localhost:8000/ai
VITE_AI_ENABLED=true

# Feature Flags
VITE_ENABLE_VOICE_DOCS=true
VITE_ENABLE_DRUG_CHECKER=true
VITE_ENABLE_SHIFT_HANDOFF=true
```

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | TypeScript compilation + production build |
| `npm run lint` | Run ESLint with TypeScript-aware rules |
| `npm run preview` | Preview the production build locally |

---

## Usage Guidelines

### Role-Based Workflows

#### Administrator Workflow

1. Log in and review the personalized admin dashboard
2. Check compliance scores and address any flagged items
3. Review staff schedules and approve pending leave requests
4. Monitor revenue, appointments, and resource utilization
5. Use the AI Assistant for quick access to reports and operational data

#### Doctor Workflow

1. Log in to the doctor dashboard with today's patient queue
2. Review AI-surfaced clinical alerts and critical lab results
3. Conduct appointments with access to patient records and prescriptions
4. Use the drug interaction checker before prescribing medications
5. Dictate clinical notes using the voice documentation assistant

#### Nurse Workflow

1. Begin shift by reviewing the AI-generated shift handoff report
2. Check patient acuity scores and medication schedules
3. Monitor bed availability and clinical alerts throughout the shift
4. Use smart messaging for urgent clinical communications
5. End shift by generating an SBAR handoff for the incoming team

### AI Feature Best Practices

- **Confidence Scores** — AI recommendations display confidence percentages. Scores below 75% should be treated as suggestions requiring clinical judgment.
- **HIPAA Indicators** — Features processing protected health information display a HIPAA badge. All PHI interactions are logged.
- **Graceful Degradation** — If AI services are unavailable, the platform continues to function with standard (non-AI) interfaces. No clinical data is lost.
- **Role-Specific Actions** — Quick actions in the AI Assistant adapt to the logged-in user's role. Nurses see shift handoff and bed status; doctors see prescriptions and lab results.

---

## API Documentation

### AI Service Layer

All AI features communicate through a service layer defined in `src/core/ai/mockApi.ts`. In the current version, these services use simulated responses with realistic latency. The API interface is designed for seamless replacement with production AI endpoints.

#### Triage Assessment

```typescript
assessTriagePriority(request: TriageAssessmentRequest): Promise<TriageAssessmentResponse>
```

Accepts patient symptoms, vitals, and wait time. Returns a 1–5 priority level with confidence score and contributing factors.

#### Smart Scheduling

```typescript
getSmartSlotSuggestions(request: SchedulerRequest): Promise<SchedulerResponse>
getCalendarDaySlots(date: string): Promise<CalendarDaySlots>
bookCalendarSlot(slot: CalendarSlot, patientName?: string): Promise<BookedAppointment>
```

Provides AI-ranked appointment slots with factor breakdowns and booking confirmation.

#### Clinical Alerts

```typescript
getClinicalAlerts(): Promise<PredictiveAlert[]>
alertWebSocket.connect(onAlerts: AlertCallback): () => void
```

Fetches current predictive alerts or subscribes to real-time updates via mock WebSocket.

#### Message Analysis

```typescript
analyzeMessage(content: string): Promise<MessageAnalysis>
```

Analyzes message content for urgency, category, suggested recipients, and response templates.

#### Drug Interaction Checking

```typescript
checkDrugInteraction(message: string): Promise<DrugInteractionResult>
```

Parses medication names from input and returns severity-graded interaction data.

#### AI Assistant

```typescript
sendEnhancedAIMessage(
  message: string,
  conversationHistory: EnhancedAIMessage[],
  userRole: UserRoleType
): Promise<EnhancedAIConversationResponse>

getEnhancedQuickActions(role: UserRoleType): EnhancedQuickAction[]
```

The central AI conversation API with intent detection, structured response cards, and role-based quick actions.

#### Operational Queries

```typescript
getBedStatus(): Promise<BedStatusResult>
getComplianceStatus(): Promise<ComplianceStatusResult>
getPersonalizedLayout(userId: string, role: UserRole): Promise<PersonalizedLayout>
```

Returns current bed availability, compliance scores, and personalized dashboard configurations.

### Transitioning to Production APIs

Replace the mock implementations in `src/core/ai/mockApi.ts` with HTTP calls to your AI backend. The TypeScript interfaces in `src/core/ai/types.ts` define the exact request/response contracts that production endpoints should implement.

---

## Testing

### Recommended Testing Strategy

```bash
# Unit tests (component and utility testing)
npm run test

# End-to-end tests
npm run test:e2e

# Type checking
npx tsc --noEmit
```

### Testing AI Features

AI features use mock APIs by default, making them fully testable without external service dependencies. To test with live AI services, update the environment variables to point to your AI backend and set `VITE_AI_ENABLED=true`.

---

## Deployment

### Netlify (Current)

The platform is deployed at **[symplify-v4.netlify.app](https://symplify-v4.netlify.app/)** and configured for Netlify deployment with SPA rewrite rules:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Deploy via Netlify CLI or Git-based continuous deployment:

```bash
# Build for production
npm run build

# Output directory: dist/
```

### Alternative Deployment Targets

The production build outputs static files to `dist/` and can be deployed to any static hosting provider (Vercel, AWS S3 + CloudFront, Azure Static Web Apps, etc.). Ensure SPA fallback routing is configured to redirect all paths to `index.html`.

---

## Contributing Guidelines

### Getting Started

1. Fork the repository and create a feature branch from `main`
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Make your changes following the conventions below

### Code Conventions

- **TypeScript** — All new code must be written in TypeScript with explicit type annotations for function signatures and component props
- **Component Pattern** — Use functional components with React hooks; no class components
- **File Structure** — One component per file, co-located with related styles and tests
- **Naming** — PascalCase for components, camelCase for utilities, kebab-case for route paths
- **AI Components** — Place all AI-related components in `src/feature-module/components/ai/` and register exports in the feature's `index.ts`
- **Type Definitions** — Add AI feature types to `src/core/ai/types.ts` and mock implementations to `src/core/ai/mockApi.ts`

### Pull Request Process

1. Ensure `npm run lint` passes with no errors
2. Ensure `npm run build` completes successfully
3. Include a clear description of changes and screenshots for UI modifications
4. AI feature PRs should include mock API implementations and TypeScript interfaces
5. Request review from at least one team member

### Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch for features |
| `feature/*` | Individual feature development |
| `fix/*` | Bug fixes |
| `ai/*` | AI-specific feature branches |

---

## Troubleshooting

### Common Issues

**Development server fails to start**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**TypeScript compilation errors after dependency update**

```bash
# Regenerate type declarations
npx tsc --noEmit
# Check for conflicting type versions
npm ls @types/react
```

**AI features not loading**

- Verify `VITE_AI_ENABLED=true` in your `.env` file
- Check browser console for API connection errors
- Mock APIs include simulated latency (200–800ms) — features may appear to load slowly on initial render

**Blank page after build**

- Ensure `vercel.json` or your hosting provider's configuration includes SPA fallback routing
- Verify the `base` path in `vite.config.ts` matches your deployment URL

**SCSS compilation warnings**

```bash
# The project uses the modern Sass compiler (dart-sass 1.94)
# Legacy @import syntax may generate deprecation warnings — these are non-breaking
npm run build  # Warnings can be safely ignored
```

---

## Support & Contact

| Channel | Details |
|---------|---------|
| **Documentation** | AI feature guides in `/ai enhancements/` directory |
| **Design Critiques** | Available in project root as `Design-Critique_*.md` and `Compliance-Dashboard-Critique.md` |
| **Issue Tracker** | [GitHub Issues](https://github.com/ssmith129/Symplify-1.7.4/issues) |
| **Live Platform** | [symplify-v4.netlify.app](https://symplify-v4.netlify.app/) |
| **Repository** | [github.com/ssmith129/Symplify-1.7.4](https://github.com/ssmith129/Symplify-1.7.4.git) |

---

<p align="center">
  <strong>Symplify v1.7.4</strong> — Built with React, TypeScript, and AI-powered clinical intelligence.
</p>
