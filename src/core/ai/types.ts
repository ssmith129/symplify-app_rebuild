// AI Feature Types for Symplify Platform

// ============================================
// Feature 1: Smart Triage Priority Badge Types
// ============================================
export type TriagePriority = 1 | 2 | 3 | 4 | 5;

export interface VitalsData {
  heartRate?: number;
  bloodPressure?: { systolic: number; diastolic: number };
  temperature?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
}

export interface AcuityScore {
  patientId: string;
  priority: TriagePriority;
  confidence: number;
  factors: string[];
  timestamp: number;
}

export interface TriageAssessmentRequest {
  patientId: string;
  symptoms: string[];
  vitals?: VitalsData;
  waitTime: number;
}

export interface TriageAssessmentResponse {
  priority: TriagePriority;
  confidence: number;
  factors: string[];
}

// ============================================
// Feature 2: AI Dashboard Personalization Types
// ============================================
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'triage';

export interface WidgetSuggestion {
  widgetId: string;
  priority: number;
  reason: string;
}

export interface DashboardInteraction {
  userId: string;
  widgetId: string;
  action: 'view' | 'click' | 'expand' | 'collapse' | 'dismiss';
  timestamp: number;
}

export interface PersonalizedLayout {
  userId: string;
  role: UserRole;
  widgets: string[];
  aiSuggestions: WidgetSuggestion[];
}

// ============================================
// Feature 3: Intelligent Appointment Scheduler Types
// ============================================
export interface SlotFactors {
  providerPreference: number;
  patientConvenience: number;
  noShowRisk: number;
  waitTimeOptimal: number;
}

export interface SlotSuggestion {
  datetime: string;
  score: number;
  factors: SlotFactors;
  conflicts: string[];
  providerId: string;
  providerName: string;
}

export interface SchedulerRequest {
  patientId: string;
  appointmentType: string;
  preferredDateRange?: { start: string; end: string };
}

export interface SchedulerResponse {
  slots: SlotSuggestion[];
  patientPreferences: {
    preferredTime: string;
    historicalNoShowRate: number;
  };
}

// ============================================
// Feature 4: Clinical Alert Prediction System Types
// ============================================
export type RiskLevel = 'critical' | 'high' | 'moderate' | 'low';

export interface PredictiveAlert {
  id: string;
  patientId: string;
  patientName: string;
  patientImage: string;
  riskLevel: RiskLevel;
  predictedEvent: string;
  timeframe: string;
  confidence: number;
  contributingFactors: string[];
  recommendedActions: string[];
  timestamp: number;
}

export interface ClinicalAlertState {
  alerts: PredictiveAlert[];
  connected: boolean;
  lastUpdated: number;
}

// ============================================
// Feature 5: Smart Message Router Types
// ============================================
export type MessageUrgency = 'critical' | 'high' | 'normal' | 'low';

export interface SuggestedRecipient {
  id: string;
  name: string;
  role: string;
  avatar: string;
  relevance: number;
}

export interface MessageAnalysis {
  urgency: MessageUrgency;
  category: string;
  suggestedRecipients: SuggestedRecipient[];
  suggestedResponses: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'urgent';
  keywords: string[];
}

// ============================================
// Feature 6: AI Assistant Chatbot Types
// ============================================
export type ChatCardType =
  | 'triage'
  | 'alert'
  | 'slot'
  | 'drug-interaction'
  | 'patient-summary'
  | 'confirmation'
  | 'bed-status'
  | 'compliance';

export interface ChatCard {
  type: ChatCardType;
  data: Record<string, unknown>;
}

export interface DrugInteractionResult {
  drug1: string;
  drug2: string;
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  description: string;
  recommendation: string;
  confidence: number;
}

export interface BedStatusResult {
  totalBeds: number;
  occupied: number;
  available: number;
  departments: { name: string; available: number; total: number }[];
}

export interface ComplianceStatusResult {
  overallScore: number;
  categories: { name: string; score: number; status: 'pass' | 'warning' | 'fail' }[];
  pendingItems: number;
}

export interface ExpandedViewConfig {
  type: 'calendar' | 'drug-interaction' | 'shift-handoff' | 'alerts' | 'scheduler';
  title: string;
  data?: Record<string, unknown>;
}

export type QuickActionCategory = 'clinical' | 'administrative' | 'navigation';

export interface EnhancedQuickAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  roles: ('doctor' | 'nurse' | 'admin')[];
  category: QuickActionCategory;
  contextual?: boolean;
  timeRange?: { start: number; end: number };
}

export interface EnhancedAIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  actions?: import('../ai/mockApi').AIAction[];
  navigationLink?: string;
  cards?: ChatCard[];
  confidence?: number;
  hipaaProtected?: boolean;
  expandable?: boolean;
  expandedView?: ExpandedViewConfig;
}

// ============================================
// Redux State Types
// ============================================
export interface AIState {
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
